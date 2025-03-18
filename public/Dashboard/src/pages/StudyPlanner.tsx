import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';
import Navbar from '@/components/Navbar';
import StudyTimer from '@/components/StudyTimer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  BookOpen, 
  CalendarIcon, 
  Clock, 
  Edit, 
  LineChart, 
  Plus, 
  Trash, 
  TrendingDown, 
  TrendingUp 
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Define ProductivityLevel type
type ProductivityLevel = 'high' | 'medium' | 'low';

// Mock study history with correct productivity type
const mockStudyHistory = [
  {
    id: 1,
    subject: 'Mathematics',
    date: '2023-11-15',
    duration: 120,
    productivity: 'high' as ProductivityLevel,
  },
  {
    id: 2,
    subject: 'Physics',
    date: '2023-11-15',
    duration: 90,
    productivity: 'medium' as ProductivityLevel,
  },
  {
    id: 3,
    subject: 'History',
    date: '2023-11-14',
    duration: 60,
    productivity: 'medium' as ProductivityLevel,
  },
  {
    id: 4,
    subject: 'English',
    date: '2023-11-14',
    duration: 45,
    productivity: 'low' as ProductivityLevel,
  },
  {
    id: 5,
    subject: 'Chemistry',
    date: '2023-11-13',
    duration: 75,
    productivity: 'high' as ProductivityLevel,
  },
  {
    id: 6,
    subject: 'Mathematics',
    date: '2023-11-13',
    duration: 60,
    productivity: 'medium' as ProductivityLevel,
  },
  {
    id: 7,
    subject: 'Physics',
    date: '2023-11-12',
    duration: 90,
    productivity: 'high' as ProductivityLevel,
  },
  {
    id: 8,
    subject: 'Biology',
    date: '2023-11-12',
    duration: 45,
    productivity: 'low' as ProductivityLevel,
  },
];

type StudyHistory = {
  id: number;
  subject: string;
  date: string;
  duration: number;
  productivity: ProductivityLevel;
};

// Subject options (same as in Assignments)
const subjects = [
  { label: 'Mathematics', value: 'Mathematics' },
  { label: 'Physics', value: 'Physics' },
  { label: 'Chemistry', value: 'Chemistry' },
  { label: 'Biology', value: 'Biology' },
  { label: 'History', value: 'History' },
  { label: 'English', value: 'English' },
  { label: 'Computer Science', value: 'Computer Science' },
  { label: 'Art', value: 'Art' },
  { label: 'Music', value: 'Music' },
  { label: 'Physical Education', value: 'Physical Education' },
];

// Mock study sessions
const mockStudySessions = [
  {
    id: 1,
    subject: 'Mathematics',
    date: '2023-11-18',
    startTime: '18:00',
    duration: 45, // in minutes
    topic: 'Calculus - Derivatives',
    completed: false,
  },
  {
    id: 2,
    subject: 'Physics',
    date: '2023-11-19',
    startTime: '16:30',
    duration: 60,
    topic: 'Fluid Mechanics',
    completed: true,
  },
  {
    id: 3,
    subject: 'History',
    date: '2023-11-20',
    startTime: '19:00',
    duration: 30,
    topic: 'Industrial Revolution Research',
    completed: false,
  },
];

// Study suggestions based on AI analysis
const studySuggestions = [
  {
    id: 1,
    subject: 'Mathematics',
    suggestion: 'Focus on practicing calculus problems for an upcoming test.',
    priority: 'high',
  },
  {
    id: 2,
    subject: 'Physics',
    suggestion: 'Review your notes on fluid mechanics and thermodynamics.',
    priority: 'medium',
  },
  {
    id: 3,
    subject: 'History',
    suggestion: 'Create flashcards for key events in the Industrial Revolution.',
    priority: 'low',
  },
];

type StudySession = {
  id: number;
  subject: string;
  date: string;
  startTime: string;
  duration: number;
  topic: string;
  completed: boolean;
};

