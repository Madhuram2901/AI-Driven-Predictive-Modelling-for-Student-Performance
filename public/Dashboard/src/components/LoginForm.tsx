import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/AuthContext';
import { toast } from 'sonner';
import { FcGoogle } from 'react-icons/fc';

const LoginForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, signUp, loginWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = isSignUp 
        ? await signUp(email, password, name)
        : await login(email, password);

      if (success) {
        toast.success(isSignUp ? 'Account created successfully!' : 'Welcome back!');
        navigate('/dashboard');
      } else {
        toast.error(isSignUp ? 'Failed to create account' : 'Invalid email or password');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const success = await loginWithGoogle();
      if (success) {
        toast.success('Welcome!');
        navigate('/dashboard');
      } else {
        toast.error('Failed to login with Google');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md glass-card animate-fade-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold">
          {isSignUp ? 'Create Account' : 'Student Sign In'}
        </CardTitle>
        <CardDescription>
          {isSignUp 
            ? 'Sign up to start tracking your academic journey'
            : 'Access your StudyInsight account to track your academic journey'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isSignUp}
                className="bg-white/50 dark:bg-black/20"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@school.edu"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/50 dark:bg-black/20"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {!isSignUp && (
                <Button variant="link" className="p-0 h-auto text-xs" type="button">
                  Forgot password?
                </Button>
              )}
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/50 dark:bg-black/20"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            type="button"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <FcGoogle className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button
            variant="ghost"
            type="button"
            className="w-full"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm; 