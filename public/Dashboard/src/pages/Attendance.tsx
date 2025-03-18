import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';
import Navbar from '@/components/Navbar';
import AttendanceCalendar from '@/components/AttendanceCalendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Clock, X, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getStoredSubjects } from '@/utils/grade-constants';

// Mock attendance data for subjects
const generateMockAttendanceData = (subjects: any[]) => {
  return subjects.map(subject => ({
    id: subject.id,
    name: subject.name,
    totalClasses: 40,
    attended: Math.floor(Math.random() * 40),
    late: Math.floor(Math.random() * 10),
    absent: Math.floor(Math.random() * 10),
  }));
};

const Attendance = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [subjects, setSubjects] = useState(getStoredSubjects());
  const [attendanceData, setAttendanceData] = useState(() => {
    const stored = localStorage.getItem('attendanceData');
    if (stored) {
      return JSON.parse(stored);
    }
    return generateMockAttendanceData(subjects);
  });
  
  // Save attendance data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
  }, [attendanceData]);
  
  // Calculate attendance statistics
  const calculateAttendanceStats = () => {
    const totalClasses = attendanceData.reduce((sum, subject) => sum + subject.totalClasses, 0);
    const totalAttended = attendanceData.reduce((sum, subject) => sum + subject.attended, 0);
    const totalLate = attendanceData.reduce((sum, subject) => sum + subject.late, 0);
    const totalAbsent = attendanceData.reduce((sum, subject) => sum + subject.absent, 0);
    
    return [
      { name: 'Present', value: (totalAttended / totalClasses) * 100, color: '#22c55e' },
      { name: 'Late', value: (totalLate / totalClasses) * 100, color: '#eab308' },
      { name: 'Absent', value: (totalAbsent / totalClasses) * 100, color: '#ef4444' },
    ];
  };

  // Get risk level based on attendance percentage
  const getRiskLevel = (attendancePercentage: number) => {
    if (attendancePercentage >= 90) return { level: 'Low Risk', color: 'text-green-600 dark:text-green-400' };
    if (attendancePercentage >= 75) return { level: 'Medium Risk', color: 'text-amber-600 dark:text-amber-400' };
    return { level: 'High Risk', color: 'text-red-600 dark:text-red-400' };
  };

  // Filter attendance data based on search and status
  const filteredAttendance = attendanceData.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase());
    const attendancePercentage = (record.attended / record.totalClasses) * 100;
    const matchesStatus = selectedStatus === 'all' || 
      (selectedStatus === 'high-risk' && attendancePercentage < 75) ||
      (selectedStatus === 'medium-risk' && attendancePercentage >= 75 && attendancePercentage < 90) ||
      (selectedStatus === 'low-risk' && attendancePercentage >= 90);
    return matchesSearch && matchesStatus;
  });
  
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
            <h1 className="text-3xl font-bold tracking-tight animate-fade-in">Subject Attendance</h1>
            <p className="text-muted-foreground mt-1 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Track and manage attendance for each subject
            </p>
          </section>
          
          {/* Attendance Overview */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Calendar */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <AttendanceCalendar className="h-full" />
            </div>
            
            {/* Attendance Summary */}
            <Card className="lg:col-span-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <CardTitle>Attendance Summary</CardTitle>
                <CardDescription>
                  Overall attendance statistics for all subjects
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row items-center justify-between">
                <div className="w-full md:w-1/2 h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={calculateAttendanceStats()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {calculateAttendanceStats().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [`${value.toFixed(1)}%`, 'Percentage']}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          borderColor: 'hsl(var(--border))',
                          borderRadius: '0.5rem',
                        }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value) => <span className="text-sm">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="w-full md:w-1/2 space-y-4 p-4">
                  <div>
                    <h3 className="text-lg font-medium">Statistics</h3>
                    <p className="text-sm text-muted-foreground">
                      Current Semester Attendance Overview
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subjects at risk of debarment:</span>
                      <span className="font-medium text-red-600 dark:text-red-400">
                        {attendanceData.filter(subject => 
                          (subject.attended / subject.totalClasses) * 100 < 75
                        ).length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Subjects with good attendance:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {attendanceData.filter(subject => 
                          (subject.attended / subject.totalClasses) * 100 >= 90
                        ).length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Average attendance rate:</span>
                      <span className="font-medium">
                        {((attendanceData.reduce((sum, subject) => 
                          sum + (subject.attended / subject.totalClasses) * 100, 0
                        ) / attendanceData.length) || 0).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button size="sm" variant="outline" className="w-full">
                      Download Attendance Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
          
          {/* Subject Attendance Records */}
          <section className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <CardTitle>Subject Attendance</CardTitle>
                    <CardDescription>
                      Track attendance for each subject
                    </CardDescription>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-[180px]">
                      <Input
                        placeholder="Search subjects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="w-full sm:w-[150px]">
                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter risk level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Subjects</SelectItem>
                          <SelectItem value="high-risk">High Risk (&lt;75%)</SelectItem>
                          <SelectItem value="medium-risk">Medium Risk (75-90%)</SelectItem>
                          <SelectItem value="low-risk">Low Risk (&gt;90%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Subject</TableHead>
                        <TableHead className="text-center">Attendance</TableHead>
                        <TableHead className="text-center">Present</TableHead>
                        <TableHead className="text-center">Late</TableHead>
                        <TableHead className="text-center">Absent</TableHead>
                        <TableHead className="text-center">Risk Level</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAttendance.map((record) => {
                        const attendancePercentage = (record.attended / record.totalClasses) * 100;
                        const riskLevel = getRiskLevel(attendancePercentage);
                        return (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">{record.name}</TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${
                                      attendancePercentage >= 90 ? 'bg-green-500' :
                                      attendancePercentage >= 75 ? 'bg-amber-500' :
                                      'bg-red-500'
                                    }`}
                                    style={{ width: `${attendancePercentage}%` }}
                                  />
                                </div>
                                <span className="text-sm">{attendancePercentage.toFixed(1)}%</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center text-green-600 dark:text-green-400">
                              {record.attended}
                            </TableCell>
                            <TableCell className="text-center text-amber-600 dark:text-amber-400">
                              {record.late}
                            </TableCell>
                            <TableCell className="text-center text-red-600 dark:text-red-400">
                              {record.absent}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                {attendancePercentage < 75 && (
                                  <AlertTriangle className="w-4 h-4 text-red-500" />
                                )}
                                <span className={riskLevel.color}>
                                  {riskLevel.level}
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Attendance;
