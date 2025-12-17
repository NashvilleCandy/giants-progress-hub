import { ClientProfile, ProgressStep, Document, Message, Course, Promotion, Submission, PROGRESS_STEPS } from '@/types/portal';
import { addDays, addWeeks, subDays } from 'date-fns';

// Mock onboarding date (2 months ago for demo)
const onboardingDate = subDays(new Date(), 60);

// Generate due dates based on 6-month timeline
const generateDueDate = (weekOffset: number) => addWeeks(onboardingDate, weekOffset);

export const mockClient: ClientProfile = {
  id: 'client-1',
  name: 'Candy Pruitt',
  email: 'candy.pruitt@email.com',
  bookTitle: 'Stand on the Shoulders of Mindset Mastery Giants featuring Candy Pruitt',
  onboardingDate,
  balanceDue: 2450.00,
  avatarUrl: undefined,
  bookCoverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
};

export const mockProgressSteps: ProgressStep[] = PROGRESS_STEPS.map((step, index) => {
  // First 5 steps completed, 6th in progress, rest pending
  let status: ProgressStep['status'] = 'pending';
  let completedDate: Date | undefined;
  const dueDate = generateDueDate(index * 1.5); // Spread across 6 months
  
  if (index < 5) {
    status = 'completed';
    completedDate = addDays(onboardingDate, index * 10);
  } else if (index === 5) {
    status = 'in-progress';
  } else if (index === 6 && dueDate < new Date()) {
    status = 'overdue';
  }
  
  return {
    ...step,
    status,
    dueDate,
    completedDate,
  };
});

export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    name: 'Chapter 1 - Final Edit.docx',
    type: 'chapter',
    uploadedAt: subDays(new Date(), 14),
    uploadedBy: 'admin',
    fileUrl: '#',
    fileSize: '245 KB',
  },
  {
    id: 'doc-2',
    name: 'Chapter 2 - Final Edit.docx',
    type: 'chapter',
    uploadedAt: subDays(new Date(), 7),
    uploadedBy: 'admin',
    fileUrl: '#',
    fileSize: '312 KB',
  },
  {
    id: 'doc-3',
    name: 'Publishing Agreement.pdf',
    type: 'contract',
    uploadedAt: subDays(new Date(), 45),
    uploadedBy: 'admin',
    fileUrl: '#',
    fileSize: '1.2 MB',
  },
  {
    id: 'doc-4',
    name: 'Cover Design Proof.pdf',
    type: 'proof',
    uploadedAt: subDays(new Date(), 3),
    uploadedBy: 'admin',
    fileUrl: '#',
    fileSize: '4.8 MB',
  },
];

export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    content: 'Hi Sarah! Welcome to the GIANTS family. We\'re excited to help you bring your book to life. Please review your onboarding materials and let us know if you have any questions.',
    sentAt: subDays(new Date(), 55),
    senderId: 'admin-1',
    senderName: 'GIANTS Team',
    senderRole: 'admin',
    isRead: true,
  },
  {
    id: 'msg-2',
    content: 'Thank you! I\'m thrilled to be here. Just submitted my initial materials. Looking forward to the journey!',
    sentAt: subDays(new Date(), 54),
    senderId: 'client-1',
    senderName: 'Sarah Mitchell',
    senderRole: 'client',
    isRead: true,
  },
  {
    id: 'msg-3',
    content: 'Your Chapter 1 edit is ready for review! Please check your Documents section. The ghostwriter did a fantastic job capturing your voice.',
    sentAt: subDays(new Date(), 14),
    senderId: 'admin-1',
    senderName: 'GIANTS Team',
    senderRole: 'admin',
    isRead: true,
  },
  {
    id: 'msg-4',
    content: 'Quick reminder: Your dedication page is due next week. Need any help brainstorming?',
    sentAt: subDays(new Date(), 2),
    senderId: 'admin-1',
    senderName: 'GIANTS Team',
    senderRole: 'admin',
    isRead: false,
  },
];

export const mockSubmissions: Submission[] = [
  {
    id: 'sub-1',
    stepId: 'materials',
    type: 'file',
    content: 'initial_materials.zip',
    submittedAt: subDays(new Date(), 50),
    status: 'approved',
  },
  {
    id: 'sub-2',
    stepId: 'photo',
    type: 'file',
    content: 'author_photo.jpg',
    submittedAt: subDays(new Date(), 40),
    status: 'approved',
  },
  {
    id: 'sub-3',
    stepId: 'headshot',
    type: 'file',
    content: 'professional_headshot.jpg',
    submittedAt: subDays(new Date(), 35),
    status: 'approved',
  },
  {
    id: 'sub-4',
    stepId: 'bio',
    type: 'text',
    content: 'Sarah Mitchell is a visionary leader with over 20 years of experience...',
    submittedAt: subDays(new Date(), 30),
    status: 'approved',
  },
  {
    id: 'sub-5',
    stepId: 'dedication',
    type: 'text',
    content: 'To my family who believed in me...',
    submittedAt: subDays(new Date(), 5),
    status: 'under-review',
  },
];

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Author Platform Building',
    description: 'Learn how to build your author brand and online presence before your book launches.',
    thumbnailUrl: '',
    duration: '2h 30m',
    isUnlocked: true,
    progress: 75,
    lessons: [
      { id: 'l1', title: 'Introduction to Author Branding', duration: '15m', isCompleted: true },
      { id: 'l2', title: 'Social Media Strategy', duration: '25m', isCompleted: true },
      { id: 'l3', title: 'Building Your Email List', duration: '30m', isCompleted: true },
      { id: 'l4', title: 'Website Essentials', duration: '20m', isCompleted: false },
      { id: 'l5', title: 'Content Marketing', duration: '25m', isCompleted: false },
    ],
  },
  {
    id: 'course-2',
    title: 'Book Launch Mastery',
    description: 'Step-by-step guide to launching your book successfully and hitting bestseller lists.',
    thumbnailUrl: '',
    duration: '3h 15m',
    isUnlocked: true,
    progress: 25,
    lessons: [
      { id: 'l6', title: 'Pre-Launch Timeline', duration: '20m', isCompleted: true },
      { id: 'l7', title: 'Building a Launch Team', duration: '25m', isCompleted: false },
      { id: 'l8', title: 'Amazon Optimization', duration: '35m', isCompleted: false },
      { id: 'l9', title: 'PR and Media Outreach', duration: '40m', isCompleted: false },
    ],
  },
  {
    id: 'course-3',
    title: 'Speaking from Your Book',
    description: 'Transform your book into speaking opportunities and paid engagements.',
    thumbnailUrl: '',
    duration: '2h 45m',
    isUnlocked: false,
    progress: 0,
    lessons: [
      { id: 'l10', title: 'Crafting Your Signature Talk', duration: '30m', isCompleted: false },
      { id: 'l11', title: 'Finding Speaking Gigs', duration: '25m', isCompleted: false },
      { id: 'l12', title: 'Pricing Your Expertise', duration: '20m', isCompleted: false },
    ],
  },
];

export const mockPromotions: Promotion[] = [
  {
    id: 'promo-1',
    title: '🎉 Early Bird Bonus',
    content: 'Complete your materials by the end of this month and receive a FREE audiobook production consultation!',
    type: 'bonus',
    isActive: true,
    createdAt: subDays(new Date(), 10),
  },
  {
    id: 'promo-2',
    title: '📚 Bulk Order Discount',
    content: 'Order 100+ copies of your book and save 25%! Perfect for events and speaking engagements.',
    type: 'upsell',
    isActive: true,
    createdAt: subDays(new Date(), 5),
  },
];
