
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  CalendarIcon, 
  Check, 
  Clock, 
  Edit, 
  FileText, 
  Filter, 
  Plus, 
  Search, 
  Trash 
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

// Define the type for assignment status and priority
type AssignmentStatus = 'pending' | 'in-progress' | 'completed';
type AssignmentPriority = 'high' | 'medium' | 'low';

// Mock assignment data with correct status and priority types
const mockAssignments = [
  { 
    id: 1, 
    title: 'Mathematics Homework 3.4', 
    description: 'Complete exercises 1-15, show all work', 
    subject: 'Mathematics', 
    dueDate: '2023-11-20', 
    status: 'pending' as AssignmentStatus,
    priority: 'high' as AssignmentPriority,
    estimatedHours: 2
  },
  { 
    id: 2, 
    title: 'Physics Lab Report', 
    description: 'Write up results from the pendulum experiment', 
    subject: 'Physics', 
    dueDate: '2023-11-22', 
    status: 'in-progress' as AssignmentStatus,
    priority: 'medium' as AssignmentPriority,
    estimatedHours: 3
  },
  { 
    id: 3, 
    title: 'History Essay', 
    description: 'Research paper on the Industrial Revolution', 
    subject: 'History', 
    dueDate: '2023-11-25', 
    status: 'in-progress' as AssignmentStatus,
    priority: 'high' as AssignmentPriority,
    estimatedHours: 5
  },
  { 
    id: 4, 
    title: 'English Reading', 
    description: 'Read chapters 5-8 of To Kill a Mockingbird', 
    subject: 'English', 
    dueDate: '2023-11-18', 
    status: 'completed' as AssignmentStatus,
    priority: 'medium' as AssignmentPriority,
    estimatedHours: 2
  },
  { 
    id: 5, 
    title: 'Biology Worksheet', 
    description: 'Complete the cell structure diagram and questions', 
    subject: 'Biology', 
    dueDate: '2023-11-19', 
    status: 'completed' as AssignmentStatus,
    priority: 'low' as AssignmentPriority,
    estimatedHours: 1
  },
];

// Subject options
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

const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Completed', value: 'completed' },
];

