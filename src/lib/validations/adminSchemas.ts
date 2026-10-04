import { z } from 'zod';

// ==========================================
// CLUB MEMBERS VALIDATION SCHEMAS
// ==========================================
export const clubMemberSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits').optional().or(z.literal('')),
  role: z.enum(['Leader', 'Core Member', 'Organizer', 'Member'], {
    errorMap: () => ({ message: 'Please select a valid role' })
  }),
  department: z.string().min(2, 'Department / Team is required'),
  status: z.enum(['Active', 'Inactive', 'Suspended'], {
    errorMap: () => ({ message: 'Please select a valid status' })
  }),
  bio: z.string().optional()
});

export type ClubMemberFormData = z.infer<typeof clubMemberSchema>;

// ==========================================
// ANNOUNCEMENTS VALIDATION SCHEMAS
// ==========================================
export const announcementSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Announcement content must be at least 10 characters'),
  category: z.enum(['General', 'Urgent', 'Schedule', 'Competition', 'Payment'], {
    errorMap: () => ({ message: 'Please select a valid category' })
  }),
  targetAudience: z.enum(['All', 'Participants', 'Judges', 'Club Members'], {
    errorMap: () => ({ message: 'Please select a valid target audience' })
  }),
  isPinned: z.boolean().default(false),
  status: z.enum(['Draft', 'Published', 'Archived']).default('Draft')
});

export type AnnouncementFormData = z.infer<typeof announcementSchema>;

// ==========================================
// SETTINGS VALIDATION SCHEMAS
// ==========================================
export const eventInfoSettingsSchema = z.object({
  eventName: z.string().min(2, 'Event name is required'),
  tagline: z.string().min(2, 'Tagline is required'),
  clubName: z.string().min(2, 'Club name is required'),
  venue: z.string().min(2, 'Venue is required'),
  eventDate: z.string().min(1, 'Event date is required'),
  eventTime: z.string().min(1, 'Event time is required'),
  contactEmail: z.string().email('Invalid contact email'),
  contactPhone: z.string().min(8, 'Contact phone is required'),
  description: z.string().default('')
});

export const displaySettingsSchema = z.object({
  themeMode: z.enum(['Neon Cyberpunk', 'Dark High Tech', 'Minimal Cyber']),
  enableScanlines: z.boolean().default(true),
  enableGlitchEffects: z.boolean().default(true),
  compactTables: z.boolean().default(false),
  refreshIntervalSeconds: z.number().min(5).max(300).default(30)
});

export const announcementSettingsSchema = z.object({
  defaultCategory: z.enum(['General', 'Urgent', 'Schedule', 'Competition', 'Payment']),
  defaultTargetAudience: z.enum(['All', 'Participants', 'Judges', 'Club Members']),
  autoArchiveDays: z.number().min(1).max(365).default(30),
  notifyOnPublish: z.boolean().default(true)
});

export const generalAdminSettingsSchema = z.object({
  allowNewRegistrations: z.boolean().default(true),
  maxTeamSize: z.number().min(1).max(10).default(3),
  registrationFee: z.number().min(0).default(500),
  currency: z.string().default('INR'),
  judgeAutoAssignment: z.boolean().default(false),
  maintenanceMode: z.boolean().default(false)
});

export const fullSettingsSchema = z.object({
  eventInfo: eventInfoSettingsSchema,
  display: displaySettingsSchema,
  announcement: announcementSettingsSchema,
  general: generalAdminSettingsSchema
});

export type FullSettingsFormData = z.infer<typeof fullSettingsSchema>;
