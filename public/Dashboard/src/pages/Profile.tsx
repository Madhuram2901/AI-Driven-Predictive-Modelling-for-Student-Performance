import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, User, Calendar, BookOpen, GraduationCap } from 'lucide-react';

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

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

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-950 dark:to-gray-900">
      <Navbar />

      <main className="container px-4 pt-20 pb-10 mx-auto max-w-[1000px]">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <section className="mt-4">
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground mt-1">
              View and manage your profile information
            </p>
          </section>

          {/* Profile Overview */}
          <section className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-xl">
                      {getInitials(user?.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{user?.displayName || 'User'}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4" />
                      {user?.email}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Student</Badge>
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      Active
                    </Badge>
                  </div>

                  <div className="grid gap-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            Joined Date
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            Courses Enrolled
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">6 Active Courses</p>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          Academic Progress
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Current GPA</p>
                            <p className="text-lg font-medium">3.8</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Attendance Rate</p>
                            <p className="text-lg font-medium">92%</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Assignments Complete</p>
                            <p className="text-lg font-medium">85%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Edit Profile</Button>
                    <Button>Update Photo</Button>
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

export default Profile; 