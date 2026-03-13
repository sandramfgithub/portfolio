import { getCvViewModel } from '@/application/cv/queries';
import type {
  AboutPageViewModel,
  EntryDetailPageViewModel,
  HomePageViewModel,
  LayoutViewModel,
  PrivateEntryViewModel,
  ProjectCardViewModel,
  ProjectsPageViewModel,
  SkillBadgeViewModel,
} from '@/application/portfolio/dto';
import type { PortfolioEntry, Skill } from '@/domain/portfolio/entities';
import type { ContentRepository } from '@/domain/portfolio/repository';
import {
  type EntryKind,
  type Locale,
  locales,
  type PageSlug,
} from '@/domain/portfolio/value-objects';

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

const getLocaleBasePath = (locale: Locale) => {
  return `/${locale}`;
};

const getProjectsIndexPath = (locale: Locale) => {
  return `${getLocaleBasePath(locale)}/projects`;
};

const getCaseStudiesDetailBasePath = (locale: Locale) => {
  return `${getLocaleBasePath(locale)}/case-studies`;
};

const getListingPath = (locale: Locale, kind: EntryKind) => {
  return kind === 'public-project'
    ? `${getProjectsIndexPath(locale)}#public-heading`
    : `${getProjectsIndexPath(locale)}#cases-heading`;
};

const getEntryPath = (locale: Locale, kind: EntryKind, slug: string) => {
  return kind === 'public-project'
    ? `${getProjectsIndexPath(locale)}/${slug}`
    : `${getCaseStudiesDetailBasePath(locale)}/${slug}`;
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
  return links.find((link) => link.kind === 'repository') ?? null;
};

const isPublishedEntry = (entry: PortfolioEntry) => {
  return entry.publicationState === 'published';
};

const getSortTimestamp = (entry: PortfolioEntry) => {
  const timestamp = Date.parse(entry.sortDate);

  if (Number.isNaN(timestamp)) {
    throw new Error(`Invalid sort date for ${entry.slug}:${entry.locale}`);
  }

  return timestamp;
};

const sortByMostRecentFirst = (left: PortfolioEntry, right: PortfolioEntry) => {
  return getSortTimestamp(right) - getSortTimestamp(left);
};

const sortPrivateEntries = (left: PortfolioEntry, right: PortfolioEntry) => {
  if (left.privateEntryType !== right.privateEntryType) {
    return left.privateEntryType === 'work' ? -1 : 1;
  }

  return sortByMostRecentFirst(left, right);
};

const toProjectCardViewModel = (
  entry: PortfolioEntry,
  skillLookup: Map<string, SkillBadgeViewModel>
): ProjectCardViewModel => {
  const repositoryLink = getRepositoryLink(entry.links);
  const isComingSoon = entry.publicationState === 'coming-soon';

  if (entry.publicationState === 'published') {
    requireValue(repositoryLink, `Missing repository link for ${entry.slug}`);
  }

  return {
    slug: entry.slug,
    href: isComingSoon
      ? null
      : getEntryPath(entry.locale, entry.kind, entry.slug),
    title: entry.title,
    summary: entry.summary,
    skills: resolveSkills(entry.stack, skillLookup),
    github: isComingSoon ? null : (repositoryLink?.href ?? null),
    publicationState: entry.publicationState,
  };
};

const toPrivateEntryViewModel = (
  entry: PortfolioEntry,
  skillLookup: Map<string, SkillBadgeViewModel>
): PrivateEntryViewModel => {
  const privateEntryType = requireValue(
    entry.privateEntryType,
    `Missing private entry type for ${entry.slug}`
  );

  return {
    slug: entry.slug,
    href: getEntryPath(entry.locale, entry.kind, entry.slug),
    title: entry.title,
    summary: entry.summary,
    skills: resolveSkills(entry.stack, skillLookup),
    privateEntryType,
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
    .filter((entry: PortfolioEntry) => {
      return (
        entry.kind === 'public-project' && entry.publicationState !== 'draft'
      );
    })
    .sort(sortByMostRecentFirst)
    .map((entry: PortfolioEntry) => toProjectCardViewModel(entry, skillLookup));
  const privateEntries = entries
    .filter((entry: PortfolioEntry) => {
      return entry.kind === 'case-study' && isPublishedEntry(entry);
    })
    .sort(sortPrivateEntries)
    .map((entry: PortfolioEntry) =>
      toPrivateEntryViewModel(entry, skillLookup)
    );

  return {
    title: page.seo.title,
    description: page.seo.description,
    introParagraphs: page.introParagraphs,
    publicProjects,
    privateEntries,
  };
};

export const getAboutPageViewModel = async (
  locale: Locale,
  repository?: ContentRepository
): Promise<AboutPageViewModel> => {
  const contentRepository = await getRepository(repository);
  const [page, cv, { skillLookup }] = await Promise.all([
    getPageOrThrow(contentRepository, locale, 'about'),
    getCvViewModel(locale, contentRepository),
    getSkillsAndLookup(contentRepository, locale),
  ]);

  return {
    title: page.seo.title,
    description: page.seo.description,
    introParagraphs: page.introParagraphs,
    experience: cv.experience.map((experience) => ({
      role: experience.role,
      company: experience.company,
      period: experience.period,
      summary: experience.summary,
      achievements: experience.achievements,
      skills: resolveSkills(experience.skillSlugs, skillLookup),
    })),
    skills: resolveSkills(cv.skillSlugs, skillLookup),
  };
};

export const listEntryRouteParams = async (
  kind: EntryKind,
  repository?: ContentRepository
) => {
  const contentRepository = await getRepository(repository);
  const routeParams: Array<{ lang: Locale; slug: string }> = [];

  for (const locale of locales) {
    const entries = await contentRepository.listEntries(locale);

    routeParams.push(
      ...entries
        .filter((entry) => entry.kind === kind && isPublishedEntry(entry))
        .map((entry) => ({
          lang: locale,
          slug: entry.slug,
        }))
    );
  }

  return routeParams;
};

export const getEntryDetailPageViewModel = async (
  locale: Locale,
  kind: EntryKind,
  slug: string,
  repository?: ContentRepository
): Promise<EntryDetailPageViewModel> => {
  const contentRepository = await getRepository(repository);
  const [entry, { skillLookup }] = await Promise.all([
    contentRepository.getEntry(locale, slug),
    getSkillsAndLookup(contentRepository, locale),
  ]);

  const document = requireValue(
    entry,
    `Missing entry content for ${kind}:${slug}:${locale}`
  );

  if (document.kind !== kind) {
    throw new Error(`Unexpected entry kind for ${kind}:${slug}:${locale}`);
  }

  if (!isPublishedEntry(document)) {
    throw new Error(`Entry is not published for ${kind}:${slug}:${locale}`);
  }

  return {
    title: document.title,
    seoTitle: document.seo.title,
    description: document.seo.description,
    slug: document.slug,
    href: getEntryPath(locale, document.kind, document.slug),
    listingHref: getListingPath(locale, document.kind),
    kind: document.kind,
    summary: document.summary,
    paragraphs: document.paragraphs,
    bullets: document.bullets,
    skills: resolveSkills(document.stack, skillLookup),
    links: document.links,
    featured: document.featured,
    organization: document.organization,
    period: document.period,
    privateEntryType: document.privateEntryType,
  };
};