const StudyPlanner = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [studySessions, setStudySessions] = useState<StudySession[]>(mockStudySessions);
  const [studyHistory, setStudyHistory] = useState<StudyHistory[]>(mockStudyHistory);
  const [activeSession, setActiveSession] = useState<StudySession | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSession, setNewSession] = useState<Omit<StudySession, 'id' | 'completed'>>({
    subject: '',
    date: '',
    startTime: '',
    duration: 30,
    topic: '',
  });
  
  // Handle study session completion
  const handleSessionComplete = (duration: number) => {
    if (activeSession) {
      // Update session as completed
      const updatedSessions = studySessions.map(session => 
        session.id === activeSession.id ? { ...session, completed: true } : session
      );
      setStudySessions(updatedSessions);
      
      // Add to study history
      const newHistoryEntry: StudyHistory = {
        id: studyHistory.length + 1,
        subject: activeSession.subject,
        date: new Date().toISOString().split('T')[0],
        duration: Math.round(duration),
        productivity: 'high', // Default to high, could be adjusted by the student later
      };
      
      setStudyHistory([newHistoryEntry, ...studyHistory]);
      setActiveSession(null);
      
      toast.success(`Great job! You've completed your ${activeSession.subject} study session.`);
    }
  };
  
  // Add new study session
  const handleAddSession = () => {
    const newSessionObj: StudySession = {
      ...newSession,
      id: studySessions.length + 1,
      completed: false,
    };
    
    setStudySessions([...studySessions, newSessionObj]);
    setIsAddDialogOpen(false);
    setNewSession({
      subject: '',
      date: '',
      startTime: '',
      duration: 30,
      topic: '',
    });
    
    toast.success('New study session planned!');
  };
  
  // Start a study session
  const handleStartSession = (session: StudySession) => {
    setActiveSession(session);
    toast(`Starting ${session.subject} study session`);
    
    // Scroll to timer
    setTimeout(() => {
      document.getElementById('study-timer')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  // Delete a study session
  const handleDeleteSession = (id: number) => {
    setStudySessions(studySessions.filter(session => session.id !== id));
    toast.success('Study session removed');
  };
  
  // Calculate total study time
  const totalStudyTime = studyHistory.reduce((total, session) => total + session.duration, 0);
  
  // Get upcoming sessions (not completed and scheduled for today or in the future)
  const upcomingSessions = studySessions
    .filter(session => !session.completed && new Date(session.date) >= new Date(new Date().toISOString().split('T')[0]))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
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
          {/* Header */}
          <section className="mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight animate-fade-in">Study Planner</h1>
                <p className="text-muted-foreground mt-1 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  Plan, track and optimize your study sessions
                </p>
              </div>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Study Session
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Plan a Study Session</DialogTitle>
                    <DialogDescription>
                      Schedule your next study session to stay organized and boost productivity.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                      <Select
                        value={newSession.subject}
                        onValueChange={(value) => setNewSession({ ...newSession, subject: value })}
                      >
                        <SelectTrigger id="subject">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map(subject => (
                            <SelectItem key={subject.value} value={subject.value}>
                              {subject.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="date" className="text-sm font-medium">Date</label>
                        <Input
                          type="date"
                          id="date"
                          value={newSession.date}
                          onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="startTime" className="text-sm font-medium">Start Time</label>
                        <Input
                          type="time"
                          id="startTime"
                          value={newSession.startTime}
                          onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="duration" className="text-sm font-medium">Duration (minutes)</label>
                      <Input
                        type="number"
                        id="duration"
                        value={newSession.duration}
                        onChange={(e) => setNewSession({ ...newSession, duration: parseInt(e.target.value) })}
                        min={5}
                        max={180}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="topic" className="text-sm font-medium">Study Topic / Notes</label>
                      <Input
                        type="text"
                        id="topic"
                        value={newSession.topic}
                        onChange={(e) => setNewSession({ ...newSession, topic: e.target.value })}
                        placeholder="What will you study? (e.g., Chapter 5, Problem Set 3)"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddSession}
                      disabled={!newSession.subject || !newSession.date || !newSession.startTime}
                    >
                      Add Study Session
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </section>
          
          {/* Active Study Timer (if a session is active) */}
          {activeSession && (
            <section id="study-timer" className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-background">
                <CardHeader>
                  <CardTitle>Active Study Session</CardTitle>
                  <CardDescription>Focus on your {activeSession.subject} session</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-4">
                        <h3 className="text-lg font-medium">{activeSession.topic}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Planned duration: {activeSession.duration} minutes
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">{activeSession.subject}</span>
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">{activeSession.date} at {activeSession.startTime}</span>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setActiveSession(null)}
                        >
                          Cancel Session
                        </Button>
                      </div>
                    </div>
                    
                    <StudyTimer 
                      onComplete={handleSessionComplete} 
                      defaultDuration={activeSession.duration}
                      subject={activeSession.subject}
                    />
                  </div>
                </CardContent>
              </Card>
            </section>
          )}
          
          {/* Overview Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  Total Study Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalStudyTime} min</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {Math.floor(totalStudyTime / 60)} hours {totalStudyTime % 60} minutes
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{upcomingSessions.length}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {upcomingSessions.length > 0 
                    ? `Next: ${upcomingSessions[0].subject} on ${upcomingSessions[0].date}` 
                    : 'No upcoming sessions'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Brain className="h-4 w-4 mr-2 text-muted-foreground" />
                  Study Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">5 days</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Keep it up! You're building great habits.
                </p>
              </CardContent>
            </Card>
          </section>
          
          {/* Upcoming Sessions and AI Suggestions */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Upcoming Study Sessions */}
            <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Study Sessions</CardTitle>
                  <CardDescription>
                    Your scheduled study plan for the next few days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingSessions.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead className="hidden sm:table-cell">Topic</TableHead>
                            <TableHead className="hidden sm:table-cell">Duration</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {upcomingSessions.map(session => (
                            <TableRow key={session.id}>
                              <TableCell className="font-medium">{session.subject}</TableCell>
                              <TableCell>
                                <div className="text-sm">{session.date}</div>
                                <div className="text-xs text-muted-foreground">{session.startTime}</div>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">{session.topic}</TableCell>
                              <TableCell className="hidden sm:table-cell">{session.duration} min</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleStartSession(session)}
                                  >
                                    Start
                                  </Button>
                                  <Button 
                                    size="icon" 
                                    variant="ghost"
                                    onClick={() => handleDeleteSession(session.id)}
                                  >
                                    <Trash className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p>No upcoming study sessions</p>
                      <Button 
                        onClick={() => setIsAddDialogOpen(true)} 
                        variant="outline" 
                        className="mt-4"
                      >
                        Plan a Session
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* AI Study Suggestions */}
            <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <Card className="bg-gradient-to-br from-indigo-50/50 to-background dark:from-indigo-950/30 dark:to-background border-indigo-100 dark:border-indigo-900/30">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                    AI Study Suggestions
                  </CardTitle>
                  <CardDescription>
                    Personalized recommendations based on your academic data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {studySuggestions.map(suggestion => (
                      <div 
                        key={suggestion.id} 
                        className="p-3 rounded-lg border border-indigo-100 dark:border-indigo-900/30 bg-white/80 dark:bg-gray-900/80"
                      >
                        <div className="flex items-start">
                          <div className="flex-1">
                            <div className="font-medium">{suggestion.subject}</div>
                            <p className="text-sm mt-1">
                              {suggestion.suggestion}
                            </p>
                          </div>
                          <div 
                            className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap 
                              ${suggestion.priority === 'high' 
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                                : suggestion.priority === 'medium' 
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' 
                                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              }`}
                          >
                            {suggestion.priority.charAt(0).toUpperCase() + suggestion.priority.slice(1)} Priority
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-indigo-100 dark:border-indigo-900/30 flex">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-xs flex-1"
                            onClick={() => {
                              setNewSession({
                                subject: suggestion.subject,
                                date: new Date().toISOString().split('T')[0],
                                startTime: '',
                                duration: 45,
                                topic: suggestion.suggestion,
                              });
                              setIsAddDialogOpen(true);
                            }}
                          >
                            Create Study Session
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
          
          {/* Study History */}
          <section className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Card>
              <CardHeader>
                <CardTitle>Recent Study History</CardTitle>
                <CardDescription>
                  Track your study patterns and productivity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Productivity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studyHistory.map(session => (
                        <TableRow key={session.id}>
                          <TableCell>{session.date}</TableCell>
                          <TableCell className="font-medium">{session.subject}</TableCell>
                          <TableCell>{session.duration} min</TableCell>
                          <TableCell>
                            <div 
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                ${session.productivity === 'high' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                  : session.productivity === 'medium' 
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' 
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                }`}
                            >
                              {session.productivity.charAt(0).toUpperCase() + session.productivity.slice(1)}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Full Study History
                </Button>
              </CardFooter>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
};

export default StudyPlanner;
