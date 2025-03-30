from flask import Flask, request, jsonify, render_template
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.cluster import KMeans
import shap
import joblib
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Check if model files exist
MODEL_FILES = ["student_model.joblib", "scaler.joblib", "encoder.joblib", "student-combined-final.csv"]
missing_files = [f for f in MODEL_FILES if not os.path.exists(f)]
if missing_files:
    logger.error(f"Missing required model files: {missing_files}")
    raise FileNotFoundError(f"Missing required model files: {missing_files}")

# Load pre-trained model, scaler, and encoder
try:
    model = joblib.load("student_model.joblib")
    scaler = joblib.load("scaler.joblib")
    encoder = joblib.load("encoder.joblib")
    logger.info("Successfully loaded model files")
except Exception as e:
    logger.error(f"Error loading model files: {str(e)}")
    raise

# Load original dataset for clustering and peer benchmarking
try:
    data_path = "student-combined-final.csv"
    data = pd.read_csv(data_path, sep=';')
    logger.info("Successfully loaded dataset")
except Exception as e:
    logger.error(f"Error loading dataset: {str(e)}")
    raise

# Define columns (same as training)
number_columns = [
    "age", "Medu", "Fedu", "traveltime", "studytime", "failures",
    "famrel", "freetime", "goout", "Dalc", "Walc", "health", "absences",
    "G1", "G2", "study_effort", "alcohol_index", "parents_education",
    "grade_change", "high_absences"
]
word_columns = [
    "school", "sex", "famsize", "Pstatus", "Mjob", "Fjob", "reason",
    "guardian", "schoolsup", "famsup", "paid", "activities", "nursery",
    "higher", "internet", "romantic"
]

def add_new_columns(data):
    """Add engineered features to the dataset."""
    if 'G3' in data.columns:
        data["final_grade"] = (data["G1"] + data["G2"] + data["G3"]) / 3
        data["final_grade"] = data["final_grade"].round(2)
    else:
        data['final_grade'] = np.nan
    data["alcohol_index"] = data["Dalc"] + data["Walc"]
    data["parents_education"] = data["Medu"] + data["Fedu"]
    data["grade_change"] = data["G2"] - data["G1"]
    avg_absences = data["absences"].mean()
    data["high_absences"] = data["absences"].apply(lambda x: 1 if x > avg_absences else 0)
    data["study_effort"] = data["studytime"] * (5 - data["traveltime"])
    return data

# Add engineered features to original data before clustering
data = add_new_columns(data)

# Preprocess for clustering
X_scaled = scaler.transform(data[number_columns])
clusters = KMeans(n_clusters=3, random_state=42).fit_predict(X_scaled)
data["cluster"] = clusters

