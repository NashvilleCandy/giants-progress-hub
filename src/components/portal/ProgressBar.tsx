import React from 'react';
import { ProgressStep } from '@/types/portal';
import { format, isPast, isToday } from 'date-fns';
import { Check, Clock, AlertCircle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ProgressBarProps {
  steps: ProgressStep[];
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ steps, className }) => {
  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  const getStepColor = (step: ProgressStep) => {
    switch (step.status) {
      case 'completed':
        return 'bg-success';
      case 'in-progress':
        return 'bg-gold animate-pulse-soft';
      case 'overdue':
        return 'bg-destructive';
      default:
        return 'bg-silver-light';
    }
  };

  const getStepIcon = (step: ProgressStep) => {
    switch (step.status) {
      case 'completed':
        return <Check className="w-3 h-3 text-success-foreground" />;
      case 'in-progress':
        return <Clock className="w-3 h-3 text-gold-dark" />;
      case 'overdue':
        return <AlertCircle className="w-3 h-3 text-destructive-foreground" />;
      default:
        return step.isLocked ? <Lock className="w-3 h-3 text-silver-dark" /> : null;
    }
  };

  const getGlowClass = (step: ProgressStep) => {
    switch (step.status) {
      case 'completed':
        return 'shadow-glow-success';
      case 'in-progress':
        return 'shadow-glow-gold';
      case 'overdue':
        return 'shadow-glow-red';
      default:
        return '';
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Progress percentage header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Book Progress</h3>
        <span className="text-sm font-medium text-muted-foreground">
          {completedSteps} of {steps.length} steps ({Math.round(progressPercentage)}%)
        </span>
      </div>

      {/* Main progress bar */}
      <div className="relative mb-4">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-success via-gold to-success rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex items-start justify-between gap-1 overflow-x-auto pb-2">
        {steps.map((step, index) => (
          <Tooltip key={step.id}>
            <TooltipTrigger asChild>
              <div className="flex flex-col items-center min-w-0 flex-1">
                {/* Step dot */}
                <div
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer',
                    'hover:scale-110',
                    getStepColor(step),
                    step.status === 'completed' && 'hover:shadow-[0_0_16px_hsl(145_60%_45%/0.6)]',
                    step.status === 'in-progress' && 'ring-2 ring-gold/50 ring-offset-2 ring-offset-background hover:shadow-[0_0_16px_hsl(45_85%_50%/0.6)]',
                    step.status === 'overdue' && 'ring-2 ring-destructive/50 ring-offset-2 ring-offset-background hover:shadow-[0_0_16px_hsl(0_70%_50%/0.6)]',
                    step.status === 'pending' && 'hover:shadow-[0_0_12px_hsl(220_10%_60%/0.4)]'
                  )}
                >
                  {getStepIcon(step)}
                </div>
                
                {/* Step name (truncated) */}
                <span
                  className={cn(
                    'text-[10px] mt-1 text-center truncate w-full px-0.5',
                    step.status === 'completed' && 'text-success',
                    step.status === 'in-progress' && 'text-gold-dark font-medium',
                    step.status === 'overdue' && 'text-destructive font-medium',
                    step.status === 'pending' && 'text-muted-foreground'
                  )}
                >
                  {step.name}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <div className="space-y-1">
                <p className="font-semibold">{step.name}</p>
                {step.description && (
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                )}
                <div className="flex items-center gap-2 text-xs">
                  <span className={cn(
                    'px-2 py-0.5 rounded-full',
                    step.status === 'completed' && 'bg-success/20 text-success',
                    step.status === 'in-progress' && 'bg-gold/20 text-gold-dark',
                    step.status === 'overdue' && 'bg-destructive/20 text-destructive',
                    step.status === 'pending' && 'bg-muted text-muted-foreground'
                  )}>
                    {step.status.charAt(0).toUpperCase() + step.status.slice(1).replace('-', ' ')}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Due: {format(step.dueDate, 'MMM d, yyyy')}
                  {isPast(step.dueDate) && step.status !== 'completed' && (
                    <span className="text-destructive ml-1">(Overdue)</span>
                  )}
                  {isToday(step.dueDate) && (
                    <span className="text-gold-dark ml-1">(Due today)</span>
                  )}
                </p>
                {step.completedDate && (
                  <p className="text-xs text-success">
                    Completed: {format(step.completedDate, 'MMM d, yyyy')}
                  </p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};
