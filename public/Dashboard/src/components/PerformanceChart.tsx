
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PerformanceData {
  name: string;
  gpa: number;
  attendance: number;
  studyHours: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
  title: string;
  description?: string;
  className?: string;
}

const PerformanceChart = ({ data, title, description, className }: PerformanceChartProps) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorStudyHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '0.5rem',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
                }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '0.5rem' }}
              />
              <Legend 
                verticalAlign="top"
                height={36}
                iconType="circle"
                formatter={(value) => <span className="text-xs capitalize">{value}</span>}
              />
              <Area
                type="monotone"
                dataKey="gpa"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#colorGpa)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="attendance"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorAttendance)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="studyHours"
                stroke="#6366f1"
                fillOpacity={1}
                fill="url(#colorStudyHours)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
