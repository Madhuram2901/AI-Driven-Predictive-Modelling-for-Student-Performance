import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner = ({ className, size = 'md' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={cn(
        "animate-spin rounded-full border-2 border-primary/20 border-t-primary transition-all duration-300 ease-in-out",
        sizeClasses[size]
      )} />
    </div>
  );
};

export default LoadingSpinner; 