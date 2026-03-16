import type {
  PrivateEntryType,
  PublicationState,
  SkillStatus,
  SocialIcon,
} from '@/domain/portfolio/value-objects';

export type NavigationItemViewModel = {
  href: string;
  label: string;
};

export type SocialLinkViewModel = {
  href: string;
  label: string;
  icon: SocialIcon;
};

export type LayoutViewModel = {
  navigation: readonly NavigationItemViewModel[];
  socialLinks: readonly SocialLinkViewModel[];
};

export type SkillBadgeViewModel = {
  slug: string;
  name: string;
  url: string;
  lastUsedAt: string;
  lastVersion: string | null;
  summary: string;
  details: readonly string[];
  status: SkillStatus;
  active: boolean;
};

export type HomePageViewModel = {
  title: string;
  description: string;
  introParagraphs: readonly string[];
};

export type ProjectCardViewModel = {
  slug: string;
  href: string | null;
  title: string;
  summary: string;
  skills: readonly SkillBadgeViewModel[];
  github: string | null;
  publicationState: PublicationState;
};

export type PrivateEntryViewModel = {
  slug: string;
  href: string;
  title: string;
  summary: string;
  skills: readonly SkillBadgeViewModel[];
  privateEntryType: PrivateEntryType;
};

export type ProjectsPageViewModel = {
  title: string;
  description: string;
  introParagraphs: readonly string[];
  publicProjects: readonly ProjectCardViewModel[];
  privateEntries: readonly PrivateEntryViewModel[];
};

export type AboutExperienceViewModel = {
  role: string;
  company: string;
  period: string;
  summary: string;
  achievements: readonly string[];
  skills: readonly SkillBadgeViewModel[];
};

export type AboutHeroViewModel = {
  name: string;
  roleChip: string;
  roleTitle: string;
  location: string;
};

export type AboutInlineTextNodeViewModel = {
  type: 'text';
  value: string;
};

export type AboutInlineStrongNodeViewModel = {
  type: 'strong';
  value: string;
};

export type AboutInlinePopoverNodeViewModel = {
  type: 'popover';
  key:
    | 'age'
    | 'cats'
    | 'drawing'
    | 'films'
    | 'games'
    | 'music'
    | 'realityShows';
  trigger?: string;
};

export type AboutInlineNodeViewModel =
  | AboutInlineTextNodeViewModel
  | AboutInlineStrongNodeViewModel
  | AboutInlinePopoverNodeViewModel;

export type AboutParagraphViewModel = {
  nodes: readonly AboutInlineNodeViewModel[];
};

export type AboutAgePopoverViewModel = {
  kind: 'age';
  birthDate: string;
  birthdayText: string;
  defaultText: string;
};

export type AboutPopoverItemViewModel = {
  label: string;
  href?: string;
};

export type AboutListPopoverViewModel = {
  kind: 'list';
  title: string;
  intro?: string;
  items: readonly AboutPopoverItemViewModel[];
};

export type AboutMediaPopoverViewModel = {
  kind: 'media';
  title: string;
  body: readonly string[];
  links?: readonly AboutPopoverItemViewModel[];
  image: {
    alt: string;
    caption?: string;
    height: number;
    invertInDarkMode?: boolean;
    src: string;
    width: number;
  } | null;
};

export type AboutPopoverViewModel =
  | AboutAgePopoverViewModel
  | AboutListPopoverViewModel
  | AboutMediaPopoverViewModel;

export type AboutPopoverRegistryViewModel = {
  age: AboutAgePopoverViewModel;
  cats: AboutMediaPopoverViewModel;
  drawing: AboutMediaPopoverViewModel;
  films: AboutListPopoverViewModel;
  games: AboutListPopoverViewModel;
  music: AboutListPopoverViewModel;
  realityShows: AboutListPopoverViewModel;
};

export type AboutPageViewModel = {
  title: string;
  description: string;
  hero: AboutHeroViewModel;
  professional: readonly AboutParagraphViewModel[];
  personal: readonly AboutParagraphViewModel[];
  popovers: AboutPopoverRegistryViewModel;
  experience: readonly AboutExperienceViewModel[];
  skills: readonly SkillBadgeViewModel[];
};

export type EntryDetailLinkViewModel = {
  label: string;
  href: string;
  kind: string;
};

export type EntryDetailPageViewModel = {
  title: string;
  seoTitle: string;
  description: string;
  slug: string;
  href: string;
  listingHref: string;
  kind: 'public-project' | 'case-study';
  summary: string;
  paragraphs: readonly string[];
  bullets: readonly string[];
  skills: readonly SkillBadgeViewModel[];
  links: readonly EntryDetailLinkViewModel[];
  featured: boolean;
  organization: string | null;
  period: string | null;
  privateEntryType: PrivateEntryType | null;
};
