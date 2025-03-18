
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface GradePredictionProps {
  prediction: number; // 0 to 100
  confidence: number; // 0 to 100
  previousGrade?: number;
  trend: 'up' | 'down' | 'stable';
  className?: string;
}

const GradePrediction = ({ 
  prediction, 
  confidence, 
  previousGrade, 
  trend, 
  className 
}: GradePredictionProps) => {
  const getGradeLetter = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const getColorForGrade = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-amber-600 dark:text-amber-400';
    if (score >= 60) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-green-600 dark:bg-green-500';
    if (score >= 80) return 'bg-blue-600 dark:bg-blue-500';
    if (score >= 70) return 'bg-amber-600 dark:bg-amber-500';
    if (score >= 60) return 'bg-orange-600 dark:bg-orange-500';
    return 'bg-red-600 dark:bg-red-500';
  };

  const getTrendIndicator = () => {
    if (!previousGrade) return null;
    
    const difference = prediction - previousGrade;
    
    return (
      <span className={cn(
        "text-sm ml-2",
        difference > 0 ? "text-green-600 dark:text-green-400" : 
        difference < 0 ? "text-red-600 dark:text-red-400" : 
        "text-muted-foreground"
      )}>
        {difference > 0 && '+'}
        {difference.toFixed(1)}
      </span>
    );
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>Grade Prediction</CardTitle>
        <CardDescription>Projected final grade based on current performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center p-4">
            <div className="text-6xl font-bold mb-2 flex items-center">
              <span className={getColorForGrade(prediction)}>
                {getGradeLetter(prediction)}
              </span>
              {getTrendIndicator()}
            </div>
            <div className="text-xl text-muted-foreground">
              {prediction.toFixed(1)}%
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Projected Score</span>
              <span>{prediction.toFixed(1)}%</span>
            </div>
            <Progress
              value={prediction}
              className="h-2"
              indicatorClassName={getProgressColor(prediction)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Prediction Confidence</span>
              <span>{confidence}%</span>
            </div>
            <Progress
              value={confidence}
              className="h-2"
              indicatorClassName="bg-primary"
            />
          </div>
          
          {previousGrade && (
            <div className="pt-2 text-sm text-muted-foreground border-t">
              Previous grade: {previousGrade.toFixed(1)}% ({getGradeLetter(previousGrade)})
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GradePrediction;
