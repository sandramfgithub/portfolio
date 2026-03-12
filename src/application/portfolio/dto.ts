import type { SkillStatus, SocialIcon } from '@/domain/portfolio/value-objects';

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
  title: string;
  summary: string;
  skills: readonly SkillBadgeViewModel[];
  github: string;
};

export type CaseStudyViewModel = {
  slug: string;
  title: string;
  summary: string;
  skills: readonly SkillBadgeViewModel[];
  hasCaseStudy: boolean;
};

export type ProjectsPageViewModel = {
  title: string;
  description: string;
  introParagraphs: readonly string[];
  publicProjects: readonly ProjectCardViewModel[];
  caseStudies: readonly CaseStudyViewModel[];
};

export type AboutExperienceViewModel = {
  role: string;
  company: string;
  period: string;
  summary: string;
  achievements: readonly string[];
  skills: readonly SkillBadgeViewModel[];
};

export type AboutPageViewModel = {
  title: string;
  description: string;
  introParagraphs: readonly string[];
  experience: readonly AboutExperienceViewModel[];
  skills: readonly SkillBadgeViewModel[];
};
