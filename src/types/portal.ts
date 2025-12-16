// GIANTS Client Portal Types

export type ProgressStatus = 'completed' | 'in-progress' | 'pending' | 'overdue';

export interface ProgressStep {
  id: string;
  name: string;
  status: ProgressStatus;
  dueDate: Date;
  completedDate?: Date;
  isLocked?: boolean;
  description?: string;
}

export interface ClientProfile {
  id: string;
  name: string;
  email: string;
  bookTitle: string;
  onboardingDate: Date;
  balanceDue: number;
  avatarUrl?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'chapter' | 'layout' | 'contract' | 'proof' | 'final' | 'other';
  uploadedAt: Date;
  uploadedBy: 'client' | 'admin';
  fileUrl: string;
  fileSize: string;
}

export interface Message {
  id: string;
  content: string;
  sentAt: Date;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'admin';
  isRead: boolean;
}

export interface Submission {
  id: string;
  stepId: string;
  type: 'file' | 'text' | 'link';
  content: string;
  submittedAt: Date;
  status: 'waiting' | 'under-review' | 'approved' | 'revision-requested';
  adminNotes?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
  isUnlocked: boolean;
  progress: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  videoUrl?: string;
}

export interface BookOrder {
  id: string;
  quantity: number;
  pricePerBook: number;
  totalPrice: number;
  orderedAt: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  trackingNumber?: string;
}

export interface Promotion {
  id: string;
  title: string;
  content: string;
  type: 'announcement' | 'reminder' | 'upsell' | 'bonus';
  isActive: boolean;
  createdAt: Date;
}

// Progress steps configuration
export const PROGRESS_STEPS: Omit<ProgressStep, 'status' | 'dueDate' | 'completedDate'>[] = [
  { id: 'onboarding', name: 'Onboarding', description: 'Initial setup and welcome' },
  { id: 'materials', name: 'Materials Submitted', description: 'Submit all required materials' },
  { id: 'photo', name: 'Photo', description: 'Professional photo submission' },
  { id: 'headshot', name: 'Headshot', description: 'Author headshot for book' },
  { id: 'bio', name: 'Bio', description: 'Author biography' },
  { id: 'dedication', name: 'Dedication', description: 'Book dedication page' },
  { id: 'endorsements', name: 'Endorsements', description: 'Collect endorsements' },
  { id: 'interview', name: 'Chapter Interview', description: 'Interview with ghostwriter' },
  { id: 'editing', name: 'Editing Chapter', description: 'Chapter editing in progress' },
  { id: 'final-chapter', name: 'Final Chapter', description: 'Final chapter submission (Point of No Return)', isLocked: false },
  { id: 'layout', name: 'Layout', description: 'Book layout design' },
  { id: 'layout-approval', name: 'Layout Approval', description: 'Approve final layout' },
  { id: 'print', name: 'Submit to Print', description: 'Sent to printer' },
  { id: 'shipping', name: 'Shipping', description: 'Books in transit' },
  { id: 'arrived', name: 'Arrived', description: 'Books delivered' },
  { id: 'done', name: 'DONE', description: 'Project complete!' },
];
