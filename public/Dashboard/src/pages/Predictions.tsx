import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';
import Navbar from '@/components/Navbar';
import ShapVisualization from '@/components/ShapVisualization';
import GradePrediction from '@/components/GradePrediction';
import { getStudentPrediction, type StudentData, type PredictionResult } from '@/services/gemini';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Brain, BookOpen, Clock, Users, Target, AlertTriangle, Lightbulb } from 'lucide-react';

// Mock student data (replace with actual data from your system)
const mockStudentData: StudentData = {
  name: 'John Doe',
  gpa: 3.5,
  attendance: 85,
  studyHours: 8,
  assignmentCompletion: 90,
  classParticipation: 75,
  testPerformance: 82,
};

const Predictions = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoadingPrediction, setIsLoadingPrediction] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        setIsLoadingPrediction(true);
        const result = await getStudentPrediction(mockStudentData);
        setPrediction(result);
      } catch (err) {
        setError('Failed to generate prediction. Please try again later.');
        console.error('Error fetching prediction:', err);
      } finally {
        setIsLoadingPrediction(false);
      }
    };

    if (isAuthenticated) {
      fetchPrediction();
    }
  }, [isAuthenticated]);
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-950 dark:to-gray-900">
        <Navbar />
        <main className="container px-4 pt-20 pb-10 mx-auto max-w-[1600px]">
          <div className="text-center text-red-600 dark:text-red-400">
            <p>{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        </main>
      </div>
    );
  }
  
  if (isLoadingPrediction || !prediction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-950 dark:to-gray-900">
        <Navbar />
        <main className="container px-4 pt-20 pb-10 mx-auto max-w-[1600px]">
          <div className="text-center">
            <div className="animate-pulse text-primary">Generating prediction...</div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-950 dark:to-gray-900">
      <Navbar />
      
      <main className="container px-4 pt-20 pb-10 mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <section className="mt-4">
            <h1 className="text-3xl font-bold tracking-tight animate-fade-in">AI Predictions</h1>
            <p className="text-muted-foreground mt-1 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Machine learning predictions and insights for your academic performance.
            </p>
          </section>
          
          {/* Model Information */}
          <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Card className="bg-gradient-to-br from-primary/5 to-indigo-500/5 border-primary/10">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <CardTitle>AI Prediction Model</CardTitle>
                </div>
                <CardDescription>
                  Understanding how our AI predicts your academic performance
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium">How It Works</h3>
                  <p className="text-sm">
                    Our AI prediction model analyzes multiple factors like attendance, study habits, 
                    previous grades, and classroom engagement to forecast academic outcomes. The model
                    is trained on historical student data and continuously improves over time.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Performance Metrics</h3>
                  <p className="text-sm">
                    The model achieves 85% accuracy in predicting final grades within 
                    a 5% margin. Its performance is regularly evaluated and improved based on 
                    new data and feedback from educators.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Interpretability</h3>
                  <p className="text-sm">
                    Using SHAP (SHapley Additive exPlanations) values, we make the AI's decision-making 
                    transparent by showing exactly which factors influence each prediction and by how much.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
          
          {/* Prediction Details */}
          <section className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Tabs defaultValue="prediction" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="prediction">Prediction</TabsTrigger>
                <TabsTrigger value="factors">Influential Factors</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>
              
              {/* Prediction Tab */}
              <TabsContent value="prediction">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Student Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-14 w-14">
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {mockStudentData.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-lg">{mockStudentData.name}</h3>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-2 text-sm mt-4">
                        <div>
                          <p className="text-muted-foreground">Current GPA</p>
                          <p className="font-medium">{mockStudentData.gpa.toFixed(1)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Attendance</p>
                          <p className="font-medium">{mockStudentData.attendance}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Study (weekly)</p>
                          <p className="font-medium">{mockStudentData.studyHours}h</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Risk Level</p>
                          <Badge variant="outline" className={
                            prediction.insights.risk === 'high' 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                              : prediction.insights.risk === 'medium'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          }>
                            {prediction.insights.risk.charAt(0).toUpperCase() + prediction.insights.risk.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Grade Prediction */}
                  <GradePrediction 
                    prediction={prediction.predictedGrade} 
                    confidence={prediction.confidence}
                    previousGrade={mockStudentData.gpa * 25}
                    trend={prediction.predictedGrade > mockStudentData.gpa * 25 ? 'up' : 'down'}
                  />
                  
                  {/* AI Insights */}
                  <Card className="bg-gradient-to-br from-primary/10 to-indigo-500/10 backdrop-blur-sm border-primary/20">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-primary" />
                        <CardTitle>AI Insights</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className={`flex gap-2 items-start ${
                        prediction.insights.risk === 'high' ? 'text-red-600 dark:text-red-400' :
                        prediction.insights.risk === 'medium' ? 'text-amber-600 dark:text-amber-400' :
                        'text-green-600 dark:text-green-400'
                      }`}>
                        {prediction.insights.risk === 'high' ? (
                          <AlertTriangle className="h-4 w-4 mt-0.5" />
                        ) : (
                          <Target className="h-4 w-4 mt-0.5" />
                        )}
                        <p className="text-sm">
                          <span className="font-medium">
                            {prediction.insights.risk === 'high' ? 'High Risk Alert:' :
                             prediction.insights.risk === 'medium' ? 'Monitoring Recommended:' :
                             'Strong Performance:'}
                          </span>{' '}
                          {prediction.insights.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Factors Tab */}
              <TabsContent value="factors">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ShapVisualization features={prediction.factors} />
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Understanding the Factors</CardTitle>
                      <CardDescription>
                        How these variables affect your academic performance
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {prediction.factors.map((factor, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className={`p-1.5 rounded-full mt-0.5 ${
                              factor.impact >= 0 
                                ? 'bg-green-100 dark:bg-green-900/30' 
                                : 'bg-red-100 dark:bg-red-900/30'
                            }`}>
                              {factor.impact >= 0 ? (
                                <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium">{factor.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {factor.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Recommendations Tab */}
              <TabsContent value="recommendations">
                <Card>
                  <CardHeader>
                    <CardTitle>Personalized Recommendations</CardTitle>
                    <CardDescription>
                      AI-generated intervention strategies for your academic success
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className={`rounded-md p-4 ${
                        prediction.insights.risk === 'high' 
                          ? 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30' :
                        prediction.insights.risk === 'medium'
                          ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30'
                          : 'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30'
                      }`}>
                        <h3 className={`font-medium mb-2 ${
                          prediction.insights.risk === 'high' 
                            ? 'text-red-800 dark:text-red-300' :
                          prediction.insights.risk === 'medium'
                            ? 'text-amber-800 dark:text-amber-300'
                            : 'text-green-800 dark:text-green-300'
                        }`}>
                          {prediction.insights.risk === 'high' 
                            ? 'Immediate Intervention Required' :
                           prediction.insights.risk === 'medium'
                            ? 'Targeted Support Recommended'
                            : 'Enrichment Opportunities'}
                        </h3>
                        
                        <div className="space-y-3">
                          {prediction.insights.recommendations.map((recommendation, index) => (
                            <div key={index} className="flex gap-2">
                              <div className={`rounded-full p-1 h-6 w-6 flex items-center justify-center text-xs font-medium ${
                                prediction.insights.risk === 'high' 
                                  ? 'bg-white dark:bg-black/20 text-red-600 dark:text-red-400' :
                                prediction.insights.risk === 'medium'
                                  ? 'bg-white dark:bg-black/20 text-amber-600 dark:text-amber-400'
                                  : 'bg-white dark:bg-black/20 text-green-600 dark:text-green-400'
                              }`}>
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <p className={`text-sm font-medium ${
                                  prediction.insights.risk === 'high' 
                                    ? 'text-red-800 dark:text-red-300' :
                                  prediction.insights.risk === 'medium'
                                    ? 'text-amber-800 dark:text-amber-300'
                                    : 'text-green-800 dark:text-green-300'
                                }`}>
                                  {recommendation}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button className="w-full md:w-auto">
                      Generate Detailed Action Plan
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Predictions;