def process_user_data(user_input):
    """Process user input, predict risk, and generate insights."""
    # Convert user input to DataFrame
    user_df = pd.DataFrame([user_input])
    user_df = add_new_columns(user_df)
    
    # Preprocess for model
    user_numbers = scaler.transform(user_df[number_columns])
    user_words = encoder.transform(user_df[word_columns])
    user_ready = np.hstack((user_numbers, user_words))
    
    # Predict with Random Forest
    risk_prob = model.predict_proba(user_ready)[0][1]  # Probability of at_risk = 1
    at_risk = model.predict(user_ready)[0]  # 0 or 1
    
    # SHAP analysis (explain risk probability, class 1)
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(user_ready)
    if isinstance(shap_values, list) and len(shap_values) > 1:
        shap_values_class = shap_values[1]  # Class 1 (risk)
    else:
        shap_values_class = shap_values[0] if isinstance(shap_values, list) else shap_values
    
    feature_names = number_columns + list(encoder.get_feature_names_out(word_columns))
    shap_values_class = np.ravel(shap_values_class)  # Ensure 1D array of scalars
    shap_contributions = {k: float(v) for k, v in zip(feature_names, shap_values_class)}
    
    # Generate insights
    insights = {}
    base_threshold = 0.5
    threshold_adjust = 0.1 * (user_df["parents_education"].iloc[0] / 8)
    dynamic_threshold = min(base_threshold + threshold_adjust, 1.0)
    risk_label = "High" if risk_prob > dynamic_threshold else "Low" if risk_prob < 0.3 else "Medium"
    insights["dynamic_risk"] = {"probability": f"{risk_prob:.2f}", "label": risk_label, "threshold": f"{dynamic_threshold:.2f}"}
    
    # Feature interaction insights
    shap_interactions = explainer.shap_interaction_values(user_ready)
    if isinstance(shap_interactions, list) and len(shap_interactions) > 1:
        shap_interactions_class = shap_interactions[1]
    else:
        shap_interactions_class = shap_interactions[0] if isinstance(shap_interactions, list) else shap_interactions
    
    if shap_interactions_class.ndim == 2 and shap_interactions_class.shape[0] > 1:
        top_interaction_idx = np.argmax(np.abs(shap_interactions_class))
        feature1, feature2 = np.unravel_index(top_interaction_idx, shap_interactions_class.shape)
        interaction_value = float(shap_interactions_class[feature1, feature2])
        insights["top_interaction"] = f"{feature_names[feature1]} + {feature_names[feature2]}: {interaction_value:.2f}"
    else:
        insights["top_interaction"] = "No significant interactions detected"
    
    # Peer benchmarking
    user_cluster = clusters[np.argmin(np.sum((X_scaled - user_numbers)**2, axis=1))]
    peer_avg = data[data["cluster"] == user_cluster][["studytime", "absences", "G1"]].mean()
    if peer_avg.isna().any():  # Handle empty cluster
        peer_avg = pd.Series({"studytime": 0, "absences": 0, "G1": 0})
    insights["peer_benchmark"] = {
        "studytime": f"Yours: {user_df['studytime'].iloc[0]} vs. Peer Avg: {peer_avg['studytime']:.1f}",
        "absences": f"Yours: {user_df['absences'].iloc[0]} vs. Peer Avg: {peer_avg['absences']:.1f}",
        "G1": f"Yours: {user_df['G1'].iloc[0]} vs. Peer Avg: {peer_avg['G1']:.1f}"
    }
    
    # Predictive "What-If" Scenarios
    def what_if(user_df, feature, new_value):
        mod_df = user_df.copy()
        mod_df[feature] = new_value
        if feature in ["studytime", "traveltime"]:
            mod_df["study_effort"] = mod_df["studytime"] * (5 - mod_df["traveltime"])
        elif feature == "absences":
            avg_absences = data["absences"].mean()
            mod_df["high_absences"] = mod_df["absences"].apply(lambda x: 1 if x > avg_absences else 0)
        elif feature in ["Dalc", "Walc"]:
            mod_df["alcohol_index"] = mod_df["Dalc"] + mod_df["Walc"]
        mod_numbers = scaler.transform(mod_df[number_columns])
        mod_words = encoder.transform(mod_df[word_columns])
        mod_ready = np.hstack((mod_numbers, mod_words))
        return model.predict_proba(mod_ready)[0][1]
    
    what_if_study = what_if(user_df, "studytime", user_df["studytime"].iloc[0] + 1)
    what_if_absences = what_if(user_df, "absences", max(0, user_df["absences"].iloc[0] - 5))
    insights["what_if"] = {
        "current": f"{risk_prob:.2f}",
        "study_plus_1": f"{what_if_study:.2f}",
        "absences_minus_5": f"{what_if_absences:.2f}"
    }
    
    # Temporal Grade Trajectory
    trajectory = [float(user_df["G1"].iloc[0]), float(user_df["G2"].iloc[0])]
    if "G3" in user_df and not pd.isna(user_df["G3"].iloc[0]):
        trajectory.append(float(user_df["G3"].iloc[0]))
    else:
        diff = trajectory[-1] - trajectory[-2]
        trajectory.append(trajectory[-1] + diff if diff != 0 else trajectory[-1])
    insights["trajectory"] = trajectory
    
    # Behavioral Risk Profiles
    categories = {
        "Academic Effort": ["studytime", "failures", "study_effort"],
        "Lifestyle": ["Dalc", "Walc", "goout", "alcohol_index"],
        "Support": ["famrel", "parents_education"]
    }
    risk_profile = {}
    total_shap = np.sum([abs(v) for v in shap_contributions.values()]) or 1
    for category, feats in categories.items():
        contrib = sum(shap_contributions.get(feat, 0) for feat in feats)
        risk_profile[category] = (contrib / total_shap) * risk_prob * 100 if total_shap > 0 else 0
    insights["risk_profile"] = {k: f"{v:.1f}%" for k, v in risk_profile.items()}
    
    # Intervention Impact Scores
    interventions = [
        ("studytime", user_df["studytime"].iloc[0] + 1, "Study +1 hr"),
        ("absences", max(0, user_df["absences"].iloc[0] - 5), "Attend 5 more classes")
    ]
    impact_scores = []
    for feat, new_val, label in interventions:
        new_risk = what_if(user_df, feat, new_val)
        impact = risk_prob - new_risk
        if impact > 0.01:
            impact_scores.append(f"{label}: -{impact:.2f}")
    insights["interventions"] = impact_scores if impact_scores else ["No significant impact detected"]
    
    # Resilience Indicators
    resilience = {k: v for k, v in shap_contributions.items() if v < 0 and k in ["famrel", "parents_education", "schoolsup"]}
    insights["resilience"] = [f"{k}: {-v:.2f}" for k, v in resilience.items()] if resilience else ["No major resilience factors"]
    
    # Subject-Specific Risk (Placeholder)
    insights["subject_risk"] = {
        "Math": f"{risk_prob:.2f}",
        "Portuguese": f"{max(0, risk_prob - 0.1):.2f}"
    }
    
    # Anomaly Detection Flags
    anomalies = []
    if user_df["G1"].iloc[0] > 12 and user_df["absences"].iloc[0] > data["absences"].mean():
        anomalies.append("High grades but rising absences")
    insights["anomalies"] = anomalies if anomalies else ["No unusual patterns"]
    
    # Compile Final Output
    result = {
        "student_id": int(pd.Timestamp.now().timestamp()),
        "risk_probability": float(risk_prob),
        "at_risk": int(at_risk),
        "final_grade": float(user_df["final_grade"].iloc[0]) if "G3" in user_df and not pd.isna(user_df["final_grade"].iloc[0]) else None,
        "alcohol_index": int(user_df["alcohol_index"].iloc[0]),
        "insights": insights
    }
    return result

@app.route('/')
def home():
    """Root route that returns a simple welcome message"""
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from the request
        user_input = request.json
        if not user_input:
            return jsonify({"error": "No input data provided"}), 400
            
        # Process the user input
        result = process_user_data(user_input)
        # Return the result as JSON
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)