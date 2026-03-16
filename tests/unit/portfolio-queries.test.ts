import { describe, expect, it } from 'vitest';
import {
  getAboutPageViewModel,
  getEntryDetailPageViewModel,
  getHomePageViewModel,
  getLayoutViewModel,
  getProjectsPageViewModel,
  listEntryRouteParams,
} from '@/application/portfolio/queries';
import type {
  AboutDocument,
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
];

const about: AboutDocument = {
  id: 'about-en',
  locale: 'en',
  title: 'About title',
  hero: {
    name: 'Sandra',
    roleChip: 'Fullstack Developer',
    roleTitle: 'Senior Fullstack Developer',
    location: 'Murcia, Spain',
  },
  professional: [
    {
      nodes: [
        { type: 'text', value: 'I am ' },
        { type: 'popover', key: 'age' },
      ],
    },
  ],
  personal: [
    {
      nodes: [
        { type: 'text', value: 'I like ' },
        { type: 'popover', key: 'games', trigger: 'games' },
      ],
    },
  ],
  popovers: {
    age: {
      kind: 'age',
      birthDate: '1989-09-15',
      birthdayText: "It's my birthday!",
      defaultText: 'Born September 15, 1989.',
    },
    drawing: {
      kind: 'media',
      title: 'Drawing',
      body: ['Drawing body'],
      image: null,
    },
    films: {
      kind: 'list',
      title: 'Films',
      items: ['Movie'],
      intro: 'Films intro',
    },
    games: {
      kind: 'list',
      title: 'Games',
      items: ['It Takes Two'],
      intro: 'Games intro',
    },
    music: {
      kind: 'list',
      title: 'Music',
      items: ['Band'],
      intro: 'Music intro',
    },
    realityShows: {
      kind: 'list',
      title: 'Reality shows',
      items: ['Show'],
      intro: 'Reality intro',
    },
  },
  seo: { title: 'About title', description: 'About description' },
};

const entries: PortfolioEntry[] = [
  {
    id: 'portfolio-en',
    slug: 'portfolio',
    locale: 'en',
    kind: 'public-project',
    privateEntryType: null,
    publicationState: 'published',
    sortDate: '2026-03-01',
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
    seo: { title: 'portfolio', description: 'Public summary' },
  },
  {
    id: 'upcoming-tool-en',
    slug: 'upcoming-tool',
    locale: 'en',
    kind: 'public-project',
    privateEntryType: null,
    publicationState: 'published',
    sortDate: '2026-01-01',
    title: 'Upcoming Tool',
    summary: 'Upcoming summary',
    paragraphs: [],
    bullets: [],
    stack: ['react'],
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/example/upcoming-tool',
        kind: 'repository',
      },
    ],
    featured: false,
    organization: null,
    period: null,
    seo: { title: 'Upcoming Tool', description: 'Upcoming summary' },
  },
  {
    id: 'private-work-en',
    slug: 'private-work',
    locale: 'en',
    kind: 'case-study',
    privateEntryType: 'work',
    publicationState: 'published',
    sortDate: '2025-02-01',
    title: 'Private Work',
    summary: 'Private summary',
    paragraphs: [],
    bullets: [],
    stack: ['typescript'],
    links: [],
    featured: false,
    organization: null,
    period: null,
    seo: { title: 'Private Work', description: 'Private summary' },
  },
  {
    id: 'academic-case-en',
    slug: 'academic-case',
    locale: 'en',
    kind: 'case-study',
    privateEntryType: 'case-study',
    publicationState: 'published',
    sortDate: '2024-01-01',
    title: 'Academic Case',
    summary: 'Academic summary',
    paragraphs: [],
    bullets: [],
    stack: ['react'],
    links: [],
    featured: false,
    organization: null,
    period: null,
    seo: { title: 'Academic Case', description: 'Academic summary' },
  },
  {
    id: 'draft-case-en',
    slug: 'draft-case',
    locale: 'en',
    kind: 'case-study',
    privateEntryType: 'work',
    publicationState: 'draft',
    sortDate: '2026-04-01',
    title: 'Draft Case',
    summary: 'Draft summary',
    paragraphs: [],
    bullets: [],
    stack: ['typescript'],
    links: [],
    featured: false,
    organization: null,
    period: null,
    seo: { title: 'Draft Case', description: 'Draft summary' },
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
    bodyParagraphs: ['Shared professional paragraph'],
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
  getAbout: async () => about,
  getPolicy: async () => null,
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

  it('maps entry stacks into public and private listings with logical order', async () => {
    const page = await getProjectsPageViewModel('en', createRepository());

    expect(page.publicProjects[0]?.github).toBe(
      'https://github.com/example/portfolio'
    );
    expect(page.publicProjects[0]?.href).toBe('/en/projects/portfolio');
    expect(page.publicProjects[0]?.skills.map((skill) => skill.name)).toEqual([
      'React',
      'TypeScript',
    ]);
    expect(page.publicProjects[1]).toMatchObject({
      slug: 'upcoming-tool',
      href: '/en/projects/upcoming-tool',
      github: 'https://github.com/example/upcoming-tool',
      publicationState: 'published',
    });
    expect(page.publicProjects.map((entry) => entry.slug)).toEqual([
      'portfolio',
      'upcoming-tool',
    ]);
    expect(page.privateEntries.map((entry) => entry.slug)).toEqual([
      'private-work',
      'academic-case',
    ]);
    expect(page.privateEntries[0]?.href).toBe('/en/case-studies/private-work');
    expect(page.privateEntries[1]?.privateEntryType).toBe('case-study');
  });

  it('maps about editorial copy while sharing cv experience and skills', async () => {
    const page = await getAboutPageViewModel('en', createRepository());

    expect(page.hero.roleChip).toBe('Fullstack Developer');
    expect(page.professional[0]?.nodes[1]).toEqual({
      key: 'age',
      type: 'popover',
    });
    expect(page.professional[1]?.nodes).toEqual([
      { type: 'text', value: 'Shared professional paragraph' },
    ]);
    expect(page.personal[0]?.nodes[1]).toEqual({
      key: 'games',
      trigger: 'games',
      type: 'popover',
    });
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

  it('builds entry detail view models with canonical listing links', async () => {
    const page = await getEntryDetailPageViewModel(
      'en',
      'case-study',
      'private-work',
      createRepository()
    );

    expect(page.href).toBe('/en/case-studies/private-work');
    expect(page.listingHref).toBe('/en/projects#cases-heading');
    expect(page.skills.map((skill) => skill.name)).toEqual(['TypeScript']);
  });

  it('allows published public projects without repository links', async () => {
    const page = await getEntryDetailPageViewModel(
      'en',
      'public-project',
      'upcoming-tool',
      createRepository()
    );

    expect(page.href).toBe('/en/projects/upcoming-tool');
    expect(page.links).toEqual([
      {
        label: 'GitHub',
        href: 'https://github.com/example/upcoming-tool',
        kind: 'repository',
      },
    ]);
  });

  it('lists route params for a given entry kind across locales', async () => {
    const routes = await listEntryRouteParams('public-project', {
      ...createRepository(),
      listEntries: async (locale) =>
        entries.map((entry) => ({
          ...entry,
          locale,
        })),
    });

    expect(routes).toEqual([
      { lang: 'es', slug: 'portfolio' },
      { lang: 'es', slug: 'upcoming-tool' },
      { lang: 'en', slug: 'portfolio' },
      { lang: 'en', slug: 'upcoming-tool' },
    ]);
  });
});
