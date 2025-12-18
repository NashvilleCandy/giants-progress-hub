/**
 * GHL (GoHighLevel) Template Variables
 * 
 * This file defines the mapping between portal data and GHL Custom Field template syntax.
 * When this code is deployed to a GHL page/funnel, the {{contact.field_name}} syntax
 * is automatically replaced with real client data.
 * 
 * For local preview, we provide fallback values.
 * 
 * USAGE IN GHL:
 * 1. Copy the built code to your GHL page/funnel
 * 2. The {{contact.xxx}} variables will auto-populate with each client's data
 * 3. Progress step data uses {{contact.step_X_status}}, {{contact.step_X_due_date}}, etc.
 */

// ============================================
// GHL TEMPLATE MARKERS
// These will be replaced by GHL when deployed
// ============================================

// In GHL, wrap these in {{ }} - e.g., {{contact.first_name}}
// For local dev, we use the fallback values

export const GHL_TEMPLATES = {
  // Client Profile
  clientId: '{{contact.id}}',
  firstName: '{{contact.first_name}}',
  lastName: '{{contact.last_name}}',
  fullName: '{{contact.full_name}}',
  email: '{{contact.email}}',
  phone: '{{contact.phone}}',
  
  // Book Information
  bookTitle: '{{contact.book_title}}',
  bookCoverUrl: '{{contact.book_cover_url}}',
  
  // Financial
  balanceDue: '{{contact.balance_due}}',
  
  // Dates
  onboardingDate: '{{contact.onboarding_date}}',
  
  // Avatar
  avatarUrl: '{{contact.avatar_url}}',
} as const;

/**
 * Progress Step Template Variables
 * Each step has 3 fields: status, due_date, completed_date
 * 
 * Status values: pending | in-progress | completed | overdue
 */
export const PROGRESS_STEP_TEMPLATES = [
  { id: 'onboarding', ghlPrefix: 'step_1' },
  { id: 'materials', ghlPrefix: 'step_2' },
  { id: 'photo', ghlPrefix: 'step_3' },
  { id: 'headshot', ghlPrefix: 'step_4' },
  { id: 'bio', ghlPrefix: 'step_5' },
  { id: 'dedication', ghlPrefix: 'step_6' },
  { id: 'endorsements', ghlPrefix: 'step_7' },
  { id: 'chapter-interview', ghlPrefix: 'step_8' },
  { id: 'editing', ghlPrefix: 'step_9' },
  { id: 'final-chapter', ghlPrefix: 'step_10' },
  { id: 'layout', ghlPrefix: 'step_11' },
  { id: 'layout-approval', ghlPrefix: 'step_12' },
  { id: 'submit-print', ghlPrefix: 'step_13' },
  { id: 'shipping', ghlPrefix: 'step_14' },
  { id: 'arrived', ghlPrefix: 'step_15' },
  { id: 'done', ghlPrefix: 'step_16' },
] as const;

/**
 * Document URL Templates
 * These are URLs to documents stored in GHL or external storage
 */
export const DOCUMENT_TEMPLATES = {
  chapter1Url: '{{contact.doc_chapter_1_url}}',
  chapter2Url: '{{contact.doc_chapter_2_url}}',
  chapter3Url: '{{contact.doc_chapter_3_url}}',
  contractUrl: '{{contact.doc_contract_url}}',
  layoutProofUrl: '{{contact.doc_layout_proof_url}}',
  coverProofUrl: '{{contact.doc_cover_proof_url}}',
  finalBookUrl: '{{contact.doc_final_book_url}}',
} as const;

/**
 * Submission Status Templates
 * Track what clients have submitted and their review status
 */
export const SUBMISSION_TEMPLATES = {
  materialsStatus: '{{contact.sub_materials_status}}',
  photoStatus: '{{contact.sub_photo_status}}',
  headshotStatus: '{{contact.sub_headshot_status}}',
  bioStatus: '{{contact.sub_bio_status}}',
  dedicationStatus: '{{contact.sub_dedication_status}}',
  endorsementsStatus: '{{contact.sub_endorsements_status}}',
} as const;

// ============================================
// HELPER: Check if we're in GHL environment
// ============================================
export const isGHLEnvironment = (): boolean => {
  // In GHL, template variables get replaced. If they're still templates, we're in dev mode.
  return !GHL_TEMPLATES.firstName.includes('{{');
};

// ============================================
// FALLBACK VALUES FOR LOCAL PREVIEW
// ============================================
export const PREVIEW_DEFAULTS = {
  clientId: 'preview-client-1',
  firstName: 'Candy',
  lastName: 'Pruitt',
  fullName: 'Candy Pruitt',
  email: 'candy.pruitt@email.com',
  phone: '(555) 123-4567',
  bookTitle: 'Stand on the Shoulders of Mindset Mastery Giants featuring Candy Pruitt',
  bookCoverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
  balanceDue: '2450.00',
  onboardingDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
  avatarUrl: '',
};

/**
 * Get a GHL value with fallback for preview mode
 */
export function getGHLValue(template: string, fallback: string): string {
  // If the template still contains {{ }}, we're in dev mode - use fallback
  if (template.includes('{{')) {
    return fallback;
  }
  return template;
}

/**
 * Parse a GHL number value (balance, prices, etc.)
 */
export function parseGHLNumber(template: string, fallback: number): number {
  const value = getGHLValue(template, String(fallback));
  const parsed = parseFloat(value.replace(/[^0-9.-]/g, ''));
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * Parse a GHL date value
 */
export function parseGHLDate(template: string, fallback: Date): Date {
  const value = getGHLValue(template, fallback.toISOString());
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? fallback : parsed;
}
