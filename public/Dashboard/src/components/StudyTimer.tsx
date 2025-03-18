
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface StudyTimerProps {
  onComplete?: (duration: number) => void;
  defaultDuration?: number; // in minutes
  subject?: string;
}

const StudyTimer = ({ 
  onComplete, 
  defaultDuration = 25, 
  subject = "General Study" 
}: StudyTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(defaultDuration * 60); // convert to seconds
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        setSessionDuration((prev) => prev + 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      if (onComplete) {
        onComplete(sessionDuration / 60); // convert to minutes
      }
      toast.success(`Study session completed! You studied for ${Math.round(sessionDuration / 60)} minutes.`);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onComplete, sessionDuration]);
  
  const toggleTimer = () => {
    setIsActive(!isActive);
    setIsPaused(false);
  };
  
  const pauseTimer = () => {
    setIsActive(false);
    setIsPaused(true);
  };
  
  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(defaultDuration * 60);
    setSessionDuration(0);
  };
  
  // Format time in MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const formatSessionTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m ${seconds % 60}s`;
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Clock className="h-5 w-5 mr-2 text-primary" />
          Study Timer - {subject}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3 text-center">
        <div className="text-5xl font-bold mb-3">{formatTime(timeLeft)}</div>
        <div className="text-sm text-muted-foreground">
          {isActive ? 'Currently studying' : isPaused ? 'Paused' : 'Ready to start'}
        </div>
        {sessionDuration > 0 && (
          <div className="mt-2 text-xs text-primary font-medium">
            Session duration: {formatSessionTime(sessionDuration)}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center gap-2">
        {!isActive && !isPaused && (
          <Button onClick={toggleTimer} className="px-6">
            <Play className="h-4 w-4 mr-2" />
            Start
          </Button>
        )}
        {isActive && (
          <Button onClick={pauseTimer} variant="outline" className="px-6">
            <Pause className="h-4 w-4 mr-2" />
            Pause
          </Button>
        )}
        {isPaused && (
          <Button onClick={toggleTimer} className="px-6">
            <Play className="h-4 w-4 mr-2" />
            Resume
          </Button>
        )}
        <Button onClick={resetTimer} variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StudyTimer;
