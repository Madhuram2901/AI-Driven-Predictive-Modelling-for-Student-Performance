
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';
import LoginForm from '@/components/LoginForm';

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden flex flex-col">
      {/* Gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 -z-10" />
      
      {/* Decorative elements */}
      <div className="fixed inset-0 -z-5">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-200 dark:bg-blue-900/20 blur-3xl opacity-50 dark:opacity-30" />
          <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-200 dark:bg-indigo-900/20 blur-3xl opacity-50 dark:opacity-30" />
          <div className="absolute -bottom-[30%] left-[20%] w-[50%] h-[50%] rounded-full bg-purple-200 dark:bg-purple-900/20 blur-3xl opacity-50 dark:opacity-30" />
        </div>
      </div>
      
      <main className="flex-grow flex flex-col items-center justify-center p-6 relative">
        <div className="w-full max-w-5xl mx-auto flex flex-col-reverse md:flex-row items-center gap-8 md:gap-16">
          {/* Form section */}
          <div className="w-full md:w-1/2 flex justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <LoginForm />
          </div>
          
          {/* Hero content */}
          <div className="w-full md:w-1/2 text-center md:text-left space-y-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
                ScholarInsight
              </h1>
              <p className="text-xl md:text-2xl font-light text-muted-foreground">
                AI-Driven Predictions for Student Success
              </p>
            </div>
            
            <p className="text-muted-foreground md:pr-10">
              Anticipate student performance, identify at-risk individuals, and receive 
              actionable recommendations—all powered by advanced machine learning.
            </p>
            
            <div className="pt-2 grid grid-cols-2 gap-4 md:gap-6 text-sm md:pr-10">
              <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xs p-4 rounded-lg border border-white/20">
                <div className="font-medium mb-1">AI Predictions</div>
                <p className="text-muted-foreground">Forecast student outcomes with high accuracy</p>
              </div>
              <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xs p-4 rounded-lg border border-white/20">
                <div className="font-medium mb-1">Early Intervention</div>
                <p className="text-muted-foreground">Identify at-risk students before they fall behind</p>
              </div>
              <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xs p-4 rounded-lg border border-white/20">
                <div className="font-medium mb-1">Data Visualization</div>
                <p className="text-muted-foreground">Understand performance through intuitive charts</p>
              </div>
              <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xs p-4 rounded-lg border border-white/20">
                <div className="font-medium mb-1">Actionable Insights</div>
                <p className="text-muted-foreground">Get specific recommendations for improvement</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-4 text-center text-sm text-muted-foreground">
        <p>© 2023 ScholarInsight • AI-Driven Student Performance Prediction</p>
      </footer>
    </div>
  );
};

export default Index;
