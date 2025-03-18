
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Lightbulb, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Student = {
  id: number;
  name: string;
  grade: string;
  gpa: number;
  attendance: number;
  studyHours: number;
  risk: 'low' | 'medium' | 'high';
  prediction: number;
  trend: 'up' | 'down' | 'stable';
};

interface StudentCardProps {
  student: Student;
  onClick?: () => void;
}

const StudentCard = ({ student, onClick }: StudentCardProps) => {
  const getRiskColor = (risk: Student['risk']) => {
    switch (risk) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    }
  };

  const getTrendIcon = (trend: Student['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case 'stable':
        return <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    }
  };

  return (
    <Card 
      className={cn(
        "hover-scale overflow-hidden transition-all bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/70 dark:border-gray-700/30",
        student.risk === 'high' && "ring-1 ring-red-200 dark:ring-red-900/30",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                {student.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{student.name}</p>
              <p className="text-sm text-muted-foreground">Grade {student.grade}</p>
            </div>
          </div>
          
          {student.risk === 'high' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="rounded-full bg-red-100 p-1 dark:bg-red-900/20">
                    <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>High risk student</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">GPA</p>
            <p className="font-medium">{student.gpa.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Attendance</p>
            <p className="font-medium">{student.attendance}%</p>
          </div>
          <div>
            <p className="text-muted-foreground">Study (weekly)</p>
            <p className="font-medium">{student.studyHours}h</p>
          </div>
          <div>
            <p className="text-muted-foreground">Prediction</p>
            <p className="font-medium flex items-center">
              {student.prediction.toFixed(1)}
              <span className="ml-1">{getTrendIcon(student.trend)}</span>
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Badge variant="outline" className={cn("text-xs", getRiskColor(student.risk))}>
          {student.risk.charAt(0).toUpperCase() + student.risk.slice(1)} Risk
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default StudentCard;
