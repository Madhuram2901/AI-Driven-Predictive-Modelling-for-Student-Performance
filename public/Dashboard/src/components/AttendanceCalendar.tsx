
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AttendanceCalendarProps {
  className?: string;
  studentName?: string;
}

// Generate mock attendance data for demo
const generateAttendanceData = () => {
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);
  
  const presentDates: Date[] = [];
  const absentDates: Date[] = [];
  const lateDates: Date[] = [];
  
  // Loop through the last 30 days and randomly mark dates
  for (let d = new Date(oneMonthAgo); d <= today; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();
    
    // Skip weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;
    
    const random = Math.random();
    const dateClone = new Date(d);
    
    if (random < 0.7) {
      presentDates.push(dateClone);
    } else if (random < 0.9) {
      lateDates.push(dateClone);
    } else {
      absentDates.push(dateClone);
    }
  }
  
  return { presentDates, absentDates, lateDates };
};

const { presentDates, absentDates, lateDates } = generateAttendanceData();

const AttendanceCalendar = ({ className, studentName }: AttendanceCalendarProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'student' | 'class'>('class');
  
  // Instead of using a function in the classNames prop, we'll modify the calendar component
  const modifiers = {
    present: presentDates,
    late: lateDates,
    absent: absentDates,
  };
  
  const modifiersClassNames = {
    present: "bg-green-100 text-green-900 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30",
    late: "bg-amber-100 text-amber-900 hover:bg-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/30",
    absent: "bg-red-100 text-red-900 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Attendance</CardTitle>
            <CardDescription>
              {studentName 
                ? `Attendance records for ${studentName}` 
                : "Class attendance overview"}
            </CardDescription>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {view === 'student' ? 'Student View' : 'Class View'}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setView('student')}>
                Student View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setView('class')}>
                Class View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          classNames={{
            day_selected: "",
          }}
        />
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex gap-2 text-sm">
          <Badge variant="outline" className="bg-green-100 text-green-900 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400">
            Present
          </Badge>
          <Badge variant="outline" className="bg-amber-100 text-amber-900 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400">
            Late
          </Badge>
          <Badge variant="outline" className="bg-red-100 text-red-900 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400">
            Absent
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          {presentDates.length} present, {lateDates.length} late, {absentDates.length} absent
        </div>
      </CardFooter>
    </Card>
  );
};

export default AttendanceCalendar;
