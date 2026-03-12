import { describe, expect, it } from 'vitest';
import {
  getAboutPageViewModel,
  getHomePageViewModel,
  getLayoutViewModel,
  getProjectsPageViewModel,
} from '@/application/portfolio/queries';
import type {
  CvDocument,
  PageContent,
  PortfolioEntry,
  SiteContent,
  Skill,
} from '@/domain/portfolio/entities';
import type { ContentRepository } from '@/domain/portfolio/repository';

const site: SiteContent = {
  id: 'site-en',
  locale: 'en',
  navigation: [
    { href: '/en', label: 'Home' },
    { href: '/en/projects', label: 'Projects' },
  ],
  socialLinks: [
    { href: 'https://github.com/example', label: 'GitHub', icon: 'github' },
  ],
};

const pages: PageContent[] = [
  {
    id: 'home-en',
    locale: 'en',
    slug: 'home',
    title: 'Home title',
    introParagraphs: ['Home intro'],
    seo: { title: 'Home title', description: 'Home description' },
  },
  {
    id: 'projects-en',
    locale: 'en',
    slug: 'projects',
    title: 'Projects title',
    introParagraphs: ['Projects intro'],
    seo: { title: 'Projects title', description: 'Projects description' },
  },
  {
    id: 'about-en',
    locale: 'en',
    slug: 'about',
    title: 'About title',
    introParagraphs: ['About intro'],
    seo: { title: 'About title', description: 'About description' },
  },
];

const entries: PortfolioEntry[] = [
  {
    id: 'portfolio-en',
    slug: 'portfolio',
    locale: 'en',
    kind: 'public-project',
    visibility: 'public',
    status: 'published',
    title: 'portfolio',
    summary: 'Public summary',
    paragraphs: [],
    bullets: [],
    stack: ['react', 'typescript'],
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/example/portfolio',
        kind: 'repository',
      },
    ],
    featured: true,
    organization: null,
    period: null,
    hasCaseStudy: false,
    seo: { title: 'portfolio', description: 'Public summary' },
  },
  {
    id: 'private-work-en',
    slug: 'private-work',
    locale: 'en',
    kind: 'case-study',
    visibility: 'private',
    status: 'published',
    title: 'Private Work',
    summary: 'Private summary',
    paragraphs: [],
    bullets: [],
    stack: ['typescript'],
    links: [],
    featured: false,
    organization: null,
    period: null,
    hasCaseStudy: true,
    seo: { title: 'Private Work', description: 'Private summary' },
  },
];

const skills: Skill[] = [
  {
    id: 'react-en',
    slug: 'react',
    locale: 'en',
    name: 'React',
    status: 'active',
    active: true,
    lastUsedAt: '2025',
    lastVersion: '19',
    url: 'https://react.dev',
    summary: 'React summary',
    details: ['React detail'],
    relatedEntrySlugs: ['portfolio'],
    seo: { title: 'React', description: 'React summary' },
  },
  {
    id: 'typescript-en',
    slug: 'typescript',
    locale: 'en',
    name: 'TypeScript',
    status: 'active',
    active: true,
    lastUsedAt: '2025',
    lastVersion: '5.9',
    url: 'https://typescriptlang.org',
    summary: 'TypeScript summary',
    details: ['TypeScript detail'],
    relatedEntrySlugs: ['portfolio', 'private-work'],
    seo: { title: 'TypeScript', description: 'TypeScript summary' },
  },
];

const cv: CvDocument = {
  id: 'cv-en',
  locale: 'en',
  profile: {
    name: 'Sandra',
    role: 'Developer',
    location: 'Spain',
    web: 'sandramf.dev',
    summary: 'Profile summary',
    photo: null,
  },
  contacts: {
    github: 'https://github.com/example',
    linkedin: 'https://linkedin.com/in/example',
    email: 'mail@example.com',
  },
  experience: [
    {
      role: 'Developer',
      company: 'Example Co',
      period: '2022-Present',
      summary: 'Experience summary',
      achievements: ['Achievement'],
      stack: ['react', 'typescript'],
    },
  ],
  education: [],
  languages: [{ name: 'English', level: 'Professional' }],
  certifications: [],
  skillSlugs: ['react', 'typescript'],
};

const createRepository = (
  overrides: Partial<ContentRepository> = {}
): ContentRepository => ({
  getSite: async () => site,
  getPage: async (_locale, slug) =>
    pages.find((page) => page.slug === slug) ?? null,
  listEntries: async () => entries,
  getEntry: async (_locale, slug) =>
    entries.find((entry) => entry.slug === slug) ?? null,
  listSkills: async () => skills,
  getSkill: async (_locale, slug) =>
    skills.find((skill) => skill.slug === slug) ?? null,
  getCv: async () => cv,
  ...overrides,
});

describe('portfolio queries', () => {
  it('builds the layout view model from repository content', async () => {
    const layout = await getLayoutViewModel('en', createRepository());

    expect(layout.navigation).toHaveLength(2);
    expect(layout.socialLinks[0]?.label).toBe('GitHub');
  });

  it('builds the home page view model from page content', async () => {
    const page = await getHomePageViewModel('en', createRepository());

    expect(page.title).toBe('Home title');
    expect(page.description).toBe('Home description');
    expect(page.introParagraphs).toEqual(['Home intro']);
  });

  it('maps entry stacks into project and case study skill badges', async () => {
    const page = await getProjectsPageViewModel('en', createRepository());

    expect(page.publicProjects[0]?.github).toBe(
      'https://github.com/example/portfolio'
    );
    expect(page.publicProjects[0]?.skills.map((skill) => skill.name)).toEqual([
      'React',
      'TypeScript',
    ]);
    expect(page.caseStudies[0]?.hasCaseStudy).toBe(true);
  });

  it('maps CV experience and top-level skills into the about page', async () => {
    const page = await getAboutPageViewModel('en', createRepository());

    expect(page.experience[0]?.skills.map((skill) => skill.name)).toEqual([
      'React',
      'TypeScript',
    ]);
    expect(page.skills.map((skill) => skill.name)).toEqual([
      'React',
      'TypeScript',
    ]);
  });

  it('throws when required page content is missing', async () => {
    await expect(
      getHomePageViewModel(
        'en',
        createRepository({
          getPage: async () => null,
        })
      )
    ).rejects.toThrow('Missing page content for home:en');
  });
});
