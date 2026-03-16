import type {
  EntryKind,
  LinkKind,
  Locale,
  PageSlug,
  PrivateEntryType,
  PublicationState,
  SkillStatus,
  SocialIcon,
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

export const aboutPopoverKeys = [
  'age',
  'films',
  'realityShows',
  'music',
  'games',
  'drawing',
] as const;

export type AboutPopoverKey = (typeof aboutPopoverKeys)[number];

export type AboutInlineTextNode = {
  type: 'text';
  value: string;
};

export type AboutInlineStrongNode = {
  type: 'strong';
  value: string;
};

export type AboutInlinePopoverNode = {
  type: 'popover';
  key: AboutPopoverKey;
  trigger?: string;
};

export type AboutInlineNode =
  | AboutInlineTextNode
  | AboutInlineStrongNode
  | AboutInlinePopoverNode;

export type AboutParagraph = {
  nodes: readonly AboutInlineNode[];
};

export type AboutHero = {
  name: string;
  roleChip: string;
  roleTitle: string;
  location: string;
};

export type AboutAgePopover = {
  kind: 'age';
  birthDate: string;
  defaultText: string;
  birthdayText: string;
};

export type AboutListPopover = {
  kind: 'list';
  title: string;
  intro?: string;
  items: readonly string[];
};

export type AboutMediaPopover = {
  kind: 'media';
  title: string;
  body: readonly string[];
  image: {
    alt: string;
    caption?: string;
    height: number;
    invertInDarkMode?: boolean;
    src: string;
    width: number;
  } | null;
};

export type AboutPopover =
  | AboutAgePopover
  | AboutListPopover
  | AboutMediaPopover;

export type AboutPopoverRegistry = {
  age: AboutAgePopover;
  drawing: AboutMediaPopover;
  films: AboutListPopover;
  games: AboutListPopover;
  music: AboutListPopover;
  realityShows: AboutListPopover;
};

export type AboutExperience = {
  role: string;
  company: string;
  period: string;
  summary: string;
  achievements: readonly string[];
  skillSlugs: readonly string[];
};

export type AboutDocument = {
  id: string;
  locale: Locale;
  title: string;
  hero: AboutHero;
  professional: readonly AboutParagraph[];
  personal: readonly AboutParagraph[];
  popovers: AboutPopoverRegistry;
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
  privateEntryType: PrivateEntryType | null;
  publicationState: PublicationState;
  sortDate: string;
  title: string;
  summary: string;
  paragraphs: readonly string[];
  bullets: readonly string[];
  stack: readonly string[];
  links: readonly EntryLink[];
  featured: boolean;
  organization: string | null;
  period: string | null;
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
  bodyParagraphs: readonly string[];
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