const priorityOptions = [
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

type Assignment = {
  id: number;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  status: AssignmentStatus;
  priority: AssignmentPriority;
  estimatedHours: number;
};

type FormValues = Omit<Assignment, 'id'>;

const Assignments = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  
  const form = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      subject: '',
      dueDate: '',
      status: 'pending',
      priority: 'medium',
      estimatedHours: 1
    }
  });
  
  // Reset form when dialog closes
  const resetForm = () => {
    form.reset({
      title: '',
      description: '',
      subject: '',
      dueDate: '',
      status: 'pending',
      priority: 'medium',
      estimatedHours: 1
    });
    setEditingAssignment(null);
  };
  
  // Open edit dialog with assignment data
  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    form.reset({
      title: assignment.title,
      description: assignment.description,
      subject: assignment.subject,
      dueDate: assignment.dueDate,
      status: assignment.status,
      priority: assignment.priority,
      estimatedHours: assignment.estimatedHours
    });
    setIsAddDialogOpen(true);
  };
  
  // Handle dialog close
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    setIsAddDialogOpen(open);
  };
  
  // Handle form submission
  const onSubmit = (data: FormValues) => {
    if (editingAssignment) {
      // Update existing assignment
      const updatedAssignments = assignments.map(a => 
        a.id === editingAssignment.id ? { ...data, id: editingAssignment.id } : a
      );
      setAssignments(updatedAssignments);
      toast.success("Assignment updated successfully");
    } else {
      // Add new assignment
      const newAssignment: Assignment = {
        ...data,
        id: assignments.length ? Math.max(...assignments.map(a => a.id)) + 1 : 1
      };
      setAssignments([...assignments, newAssignment]);
      toast.success("New assignment added");
    }
    
    setIsAddDialogOpen(false);
    resetForm();
  };
  
  // Delete assignment
  const handleDelete = (id: number) => {
    setAssignments(assignments.filter(a => a.id !== id));
    toast.success("Assignment deleted");
  };
  
  // Toggle assignment status
  const toggleStatus = (id: number, newStatus: 'pending' | 'in-progress' | 'completed') => {
    const updatedAssignments = assignments.map(a => 
      a.id === id ? { ...a, status: newStatus } : a
    );
    setAssignments(updatedAssignments);
    
    if (newStatus === 'completed') {
      toast.success("Assignment marked as completed! 🎉");
    } else {
      toast("Assignment status updated");
    }
  };
  
  // Filter assignments
  const filteredAssignments = assignments.filter(assignment => {
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    const matchesSubject = filterSubject === 'all' || assignment.subject === filterSubject;
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         assignment.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSubject && matchesSearch;
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight animate-fade-in">Assignments</h1>
                <p className="text-muted-foreground mt-1 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  Track and manage your academic tasks
                </p>
              </div>
              
              <Dialog open={isAddDialogOpen} onOpenChange={handleDialogClose}>
                <DialogTrigger asChild>
                  <Button className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Assignment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{editingAssignment ? 'Edit Assignment' : 'Add New Assignment'}</DialogTitle>
                    <DialogDescription>
                      {editingAssignment ? 'Update the details of your assignment.' : 'Create a new assignment to track your academic tasks.'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Assignment title" {...field} required />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Details about this assignment" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select subject" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {subjects.map(subject => (
                                    <SelectItem key={subject.value} value={subject.value}>
                                      {subject.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="dueDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Due Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} required />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {statusOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="priority"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Priority</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Priority" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {priorityOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="estimatedHours"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Estimated Hours</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="0.5" 
                                  step="0.5" 
                                  {...field}
                                  onChange={e => field.onChange(parseFloat(e.target.value))}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingAssignment ? 'Update Assignment' : 'Add Assignment'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </section>
          
          {/* Filters */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="col-span-1 sm:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assignments..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger>
                  <FileText className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject.value} value={subject.value}>
                      {subject.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>
          
          {/* Assignments Table */}
          <section className="rounded-lg border border-border bg-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Assignment</TableHead>
                  <TableHead className="hidden md:table-cell">Subject</TableHead>
                  <TableHead className="hidden md:table-cell">Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Priority</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.length > 0 ? (
                  filteredAssignments.map(assignment => (
                    <TableRow key={assignment.id}>
                      <TableCell>
                        <div className="font-medium">{assignment.title}</div>
                        <div className="text-xs text-muted-foreground md:hidden">
                          {assignment.subject} • Due: {assignment.dueDate}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{assignment.subject}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                          {assignment.dueDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                            ${assignment.status === 'completed' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                              : assignment.status === 'in-progress' 
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                            }`}
                        >
                          {assignment.status === 'completed' ? (
                            <Check className="h-3 w-3 mr-1" />
                          ) : assignment.status === 'in-progress' ? (
                            <Clock className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {assignment.status === 'completed' ? 'Completed' : assignment.status === 'in-progress' ? 'In Progress' : 'Pending'}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                            ${assignment.priority === 'high' 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                              : assignment.priority === 'medium' 
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' 
                                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            }`}
                        >
                          {assignment.priority === 'high' ? 'High' : assignment.priority === 'medium' ? 'Medium' : 'Low'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center space-x-1">
                          {/* Status toggle buttons */}
                          {assignment.status !== 'completed' && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => toggleStatus(assignment.id, 'completed')}
                              title="Mark as completed"
                            >
                              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </Button>
                          )}
                          {assignment.status !== 'in-progress' && assignment.status !== 'completed' && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => toggleStatus(assignment.id, 'in-progress')}
                              title="Mark as in progress"
                            >
                              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </Button>
                          )}
                          
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEdit(assignment)}
                            title="Edit assignment"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(assignment.id)}
                            title="Delete assignment"
                          >
                            <Trash className="h-4 w-4 text-red-600 dark:text-red-400" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No assignments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </section>
          
          {/* Assignment Stats */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Assignment Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Assignments</span>
                    <span className="font-medium">{assignments.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Completed</span>
                    <span className="font-medium">{assignments.filter(a => a.status === 'completed').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">In Progress</span>
                    <span className="font-medium">{assignments.filter(a => a.status === 'in-progress').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Pending</span>
                    <span className="font-medium">{assignments.filter(a => a.status === 'pending').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Completion Rate</span>
                    <span className="font-medium">
                      {assignments.length > 0 
                        ? `${Math.round((assignments.filter(a => a.status === 'completed').length / assignments.length) * 100)}%` 
                        : '0%'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Due Soon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {assignments
                    .filter(a => a.status !== 'completed')
                    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                    .slice(0, 3)
                    .map(a => (
                      <div key={a.id} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-sm">{a.title}</div>
                          <div className="text-xs text-muted-foreground">{a.subject}</div>
                        </div>
                        <div className="text-sm">{a.dueDate}</div>
                      </div>
                    ))}
                    {assignments.filter(a => a.status !== 'completed').length === 0 && (
                      <div className="text-sm text-muted-foreground">No upcoming assignments!</div>
                    )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Study Time Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Estimated Hours</span>
                    <span className="font-medium">
                      {assignments
                        .filter(a => a.status !== 'completed')
                        .reduce((sum, a) => sum + a.estimatedHours, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">High Priority Hours</span>
                    <span className="font-medium">
                      {assignments
                        .filter(a => a.status !== 'completed' && a.priority === 'high')
                        .reduce((sum, a) => sum + a.estimatedHours, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Medium Priority Hours</span>
                    <span className="font-medium">
                      {assignments
                        .filter(a => a.status !== 'completed' && a.priority === 'medium')
                        .reduce((sum, a) => sum + a.estimatedHours, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Low Priority Hours</span>
                    <span className="font-medium">
                      {assignments
                        .filter(a => a.status !== 'completed' && a.priority === 'low')
                        .reduce((sum, a) => sum + a.estimatedHours, 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button className="w-full" variant="outline">
                  Plan Study Sessions
                </Button>
              </CardFooter>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Assignments;
