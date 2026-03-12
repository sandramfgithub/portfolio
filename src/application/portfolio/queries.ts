import type {
  AboutPageViewModel,
  CaseStudyViewModel,
  HomePageViewModel,
  LayoutViewModel,
  ProjectCardViewModel,
  ProjectsPageViewModel,
  SkillBadgeViewModel,
} from '@/application/portfolio/dto';
import type { PortfolioEntry, Skill } from '@/domain/portfolio/entities';
import type { ContentRepository } from '@/domain/portfolio/repository';
import type { Locale, PageSlug } from '@/domain/portfolio/value-objects';

const requireValue = <T>(value: T | null | undefined, message: string): T => {
  if (!value) {
    throw new Error(message);
  }

  return value;
};

const mapSkillBadge = (skill: Skill): SkillBadgeViewModel => {
  return {
    slug: skill.slug,
    name: skill.name,
    url: skill.url,
    lastUsedAt: skill.lastUsedAt,
    lastVersion: skill.lastVersion,
    summary: skill.summary,
    details: skill.details,
    status: skill.status,
    active: skill.active,
  };
};

const createSkillLookup = (skills: readonly Skill[]) => {
  return new Map(skills.map((skill) => [skill.slug, mapSkillBadge(skill)]));
};

const resolveSkills = (
  skillSlugs: readonly string[],
  skillLookup: Map<string, SkillBadgeViewModel>
) => {
  return skillSlugs.flatMap((skillSlug) => {
    const skill = skillLookup.get(skillSlug);
    return skill ? [skill] : [];
  });
};

const getPageOrThrow = async (
  repository: ContentRepository,
  locale: Locale,
  slug: PageSlug
) => {
  const page = await repository.getPage(locale, slug);
  return requireValue(page, `Missing page content for ${slug}:${locale}`);
};

const getSkillsAndLookup = async (
  repository: ContentRepository,
  locale: Locale
) => {
  const skills = await repository.listSkills(locale);
  return {
    skills,
    skillLookup: createSkillLookup(skills),
  };
};

const getRepository = async (
  repository?: ContentRepository
): Promise<ContentRepository> => {
  if (repository) {
    return repository;
  }

  const module = await import('@/infrastructure/content-local/repository');
  return module.localContentRepository;
};

export const getLayoutViewModel = async (
  locale: Locale,
  repository?: ContentRepository
): Promise<LayoutViewModel> => {
  const contentRepository = await getRepository(repository);
  const site = await contentRepository.getSite(locale);
  const content = requireValue(site, `Missing site content for ${locale}`);

  return {
    navigation: content.navigation,
    socialLinks: content.socialLinks,
  };
};

export const getHomePageViewModel = async (
  locale: Locale,
  repository?: ContentRepository
): Promise<HomePageViewModel> => {
  const contentRepository = await getRepository(repository);
  const page = await getPageOrThrow(contentRepository, locale, 'home');

  return {
    title: page.seo.title,
    description: page.seo.description,
    introParagraphs: page.introParagraphs,
  };
};

const getRepositoryLink = (
  links: readonly { href: string; kind: string }[]
) => {
  const repositoryLink = links.find((link) => link.kind === 'repository');
  return requireValue(repositoryLink, 'Missing repository link');
};

const toProjectCardViewModel = (
  entry: PortfolioEntry,
  skillLookup: Map<string, SkillBadgeViewModel>
): ProjectCardViewModel => {
  return {
    slug: entry.slug,
    title: entry.title,
    summary: entry.summary,
    skills: resolveSkills(entry.stack, skillLookup),
    github: getRepositoryLink(entry.links).href,
  };
};

const toCaseStudyViewModel = (
  entry: PortfolioEntry,
  skillLookup: Map<string, SkillBadgeViewModel>
): CaseStudyViewModel => {
  return {
    slug: entry.slug,
    title: entry.title,
    summary: entry.summary,
    skills: resolveSkills(entry.stack, skillLookup),
    hasCaseStudy: entry.hasCaseStudy,
  };
};

export const getProjectsPageViewModel = async (
  locale: Locale,
  repository?: ContentRepository
): Promise<ProjectsPageViewModel> => {
  const contentRepository = await getRepository(repository);
  const [page, entries, { skillLookup }] = await Promise.all([
    getPageOrThrow(contentRepository, locale, 'projects'),
    contentRepository.listEntries(locale),
    getSkillsAndLookup(contentRepository, locale),
  ]);

  const publicProjects = entries
    .filter((entry: PortfolioEntry) => entry.kind === 'public-project')
    .map((entry: PortfolioEntry) => toProjectCardViewModel(entry, skillLookup));
  const caseStudies = entries
    .filter((entry: PortfolioEntry) => entry.kind === 'case-study')
    .map((entry: PortfolioEntry) => toCaseStudyViewModel(entry, skillLookup));

  return {
    title: page.seo.title,
    description: page.seo.description,
    introParagraphs: page.introParagraphs,
    publicProjects,
    caseStudies,
  };
};

export const getAboutPageViewModel = async (
  locale: Locale,
  repository?: ContentRepository
): Promise<AboutPageViewModel> => {
  const contentRepository = await getRepository(repository);
  const [page, cv, { skillLookup }] = await Promise.all([
    getPageOrThrow(contentRepository, locale, 'about'),
    contentRepository.getCv(locale),
    getSkillsAndLookup(contentRepository, locale),
  ]);

  const document = requireValue(cv, `Missing CV content for ${locale}`);

  return {
    title: page.seo.title,
    description: page.seo.description,
    introParagraphs: page.introParagraphs,
    experience: document.experience.map((experience) => ({
      role: experience.role,
      company: experience.company,
      period: experience.period,
      summary: experience.summary,
      achievements: experience.achievements,
      skills: resolveSkills(experience.stack, skillLookup),
    })),
    skills: resolveSkills(document.skillSlugs, skillLookup),
  };
};
