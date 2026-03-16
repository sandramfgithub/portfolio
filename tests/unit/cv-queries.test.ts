import { describe, expect, it } from 'vitest';
import { getCvPageViewModel, getCvViewModel } from '@/application/cv/queries';
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
  navigation: [],
  socialLinks: [],
};

const pages: PageContent[] = [];
const entries: PortfolioEntry[] = [];
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
    relatedEntrySlugs: [],
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
    relatedEntrySlugs: [],
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
  getAbout: async () => null,
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

describe('cv queries', () => {
  it('maps CV skill slugs into display names', async () => {
    const viewModel = await getCvViewModel('en', createRepository());

    expect(viewModel.skillNames).toEqual(['React', 'TypeScript']);
    expect(viewModel.experience[0]?.stack).toEqual(['React', 'TypeScript']);
    expect(viewModel.contacts.email).toBe('mail@example.com');
    expect(viewModel.education).toEqual([]);
    expect(viewModel.certifications).toEqual([]);
  });

  it('builds the CV page view model from the document', async () => {
    const page = await getCvPageViewModel('en', createRepository());

    expect(page.title).toBe('CV | Sandra');
    expect(page.description).toBe('Profile summary');
    expect(page.cv.profile.name).toBe('Sandra');
  });

  it('throws when the CV document is missing', async () => {
    await expect(
      getCvViewModel(
        'en',
        createRepository({
          getCv: async () => null,
        })
      )
    ).rejects.toThrow('Missing CV content for en');
  });
});
