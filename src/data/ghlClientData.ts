/**
 * GHL Client Data Provider
 * 
 * This module provides client data that automatically uses GHL template variables
 * when deployed to GHL, or falls back to preview data during local development.
 * 
 * HOW IT WORKS:
 * - In GHL: The {{contact.xxx}} syntax is replaced by GHL with real client data
 * - In Preview: Falls back to sample data for testing
 */

import { ClientProfile, ProgressStep, Document, Submission, PROGRESS_STEPS } from '@/types/portal';
import { 
  GHL_TEMPLATES, 
  PROGRESS_STEP_TEMPLATES,
  PREVIEW_DEFAULTS,
  getGHLValue,
  parseGHLNumber,
  parseGHLDate
} from '@/lib/ghl-templates';
import { addWeeks, subDays, addDays } from 'date-fns';

// ============================================
// CLIENT PROFILE
// Uses GHL {{contact.xxx}} template variables
// ============================================
export function getClientProfile(): ClientProfile {
  const onboardingDate = parseGHLDate(
    GHL_TEMPLATES.onboardingDate, 
    new Date(PREVIEW_DEFAULTS.onboardingDate)
  );

  return {
    id: getGHLValue(GHL_TEMPLATES.clientId, PREVIEW_DEFAULTS.clientId),
    name: getGHLValue(GHL_TEMPLATES.fullName, PREVIEW_DEFAULTS.fullName),
    email: getGHLValue(GHL_TEMPLATES.email, PREVIEW_DEFAULTS.email),
    bookTitle: getGHLValue(GHL_TEMPLATES.bookTitle, PREVIEW_DEFAULTS.bookTitle),
    onboardingDate,
    balanceDue: parseGHLNumber(GHL_TEMPLATES.balanceDue, parseFloat(PREVIEW_DEFAULTS.balanceDue)),
    avatarUrl: getGHLValue(GHL_TEMPLATES.avatarUrl, PREVIEW_DEFAULTS.avatarUrl) || undefined,
    bookCoverUrl: getGHLValue(GHL_TEMPLATES.bookCoverUrl, PREVIEW_DEFAULTS.bookCoverUrl),
  };
}

// ============================================
// PROGRESS STEPS
// Uses {{contact.step_X_status}}, {{contact.step_X_due_date}}, etc.
// ============================================
export function getProgressSteps(): ProgressStep[] {
  const client = getClientProfile();
  
  return PROGRESS_STEPS.map((step, index) => {
    const ghlStep = PROGRESS_STEP_TEMPLATES[index];
    
    // GHL template variables for this step
    const statusTemplate = `{{contact.${ghlStep.ghlPrefix}_status}}`;
    const dueDateTemplate = `{{contact.${ghlStep.ghlPrefix}_due_date}}`;
    const completedDateTemplate = `{{contact.${ghlStep.ghlPrefix}_completed_date}}`;
    
    // Calculate default due date based on 6-month timeline
    const defaultDueDate = addWeeks(client.onboardingDate, index * 1.5);
    
    // Calculate default status for preview mode
    let defaultStatus: ProgressStep['status'] = 'pending';
    let defaultCompletedDate: Date | undefined;
    
    if (index < 5) {
      defaultStatus = 'completed';
      defaultCompletedDate = addDays(client.onboardingDate, index * 10);
    } else if (index === 5) {
      defaultStatus = 'in-progress';
    } else if (index === 6 && defaultDueDate < new Date()) {
      defaultStatus = 'overdue';
    }
    
    // Get values from GHL or use defaults
    const status = getGHLValue(statusTemplate, defaultStatus) as ProgressStep['status'];
    const dueDate = parseGHLDate(dueDateTemplate, defaultDueDate);
    const completedDateStr = getGHLValue(completedDateTemplate, defaultCompletedDate?.toISOString() || '');
    const completedDate = completedDateStr ? new Date(completedDateStr) : undefined;
    
    return {
      ...step,
      status,
      dueDate,
      completedDate: completedDate && !isNaN(completedDate.getTime()) ? completedDate : undefined,
    };
  });
}

