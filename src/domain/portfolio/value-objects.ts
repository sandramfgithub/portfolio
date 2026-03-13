export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

export const pageSlugs = ['home', 'projects', 'about'] as const;
export type PageSlug = (typeof pageSlugs)[number];

export const entryKinds = ['public-project', 'case-study'] as const;
export type EntryKind = (typeof entryKinds)[number];

export const publicationStates = ['draft', 'published', 'coming-soon'] as const;
export type PublicationState = (typeof publicationStates)[number];

export const privateEntryTypes = ['work', 'case-study'] as const;
export type PrivateEntryType = (typeof privateEntryTypes)[number];

export const skillStatuses = [
  'active',
  'recent',
  'legacy',
  'learning',
] as const;
export type SkillStatus = (typeof skillStatuses)[number];

export const socialIcons = ['twitter', 'github', 'linkedin', 'mail'] as const;
export type SocialIcon = (typeof socialIcons)[number];

export const linkKinds = ['repository', 'external', 'case-study'] as const;
export type LinkKind = (typeof linkKinds)[number];
