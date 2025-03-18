import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';
import Navbar from '@/components/Navbar';
import PerformanceChart from '@/components/PerformanceChart';
import AttendanceCalendar from '@/components/AttendanceCalendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, BookOpen, Clock, GraduationCap, LineChart, Users } from 'lucide-react';
import { 
  getStoredSubjects, 
  getStoredHistoricalGPA,
  GRADE_MAPPING,
  GRADE_PERCENTAGE
} from '@/utils/grade-constants';

// Mock data for the student dashboard
const studentPerformance = [
  { name: 'Week 1', gpa: 3.2, attendance: 90, studyHours: 10 },
  { name: 'Week 2', gpa: 3.4, attendance: 100, studyHours: 12 },
  { name: 'Week 3', gpa: 3.3, attendance: 80, studyHours: 8 },
  { name: 'Week 4', gpa: 3.5, attendance: 90, studyHours: 14 },
  { name: 'Week 5', gpa: 3.6, attendance: 100, studyHours: 15 },
  { name: 'Week 6', gpa: 3.7, attendance: 90, studyHours: 16 },
  { name: 'Week 7', gpa: 3.6, attendance: 80, studyHours: 12 },
  { name: 'Week 8', gpa: 3.8, attendance: 100, studyHours: 18 },
];

// Get assignments from localStorage or use defaults
const getStoredAssignments = () => {
  const stored = localStorage.getItem('assignments');
  if (stored) {
    return JSON.parse(stored);
  }
  return [
    { 
      id: 1, 
      title: 'Mathematics Homework 3.4', 
      description: 'Complete exercises 1-15, show all work', 
      subject: 'Mathematics', 
      dueDate: '2023-11-20', 
      status: 'pending',
      priority: 'high',
      estimatedHours: 2
    },
    { 
      id: 2, 
      title: 'Physics Lab Report', 
      description: 'Write up results from the pendulum experiment', 
      subject: 'Physics', 
      dueDate: '2023-11-22', 
      status: 'in-progress',
      priority: 'medium',
      estimatedHours: 3
    },
    { 
      id: 3, 
      title: 'History Essay', 
      description: 'Research paper on the Industrial Revolution', 
      subject: 'History', 
      dueDate: '2023-11-25', 
      status: 'in-progress',
      priority: 'high',
      estimatedHours: 5
    }
  ];
};

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [subjects, setSubjects] = useState(getStoredSubjects());
  const [historicalGPA, setHistoricalGPA] = useState(getStoredHistoricalGPA());
  const [assignments, setAssignments] = useState(getStoredAssignments());
  const [attendanceRate, setAttendanceRate] = useState(0);
  
  useEffect(() => {
    // Update assignments when localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'assignments' && e.newValue) {
        setAssignments(JSON.parse(e.newValue));
      }
      if (e.key === 'attendanceData' && e.newValue) {
        const data = JSON.parse(e.newValue);
        const totalClasses = data.reduce((sum: number, subject: any) => sum + subject.totalClasses, 0);
        const totalAttended = data.reduce((sum: number, subject: any) => sum + subject.attended, 0);
        setAttendanceRate((totalAttended / totalClasses) * 100);
      }
    };

    // Initial load from localStorage
    const storedAssignments = localStorage.getItem('assignments');
    if (storedAssignments) {
      setAssignments(JSON.parse(storedAssignments));
    }

    const storedAttendanceData = localStorage.getItem('attendanceData');
    if (storedAttendanceData) {
      const data = JSON.parse(storedAttendanceData);
      const totalClasses = data.reduce((sum: number, subject: any) => sum + subject.totalClasses, 0);
      const totalAttended = data.reduce((sum: number, subject: any) => sum + subject.attended, 0);
      setAttendanceRate((totalAttended / totalClasses) * 100);
    }

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Refresh assignments when component mounts and after any changes
  useEffect(() => {
    const storedAssignments = localStorage.getItem('assignments');
    if (storedAssignments) {
      setAssignments(JSON.parse(storedAssignments));
    }
  }, []);

  // Calculate current GPA
  const calculateCurrentGPA = () => {
    const grades = subjects.flatMap(subject => 
      subject.grades.map(grade => GRADE_MAPPING[grade.grade as keyof typeof GRADE_MAPPING])
    );
    return grades.length > 0 
      ? grades.reduce((sum, grade) => sum + grade, 0) / grades.length 
      : 0;
  };

  // Calculate previous GPA
  const calculatePreviousGPA = () => {
    if (historicalGPA.length < 2) return 0;
    return historicalGPA[historicalGPA.length - 2].gpa;
  };

  const currentGPA = calculateCurrentGPA();
  const previousGPA = calculatePreviousGPA();
  const gpaChange = currentGPA - previousGPA;

  // Get upcoming assignments (pending or in-progress, sorted by due date)
  const upcomingAssignments = assignments
    .filter(a => a.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  // Calculate assignment completion rate
  const completionRate = assignments.length > 0
    ? Math.round((assignments.filter(a => a.status === 'completed').length / assignments.length) * 100)
    : 0;
  
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
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-950 dark:to-gray-900">
      <Navbar />
      
      <main className="container px-4 pt-20 pb-10 mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-6">
          {/* Header with greeting */}
          <section className="mt-4">
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {user?.displayName || 'User'}
              </h1>
              <p className="text-muted-foreground mt-1">
                Here's an overview of your academic progress
              </p>
            </div>
          </section>
          
          {/* Stats overview */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Current GPA
                </CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentGPA.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className={`font-medium ${gpaChange >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {gpaChange > 0 ? '+' : ''}{gpaChange.toFixed(1)}
                  </span> from last semester
                </p>
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Attendance Rate
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{attendanceRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className={`font-medium ${
                    attendanceRate >= 90 ? "text-green-600 dark:text-green-400" :
                    attendanceRate >= 75 ? "text-amber-600 dark:text-amber-400" :
                    "text-red-600 dark:text-red-400"
                  }`}>
                    {attendanceRate >= 90 ? "Excellent" :
                     attendanceRate >= 75 ? "Good" :
                     "Needs Improvement"}
                  </span> attendance status
                </p>
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Study Hours
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">14.5</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600 dark:text-green-400 font-medium">+2.5</span> hours per week
                </p>
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Assignments Done
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completionRate}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    {assignments.filter(a => a.status !== 'completed').length}
                  </span> assignments pending
                </p>
              </CardContent>
            </Card>
          </section>
          
          {/* Performance and Attendance */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <PerformanceChart 
                data={studentPerformance} 
                title="Your Performance" 
                description="Track your progress over time"
                className="h-full"
              />
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <AttendanceCalendar className="h-full" studentName={user?.displayName} />
            </div>
          </section>
          
          {/* Upcoming Assignments */}
          <section className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Upcoming Assignments</CardTitle>
                    <CardDescription>
                      Stay on top of your deadlines
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/assignments">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAssignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{assignment.title}</span>
                          <span 
                            className={`text-xs px-2 py-0.5 rounded-full font-medium 
                              ${assignment.priority === 'high'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                : assignment.priority === 'medium'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              }`}
                          >
                            {assignment.priority.charAt(0).toUpperCase() + assignment.priority.slice(1)} Priority
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Subject: {assignment.subject} | Due Date: {assignment.dueDate}
                        </div>
                      </div>
                      <Link to="/assignments">
                        <Button variant="ghost" size="sm" className="text-xs">
                          View Details <ArrowUpRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                  {upcomingAssignments.length === 0 && (
                    <div className="text-center text-muted-foreground py-6">
                      No upcoming assignments!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
          
          {/* AI Insights Section */}
          <section className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-blue-950/50 border-indigo-100 dark:border-indigo-900/30">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                  AI Performance Insights
                </CardTitle>
                <CardDescription>
                  Personalized analysis based on your academic data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-white/80 dark:bg-gray-900/80 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                  <p className="text-sm">
                    Based on your current study patterns and performance metrics, you're on track for an <span className="font-medium text-indigo-600 dark:text-indigo-400">A-</span> final grade in your courses. Your consistent attendance and increasing study hours are key factors in this prediction.
                  </p>
                  <div className="mt-3 pt-3 border-t border-indigo-100 dark:border-indigo-900/30">
                    <h4 className="font-medium text-sm mb-2">Personalized Recommendations</h4>
                    <ul className="text-sm space-y-1">
                      {subjects.slice(0, 3).map((subject, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          Consider increasing study time for {subject.name} to improve your grade.
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full bg-white/50 dark:bg-gray-900/50" asChild>
                  <Link to="/predictions">Get More Detailed Analysis</Link>
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
