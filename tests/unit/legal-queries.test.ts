import { describe, expect, it } from 'vitest';
import { getPrivacyPolicyPageViewModel } from '@/application/legal/queries';
import type { PolicyDocument } from '@/domain/legal/entities';
import type { ContentRepository } from '@/domain/portfolio/repository';

const policy: PolicyDocument = {
  id: 'privacy-en',
  slug: 'privacy',
  locale: 'en',
  title: 'Privacy policy',
  summary: 'Privacy summary',
  controllerName: 'Sandra',
  contactEmail: 'mail@example.com',
  providerName: 'Umami Cloud',
  providerUrl: 'https://cloud.umami.is',
  retention: '6 months',
  sections: [
    {
      id: 'collected',
      title: 'What is measured',
      paragraphs: ['One paragraph'],
      bullets: ['One bullet'],
    },
  ],
  seo: {
    title: 'Privacy | Sandra',
    description: 'Privacy description',
  },
};

const createRepository = (
  overrides: Partial<ContentRepository> = {}
): ContentRepository => ({
  getAbout: () => Promise.reject(new Error('unused')),
  getCv: () => Promise.reject(new Error('unused')),
  getEntry: () => Promise.reject(new Error('unused')),
  getPage: () => Promise.reject(new Error('unused')),
  getPolicy: () => Promise.resolve(policy),
  getSite: () => Promise.reject(new Error('unused')),
  getSkill: () => Promise.reject(new Error('unused')),
  listEntries: () => Promise.reject(new Error('unused')),
  listSkills: () => Promise.reject(new Error('unused')),
  ...overrides,
});

describe('legal queries', () => {
  it('builds the privacy policy page view model', async () => {
    const page = await getPrivacyPolicyPageViewModel('en', createRepository());

    expect(page.title).toBe('Privacy | Sandra');
    expect(page.retention).toBe('6 months');
    expect(page.sections[0]?.id).toBe('collected');
  });

  it('throws when the privacy policy is missing', async () => {
    await expect(
      getPrivacyPolicyPageViewModel(
        'en',
        createRepository({
          getPolicy: async () => null,
        })
      )
    ).rejects.toThrow('Missing privacy policy for en');
  });
});
