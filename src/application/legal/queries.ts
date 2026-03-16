import type { PrivacyPolicyPageViewModel } from '@/application/legal/dto';
import type { ContentRepository } from '@/domain/portfolio/repository';
import type { Locale } from '@/domain/portfolio/value-objects';

const requireValue = <T>(value: T | null | undefined, message: string): T => {
  if (!value) {
    throw new Error(message);
  }

  return value;
};

const getRepository = async (repository?: ContentRepository) => {
  if (repository) {
    return repository;
  }

  /* v8 ignore start -- astro:content is only available in the Astro runtime */
  const module = await import('@/infrastructure/content-local/repository');
  return module.localContentRepository;
  /* v8 ignore stop */
};

export const getPrivacyPolicyPageViewModel = async (
  locale: Locale,
  repository?: ContentRepository
): Promise<PrivacyPolicyPageViewModel> => {
  const contentRepository = await getRepository(repository);
  const policy = await contentRepository.getPolicy(locale, 'privacy');
  const document = requireValue(policy, `Missing privacy policy for ${locale}`);

  return {
    title: document.seo.title,
    description: document.seo.description,
    summary: document.summary,
    controllerName: document.controllerName,
    contactEmail: document.contactEmail,
    providerLinks: document.providerLinks,
    providerName: document.providerName,
    providerUrl: document.providerUrl,
    retention: document.retention,
    sections: document.sections.map((section) => ({
      id: section.id,
      title: section.title,
      paragraphs: section.paragraphs,
      bullets: section.bullets ?? [],
    })),
  };
};
