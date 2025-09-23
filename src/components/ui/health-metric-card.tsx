import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "./card"

export interface HealthMetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'water' | 'sleep' | 'exercise' | 'heart-rate' | 'temperature' | 'default';
  children: React.ReactNode;
}

const HealthMetricCard = React.forwardRef<HTMLDivElement, HealthMetricCardProps>(
  ({ className, type = 'default', children, ...props }, ref) => {
    const typeClass = type !== 'default' ? `${type}-card` : '';
    
    return (
      <Card
        ref={ref}
        className={cn(
          "health-metric-card",
          typeClass,
          className
        )}
        {...props}
      >
        {children}
      </Card>
    );
  }
);

HealthMetricCard.displayName = "HealthMetricCard"

export { HealthMetricCard, CardContent, CardHeader, CardTitle }