// ============================================
// DOCUMENTS
// In GHL, documents are stored via Custom Fields or GHL file storage
// ============================================
export function getDocuments(): Document[] {
  // These would come from GHL Custom Values or a documents list
  // For now, return preview data that shows the structure
  return [
    {
      id: 'doc-1',
      name: 'Chapter 1 - Final Edit.docx',
      type: 'chapter',
      uploadedAt: subDays(new Date(), 14),
      uploadedBy: 'admin',
      fileUrl: getGHLValue('{{contact.doc_chapter_1_url}}', '#'),
      fileSize: '245 KB',
    },
    {
      id: 'doc-2',
      name: 'Chapter 2 - Final Edit.docx',
      type: 'chapter',
      uploadedAt: subDays(new Date(), 7),
      uploadedBy: 'admin',
      fileUrl: getGHLValue('{{contact.doc_chapter_2_url}}', '#'),
      fileSize: '312 KB',
    },
    {
      id: 'doc-3',
      name: 'Publishing Agreement.pdf',
      type: 'contract',
      uploadedAt: subDays(new Date(), 45),
      uploadedBy: 'admin',
      fileUrl: getGHLValue('{{contact.doc_contract_url}}', '#'),
      fileSize: '1.2 MB',
    },
    {
      id: 'doc-4',
      name: 'Cover Design Proof.pdf',
      type: 'proof',
      uploadedAt: subDays(new Date(), 3),
      uploadedBy: 'admin',
      fileUrl: getGHLValue('{{contact.doc_cover_proof_url}}', '#'),
      fileSize: '4.8 MB',
    },
  ];
}

// ============================================
// SUBMISSIONS
// Track client submissions via GHL Custom Fields
// ============================================
export function getSubmissions(): Submission[] {
  // Submissions tracked via {{contact.sub_XXX_status}} fields
  const defaultSubmissions: Submission[] = [
    {
      id: 'sub-1',
      stepId: 'materials',
      type: 'file',
      content: 'initial_materials.zip',
      submittedAt: subDays(new Date(), 50),
      status: getGHLValue('{{contact.sub_materials_status}}', 'approved') as Submission['status'],
    },
    {
      id: 'sub-2',
      stepId: 'photo',
      type: 'file',
      content: 'author_photo.jpg',
      submittedAt: subDays(new Date(), 40),
      status: getGHLValue('{{contact.sub_photo_status}}', 'approved') as Submission['status'],
    },
    {
      id: 'sub-3',
      stepId: 'headshot',
      type: 'file',
      content: 'professional_headshot.jpg',
      submittedAt: subDays(new Date(), 35),
      status: getGHLValue('{{contact.sub_headshot_status}}', 'approved') as Submission['status'],
    },
    {
      id: 'sub-4',
      stepId: 'bio',
      type: 'text',
      content: getGHLValue('{{contact.author_bio}}', 'Author bio content...'),
      submittedAt: subDays(new Date(), 30),
      status: getGHLValue('{{contact.sub_bio_status}}', 'approved') as Submission['status'],
    },
    {
      id: 'sub-5',
      stepId: 'dedication',
      type: 'text',
      content: getGHLValue('{{contact.dedication_text}}', 'To my family who believed in me...'),
      submittedAt: subDays(new Date(), 5),
      status: getGHLValue('{{contact.sub_dedication_status}}', 'under-review') as Submission['status'],
    },
  ];
  
  return defaultSubmissions;
}

// ============================================
// CONVENIENCE EXPORTS
// Get all client data at once
// ============================================
export const ghlClient = {
  getProfile: getClientProfile,
  getProgressSteps: getProgressSteps,
  getDocuments: getDocuments,
  getSubmissions: getSubmissions,
};
