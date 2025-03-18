import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export interface StudentData {
  name: string;
  gpa: number;
  attendance: number;
  studyHours: number;
  assignmentCompletion: number;
  classParticipation: number;
  testPerformance: number;
}

export interface PredictionResult {
  predictedGrade: number;
  confidence: number;
  factors: {
    name: string;
    value: number;
    impact: number;
    description: string;
    color: string;
  }[];
  insights: {
    risk: 'high' | 'medium' | 'low';
    description: string;
    recommendations: string[];
  };
}

export async function getStudentPrediction(studentData: StudentData): Promise<PredictionResult> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Analyze the following student data and provide a detailed prediction:
    Name: ${studentData.name}
    GPA: ${studentData.gpa}
    Attendance: ${studentData.attendance}%
    Study Hours (weekly): ${studentData.studyHours}
    Assignment Completion: ${studentData.assignmentCompletion}%
    Class Participation: ${studentData.classParticipation}%
    Test Performance: ${studentData.testPerformance}%

    Please provide:
    1. Predicted final grade (0-100)
    2. Confidence level (0-100)
    3. Key factors affecting performance with their impact scores (-1 to 1)
    4. Risk level (high/medium/low)
    5. Detailed insights
    6. Specific recommendations

    Format the response as a JSON object with the following structure:
    {
      "predictedGrade": number,
      "confidence": number,
      "factors": [
        {
          "name": string,
          "value": number,
          "impact": number,
          "description": string,
          "color": string
        }
      ],
      "insights": {
        "risk": "high" | "medium" | "low",
        "description": string,
        "recommendations": string[]
      }
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    const prediction = JSON.parse(text);
    
    // Add color coding to factors based on impact
    prediction.factors = prediction.factors.map((factor: any) => ({
      ...factor,
      color: factor.impact >= 0 ? '#22c55e' : '#ef4444'
    }));

    return prediction;
  } catch (error) {
    console.error('Error getting prediction:', error);
    throw error;
  }
} 