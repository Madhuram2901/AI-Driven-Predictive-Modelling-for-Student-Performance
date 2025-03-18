import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';
import Navbar from '@/components/Navbar';
import { GradeEntryDialog } from '@/components/GradeEntryDialog';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  TooltipProps
} from 'recharts';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { formatChartValue } from '@/utils/chart-helpers';
import { 
  GRADE_MAPPING, 
  GRADE_PERCENTAGE, 
  initialSubjects, 
  getStoredSubjects, 
  getStoredHistoricalGPA,
  storeSubjects,
  storeHistoricalGPA
} from '@/utils/grade-constants';

const GPA = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [subjects, setSubjects] = useState(getStoredSubjects());
  const [historicalGPA, setHistoricalGPA] = useState(getStoredHistoricalGPA());
  
  // Save to localStorage whenever subjects or historicalGPA changes
  useEffect(() => {
    storeSubjects(subjects);
  }, [subjects]);

  useEffect(() => {
    storeHistoricalGPA(historicalGPA);
  }, [historicalGPA]);
  
  // Calculate current and previous semester grades
  const getCurrentAndPreviousGrades = (subject: typeof subjects[0]) => {
    const sortedGrades = [...subject.grades].sort((a, b) => b.semester.localeCompare(a.semester));
    return {
      current: sortedGrades[0]?.grade,
      previous: sortedGrades[1]?.grade
    };
  };

  // Calculate average grades
  const calculateAverageGrade = () => {
    const grades = subjects.flatMap(subject => 
      subject.grades.map(grade => GRADE_MAPPING[grade.grade as keyof typeof GRADE_MAPPING])
    );
    return grades.length > 0 
      ? grades.reduce((sum, grade) => sum + grade, 0) / grades.length 
      : 0;
  };

  const averageGrade = calculateAverageGrade();
  const averagePercentage = GRADE_PERCENTAGE[averageGrade.toFixed(1) as keyof typeof GRADE_PERCENTAGE] || 0;

  // Filter subjects based on search term and having grades
  const filteredSubjects = subjects
    .filter(subject => {
      const grades = getCurrentAndPreviousGrades(subject);
      return subject.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
             (grades.current || grades.previous);
    })
    .sort((a, b) => {
      const aGrade = getCurrentAndPreviousGrades(a).current;
      const bGrade = getCurrentAndPreviousGrades(b).current;
      return GRADE_MAPPING[bGrade as keyof typeof GRADE_MAPPING] - GRADE_MAPPING[aGrade as keyof typeof GRADE_MAPPING];
    });

  // Handle adding new grade
  const handleAddGrade = (subjectName: string, grade: string, semester: string) => {
    setSubjects(subjects.map(subject => {
      if (subject.name === subjectName) {
        return {
          ...subject,
          grades: [...subject.grades, { grade, semester }]
        };
      }
      return subject;
    }));

    // Update historical GPA
    const newGPA = GRADE_MAPPING[grade as keyof typeof GRADE_MAPPING];
    setHistoricalGPA(prev => [...prev, { name: semester, gpa: newGPA }]);
  };

  // Custom tooltip for GPA chart
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-md shadow-md">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-sm text-muted-foreground">{`GPA: ${formatChartValue(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

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
            <h1 className="text-3xl font-bold tracking-tight animate-fade-in">Grade Tracker</h1>
            <p className="text-muted-foreground mt-1 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Monitor and analyze subject performance
            </p>
          </section>
          
          {/* Overview */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Average Grade */}
            <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader className="pb-2">
                <CardTitle>Average Grade</CardTitle>
                <CardDescription>Current Semester GPA</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-center h-40">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-primary">{averageGrade.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground mt-2">GPA (4.0 scale)</div>
                    
                    <div className="mt-4">
                      <Progress 
                        value={averagePercentage} 
                        className="h-2" 
                        indicatorClassName="bg-blue-600 dark:bg-blue-500"
                      />
                    </div>
                    
                    <div className="text-sm text-muted-foreground mt-2">
                      {averagePercentage}% equivalent
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Grade by Subject Chart */}
            <Card className="md:col-span-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader className="pb-2">
                <CardTitle>Subject Performance</CardTitle>
                <CardDescription>Current vs Previous Semester</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={subjects
                        .filter(subject => {
                          const grades = getCurrentAndPreviousGrades(subject);
                          return grades.current || grades.previous;
                        })
                        .map(subject => {
                          const grades = getCurrentAndPreviousGrades(subject);
                          return {
                            name: subject.name,
                            currentGrade: grades.current ? GRADE_PERCENTAGE[grades.current as keyof typeof GRADE_PERCENTAGE] : null,
                            previousGrade: grades.previous ? GRADE_PERCENTAGE[grades.previous as keyof typeof GRADE_PERCENTAGE] : null
                          };
                        })}
                      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length > 0) {
                            return (
                              <div className="bg-background border border-border p-3 rounded-md shadow-md">
                                <p className="font-medium">{label}</p>
                                {payload.length > 0 && payload[0]?.value !== null && (
                                  <p className="text-sm text-blue-600 dark:text-blue-400">
                                    Current: {formatChartValue(payload[0].value)}%
                                  </p>
                                )}
                                {payload.length > 1 && payload[1]?.value !== null && (
                                  <p className="text-sm text-amber-600 dark:text-amber-400">
                                    Previous: {formatChartValue(payload[1].value)}%
                                  </p>
                                )}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                      <Bar dataKey="currentGrade" name="Current Semester" fill="hsl(var(--primary))" />
                      <Bar dataKey="previousGrade" name="Previous Semester" fill="hsl(var(--secondary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </section>
          
          {/* Grade History and Subject List */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Grade History */}
            <Card className="md:col-span-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <CardHeader className="pb-2">
                <CardTitle>Performance Trend</CardTitle>
                <CardDescription>Historical grade progression</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={historicalGPA}
                      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 4]} tick={{ fontSize: 12 }} />
                      <Tooltip content={CustomTooltip} />
                      <Line 
                        type="monotone" 
                        dataKey="gpa" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Subject Grade List */}
            <Card className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <CardHeader className="pb-2">
                <CardTitle>Subject Grades</CardTitle>
                <CardDescription>Detailed subject performance</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Input
                      placeholder="Search subjects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="mb-2"
                    />
                    <GradeEntryDialog subjects={subjects} onAddGrade={handleAddGrade} />
                  </div>
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject</TableHead>
                          <TableHead>Current</TableHead>
                          <TableHead>Previous</TableHead>
                          <TableHead>Change</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSubjects.length > 0 ? (
                          filteredSubjects.map((subject) => {
                            const grades = getCurrentAndPreviousGrades(subject);
                            const currentGPA = grades.current ? GRADE_MAPPING[grades.current as keyof typeof GRADE_MAPPING] : null;
                            const previousGPA = grades.previous ? GRADE_MAPPING[grades.previous as keyof typeof GRADE_MAPPING] : null;
                            const change = currentGPA && previousGPA ? currentGPA - previousGPA : null;
                            return (
                              <TableRow key={subject.id}>
                                <TableCell className="font-medium">
                                  {subject.name}
                                </TableCell>
                                <TableCell>
                                  {grades.current && `${grades.current} (${GRADE_PERCENTAGE[grades.current as keyof typeof GRADE_PERCENTAGE]}%)`}
                                </TableCell>
                                <TableCell>
                                  {grades.previous && `${grades.previous} (${GRADE_PERCENTAGE[grades.previous as keyof typeof GRADE_PERCENTAGE]}%)`}
                                </TableCell>
                                <TableCell className={change !== null ? (change >= 0 ? 
                                  'text-green-600 dark:text-green-400' : 
                                  'text-red-600 dark:text-red-400') : ''}>
                                  {change !== null && `${change > 0 ? '+' : ''}${change.toFixed(1)}`}
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                              No grades added yet. Add your first grade to get started!
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
};

export default GPA;