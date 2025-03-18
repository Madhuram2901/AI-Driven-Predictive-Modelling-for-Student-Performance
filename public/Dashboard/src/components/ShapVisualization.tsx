
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';

type FeatureImpact = {
  name: string;
  value: number;
  impact: number;
  description: string;
  color: string;
};

interface ShapVisualizationProps {
  features: FeatureImpact[];
  className?: string;
}

const ShapVisualization = ({ features, className }: ShapVisualizationProps) => {
  // Sort features by absolute impact
  const sortedFeatures = [...features].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
  
  // Find the maximum absolute impact for scaling
  const maxImpact = Math.max(...sortedFeatures.map(f => Math.abs(f.impact)));
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Prediction Factors</CardTitle>
            <CardDescription>What influences this student's performance prediction</CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-[300px]">
                <p className="text-sm">
                  These values show how each factor contributes to the prediction.
                  Positive values (green) push the prediction higher, while negative
                  values (red) push it lower.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedFeatures.map((feature) => (
            <div key={feature.name} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <div className="flex items-center">
                  <span>{feature.name}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-3 w-3 ml-1 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[250px]">
                        <p className="text-sm">{feature.description}</p>
                        <p className="text-sm mt-1">Current value: {feature.value}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className={feature.impact >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                  {feature.impact >= 0 ? '+' : ''}{feature.impact.toFixed(2)}
                </span>
              </div>
              
              <div className="relative h-2 overflow-hidden rounded-full bg-secondary">
                {/* Center baseline */}
                <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-muted-foreground/30 z-10" />
                
                {/* Impact bar */}
                <div 
                  className={`absolute top-0 bottom-0 ${feature.impact >= 0 ? 'left-1/2' : 'right-1/2'}`}
                  style={{ 
                    width: `${Math.abs(feature.impact) / maxImpact * 50}%`,
                    backgroundColor: feature.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShapVisualization;
