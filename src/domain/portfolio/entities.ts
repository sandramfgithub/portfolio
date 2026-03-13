import type {
  EntryKind,
  LinkKind,
  Locale,
  PageSlug,
  PublicationState,
  SkillStatus,
  SocialIcon,
  Visibility,
} from '@/domain/portfolio/value-objects';

export type SeoMetadata = {
  title: string;
  description: string;
};

export type NavigationItem = {
  href: string;
  label: string;
};

export type SocialLink = {
  href: string;
  label: string;
  icon: SocialIcon;
};

export type SiteContent = {
  id: string;
  locale: Locale;
  navigation: readonly NavigationItem[];
  socialLinks: readonly SocialLink[];
};

export type PageContent = {
  id: string;
  slug: PageSlug;
  locale: Locale;
  title: string;
  introParagraphs: readonly string[];
  seo: SeoMetadata;
};

export type EntryLink = {
  label: string;
  href: string;
  kind: LinkKind;
};

export type PortfolioEntry = {
  id: string;
  slug: string;
  locale: Locale;
  kind: EntryKind;
  visibility: Visibility;
  publicationState: PublicationState;
  title: string;
  summary: string;
  paragraphs: readonly string[];
  bullets: readonly string[];
  stack: readonly string[];
  links: readonly EntryLink[];
  featured: boolean;
  organization: string | null;
  period: string | null;
  hasCaseStudy: boolean;
  seo: SeoMetadata;
};

export type Skill = {
  id: string;
  slug: string;
  locale: Locale;
  name: string;
  status: SkillStatus;
  active: boolean;
  lastUsedAt: string;
  lastVersion: string | null;
  url: string;
  summary: string;
  details: readonly string[];
  relatedEntrySlugs: readonly string[];
  seo: SeoMetadata;
};

export type CvProfile = {
  name: string;
  role: string;
  location: string;
  web: string;
  summary: string;
  photo: string | null;
};

export type CvContact = {
  github: string | null;
  linkedin: string | null;
  email: string | null;
};

export type CvExperience = {
  role: string;
  company: string;
  period: string;
  summary: string;
  achievements: readonly string[];
  stack: readonly string[];
};

export type CvEducation = {
  title: string;
  institution: string;
  period: string;
  summary?: string;
};

export type CvLanguage = {
  name: string;
  level: string;
};

export type CvCertification = {
  name: string;
  issuer: string;
  issuedAt?: string;
  url?: string;
};

export type CvDocument = {
  id: string;
  locale: Locale;
  profile: CvProfile;
  contacts: CvContact;
  experience: readonly CvExperience[];
  education: readonly CvEducation[];
  languages: readonly CvLanguage[];
  certifications: readonly CvCertification[];
  skillSlugs: readonly string[];
};
