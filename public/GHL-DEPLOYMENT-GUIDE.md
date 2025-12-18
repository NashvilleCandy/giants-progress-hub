# GIANTS Portal - GHL Deployment Guide

## Overview

This portal is built to work with GoHighLevel (GHL) templating system. When deployed to a GHL page or funnel, all `{{contact.xxx}}` template variables are automatically replaced with real client data.

## Step 1: Set Up GHL Custom Fields

Import the custom fields from `ghl-custom-fields.csv` into your GHL account:
1. Go to Settings → Custom Fields
2. Click Import/Export → Import
3. Upload `ghl-custom-fields.csv`

## Step 2: Template Variables Reference

### Client Profile Fields
| Portal Variable | GHL Template | Example |
|----------------|--------------|---------|
| Client Name | `{{contact.full_name}}` | John Smith |
| First Name | `{{contact.first_name}}` | John |
| Email | `{{contact.email}}` | john@email.com |
| Book Title | `{{contact.book_title}}` | My Amazing Book |
| Book Cover URL | `{{contact.book_cover_url}}` | https://... |
| Balance Due | `{{contact.balance_due}}` | 2450.00 |
| Onboarding Date | `{{contact.onboarding_date}}` | 2024-01-15 |

### Progress Step Fields (16 Steps)
Each step has 3 fields:
- `{{contact.step_X_status}}` - pending, in-progress, completed, overdue
- `{{contact.step_X_due_date}}` - ISO date format
- `{{contact.step_X_completed_date}}` - ISO date format (if completed)

Where X = 1-16:
1. Onboarding
2. Materials Submitted
3. Photo
4. Headshot
5. Bio
6. Dedication
7. Endorsements
8. Chapter Interview
9. Editing
10. Final Chapter (Point of No Return)
11. Layout
12. Layout Approval
13. Submit to Print
14. Shipping
15. Arrived
16. Done

### Submission Status Fields
- `{{contact.sub_materials_status}}` - waiting, under-review, approved, revision-requested
- `{{contact.sub_photo_status}}`
- `{{contact.sub_headshot_status}}`
- `{{contact.sub_bio_status}}`
- `{{contact.sub_dedication_status}}`
- `{{contact.sub_endorsements_status}}`

### Document URL Fields
- `{{contact.doc_chapter_1_url}}`
- `{{contact.doc_chapter_2_url}}`
- `{{contact.doc_chapter_3_url}}`
- `{{contact.doc_contract_url}}`
- `{{contact.doc_layout_proof_url}}`
- `{{contact.doc_cover_proof_url}}`
- `{{contact.doc_final_book_url}}`

## Step 3: Deploy to GHL

### Option A: Embed in GHL Page
1. Build the React app: `npm run build`
2. Host the built files on your server or CDN
3. Embed via iframe in your GHL page

### Option B: Custom Code Block
1. Build the React app
2. Copy the generated HTML, CSS, and JS
3. Paste into a GHL Custom Code element
4. GHL will process the `{{contact.xxx}}` variables

## Step 4: Set Up GHL Workflows

### Submission Workflow
Trigger: Form submission
Actions:
1. Update `{{contact.sub_XXX_status}}` to "under-review"
2. Notify admin
3. (Optional) Update progress step status

### Approval Workflow
Trigger: Admin approves submission
Actions:
1. Update `{{contact.sub_XXX_status}}` to "approved"
2. Update `{{contact.step_X_status}}` to "completed"
3. Set `{{contact.step_X_completed_date}}`
4. Notify client

### Due Date Reminder Workflow
Trigger: Scheduled (daily)
Condition: `{{contact.step_X_due_date}}` is past AND `{{contact.step_X_status}}` is not "completed"
Actions:
1. Update status to "overdue"
2. Send reminder email

### Payment Update Workflow
Trigger: Stripe payment received
Actions:
1. Update `{{contact.balance_due}}`
2. Send receipt

## Step 5: Testing

1. Create a test contact with all custom fields populated
2. View the portal as that contact
3. Verify all template variables render correctly
4. Test each workflow

## File Structure

```
src/
├── lib/
│   └── ghl-templates.ts      # GHL template variable definitions
├── data/
│   └── ghlClientData.ts      # GHL data provider with fallbacks
public/
├── ghl-custom-fields.csv     # Import this to GHL
└── GHL-DEPLOYMENT-GUIDE.md   # This file
```

## Troubleshooting

### Variables showing as `{{contact.xxx}}`
- You're viewing outside of GHL
- The custom field doesn't exist in GHL
- Field name mismatch

### Dates not parsing
- Ensure dates are in ISO format (YYYY-MM-DD)
- Check GHL field type is set to "Date"

### Balance showing NaN
- Ensure balance_due field contains only numbers
- Remove currency symbols from the field value

## Support

For GIANTS team: Contact your developer for assistance with GHL integration.
