import React from 'react';
import { getClientProfile, getProgressSteps, getDocuments } from '@/data/ghlClientData';
import { mockMessages, mockCourses } from '@/data/mockData';
import { format } from 'date-fns';
import { 
  BookOpen, 
  Clock, 
  FileText, 
  MessageSquare, 
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// GHL Data - automatically uses {{contact.xxx}} template variables when deployed
const client = getClientProfile();
const progressSteps = getProgressSteps();
const documents = getDocuments();

const Dashboard: React.FC = () => {
  const currentStep = progressSteps.find(s => s.status === 'in-progress');
  const overdueSteps = progressSteps.filter(s => s.status === 'overdue');
  const completedCount = progressSteps.filter(s => s.status === 'completed').length;
  const unreadMessages = mockMessages.filter(m => !m.isRead && m.senderRole === 'admin').length;
  const recentDocs = documents.slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome header - Uses GHL {{contact.first_name}} when deployed */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
          Welcome back, {client.name.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your book journey with GIANTS.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Step */}
        <div className="bg-card rounded-xl p-5 border border-border card-glow">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-lg bg-gold/10">
              <Clock className="w-5 h-5 text-gold-dark" />
            </div>
            <span className="status-badge status-in-progress">In Progress</span>
          </div>
          <h3 className="text-sm text-muted-foreground mb-1">Current Step</h3>
          <p className="text-lg font-semibold text-foreground">{currentStep?.name || 'N/A'}</p>
          {currentStep && (
            <p className="text-xs text-muted-foreground mt-1">
              Due: {format(currentStep.dueDate, 'MMM d, yyyy')}
            </p>
          )}
        </div>

        {/* Progress */}
        <div className="bg-card rounded-xl p-5 border border-border card-glow">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
          </div>
          <h3 className="text-sm text-muted-foreground mb-1">Progress</h3>
          <p className="text-lg font-semibold text-foreground">
            {completedCount} of {progressSteps.length} Steps
          </p>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div 
              className="bg-success h-2 rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / progressSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Overdue Items */}
        <div className={cn(
          "bg-card rounded-xl p-5 border card-glow",
          overdueSteps.length > 0 ? 'border-destructive/50' : 'border-border'
        )}>
          <div className="flex items-start justify-between mb-3">
            <div className={cn(
              "p-2 rounded-lg",
              overdueSteps.length > 0 ? 'bg-destructive/10' : 'bg-muted'
            )}>
              <AlertCircle className={cn(
                "w-5 h-5",
                overdueSteps.length > 0 ? 'text-destructive' : 'text-muted-foreground'
              )} />
            </div>
            {overdueSteps.length > 0 && (
              <span className="status-badge status-overdue">Action Needed</span>
            )}
          </div>
          <h3 className="text-sm text-muted-foreground mb-1">Overdue Items</h3>
          <p className={cn(
            "text-lg font-semibold",
            overdueSteps.length > 0 ? 'text-destructive' : 'text-foreground'
          )}>
            {overdueSteps.length} {overdueSteps.length === 1 ? 'Item' : 'Items'}
          </p>
        </div>

        {/* Messages */}
        <div className="bg-card rounded-xl p-5 border border-border card-glow">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            {unreadMessages > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                {unreadMessages} new
              </span>
            )}
          </div>
          <h3 className="text-sm text-muted-foreground mb-1">Messages</h3>
          <p className="text-lg font-semibold text-foreground">{mockMessages.length} Total</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Documents */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gold" />
              <h2 className="font-semibold text-foreground">Recent Documents</h2>
            </div>
            <Link to="/documents">
              <Button variant="ghost" size="sm" className="text-xs">
                View All <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentDocs.map((doc) => (
              <div key={doc.id} className="px-5 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-foreground">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(doc.uploadedAt, 'MMM d, yyyy')} • {doc.fileSize}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="text-xs">
                  Download
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Your Classes */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-gold" />
              <h2 className="font-semibold text-foreground">Your Classes</h2>
            </div>
            <Link to="/classes">
              <Button variant="ghost" size="sm" className="text-xs">
                View All <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-border">
            {mockCourses.filter(c => c.isUnlocked).slice(0, 2).map((course) => (
              <div key={course.id} className="px-5 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{course.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 max-w-[100px] bg-muted rounded-full h-1.5">
                      <div 
                        className="bg-gold h-1.5 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{course.progress}%</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-xs ml-3">
                  Continue
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Book info card */}
      <div className="bg-card rounded-xl border border-border p-6 premium-border">
        <div className="flex items-start gap-4">
          <div className="w-16 h-20 bg-gradient-to-br from-giants-red to-giants-red-dark rounded-lg flex items-center justify-center shadow-glow-red">
            <BookOpen className="w-8 h-8 text-gold" />
          </div>
          {/* Book info - Uses GHL {{contact.book_title}} and {{contact.onboarding_date}} */}
          <div className="flex-1">
            <h3 className="text-xl font-serif font-bold text-foreground mb-1">{client.bookTitle}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Started on {format(client.onboardingDate, 'MMMM d, yyyy')}
            </p>
            <div className="flex gap-2">
              <Link to="/progress">
                <Button size="sm" className="bg-gradient-premium hover:opacity-90">
                  View Progress
                </Button>
              </Link>
              <Link to="/upload">
                <Button variant="outline" size="sm">
                  Upload Materials
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
