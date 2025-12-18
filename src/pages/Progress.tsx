import React from 'react';
import { getProgressSteps, getSubmissions } from '@/data/ghlClientData';
import { format, isPast } from 'date-fns';
import { 
  Check, 
  Clock, 
  AlertCircle, 
  Lock,
  ChevronRight,
  Calendar,
  FileCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// GHL Data - automatically uses {{contact.step_X_status}}, {{contact.step_X_due_date}} when deployed
const progressSteps = getProgressSteps();
const submissions = getSubmissions();

const Progress: React.FC = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="w-5 h-5" />;
      case 'in-progress':
        return <Clock className="w-5 h-5" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-current" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'in-progress':
        return 'bg-gold text-gold-dark';
      case 'overdue':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getSubmission = (stepId: string) => {
    return submissions.find(s => s.stepId === stepId);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
          My Book Progress
        </h1>
        <p className="text-muted-foreground">
          Track each step of your book journey. Complete all steps within your 6-month timeline.
        </p>
      </div>

      {/* Progress Timeline */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <h2 className="font-semibold text-foreground">Production Timeline</h2>
        </div>

        <div className="divide-y divide-border">
          {progressSteps.map((step, index) => {
            const submission = getSubmission(step.id);
            const isPointOfNoReturn = step.id === 'final-chapter';
            
            return (
              <div 
                key={step.id}
                className={cn(
                  'px-6 py-4 flex items-start gap-4 transition-colors',
                  step.status === 'in-progress' && 'bg-gold/5',
                  step.status === 'overdue' && 'bg-destructive/5'
                )}
              >
                {/* Step number and icon */}
                <div className="flex flex-col items-center">
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    getStatusStyles(step.status)
                  )}>
                    {getStatusIcon(step.status)}
                  </div>
                  {index < progressSteps.length - 1 && (
                    <div className={cn(
                      'w-0.5 h-8 mt-2',
                      step.status === 'completed' ? 'bg-success' : 'bg-border'
                    )} />
                  )}
                </div>

                {/* Step content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className={cn(
                        'text-lg font-medium',
                        step.status === 'completed' && 'text-success',
                        step.status === 'in-progress' && 'text-gold-dark',
                        step.status === 'overdue' && 'text-destructive',
                        step.status === 'pending' && 'text-muted-foreground'
                      )}>
                        {step.name}
                        {isPointOfNoReturn && (
                          <span className="ml-2 text-xs bg-destructive/20 text-destructive px-2 py-0.5 rounded-full">
                            Point of No Return
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                    </div>

                    {/* Status badge */}
                    <span className={cn(
                      'status-badge shrink-0',
                      step.status === 'completed' && 'status-completed',
                      step.status === 'in-progress' && 'status-in-progress',
                      step.status === 'overdue' && 'status-overdue',
                      step.status === 'pending' && 'status-waiting'
                    )}>
                      {step.status.charAt(0).toUpperCase() + step.status.slice(1).replace('-', ' ')}
                    </span>
                  </div>

                  {/* Due date and completion info */}
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Due: {format(step.dueDate, 'MMM d, yyyy')}</span>
                      {isPast(step.dueDate) && step.status !== 'completed' && (
                        <span className="text-destructive font-medium">(Overdue)</span>
                      )}
                    </div>
                    {step.completedDate && (
                      <div className="flex items-center gap-1.5 text-success">
                        <FileCheck className="w-4 h-4" />
                        <span>Completed: {format(step.completedDate, 'MMM d, yyyy')}</span>
                      </div>
                    )}
                  </div>

                  {/* Submission status */}
                  {submission && (
                    <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Submitted: {submission.type === 'file' ? submission.content : 'Text content'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(submission.submittedAt, 'MMM d, yyyy')}
                          </p>
                        </div>
                        <span className={cn(
                          'text-xs px-2 py-1 rounded-full',
                          submission.status === 'approved' && 'bg-success/10 text-success',
                          submission.status === 'under-review' && 'bg-gold/20 text-gold-dark',
                          submission.status === 'waiting' && 'bg-muted text-muted-foreground',
                          submission.status === 'revision-requested' && 'bg-destructive/10 text-destructive'
                        )}>
                          {submission.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action button for in-progress items */}
                  {step.status === 'in-progress' && !submission && (
                    <Link to="/upload" className="inline-block mt-3">
                      <Button size="sm" className="bg-gradient-premium hover:opacity-90">
                        Submit Materials <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Progress;
