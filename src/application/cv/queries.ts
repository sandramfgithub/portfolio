import type { CvPageViewModel, CvViewModel } from '@/application/cv/dto';
import type { Skill } from '@/domain/portfolio/entities';
import type { ContentRepository } from '@/domain/portfolio/repository';
import type { Locale } from '@/domain/portfolio/value-objects';

const requireValue = <T>(value: T | null | undefined, message: string): T => {
  if (!value) {
    throw new Error(message);
  }

  return value;
};

const createSkillNameLookup = (skills: readonly Skill[]) => {
  return new Map(skills.map((skill) => [skill.slug, skill.name]));
};

const resolveSkillNames = (
  skillSlugs: readonly string[],
  skillNameLookup: Map<string, string>
) => {
  return skillSlugs.flatMap((skillSlug) => {
    const skillName = skillNameLookup.get(skillSlug);
    return skillName ? [skillName] : [];
  });
};

const getRepository = async (repository?: ContentRepository) => {
  if (repository) {
    return repository;
  }

  const module = await import('@/infrastructure/content-local/repository');
  return module.localContentRepository;
};

export const getCvViewModel = async (
  locale: Locale,
  repository?: ContentRepository
): Promise<CvViewModel> => {
  const contentRepository = await getRepository(repository);
  const [cv, skills] = await Promise.all([
    contentRepository.getCv(locale),
    contentRepository.listSkills(locale),
  ]);

  const document = requireValue(cv, `Missing CV content for ${locale}`);
  const skillNameLookup = createSkillNameLookup(skills);

  return {
    profile: document.profile,
    contacts: document.contacts,
    education: document.education,
    certifications: document.certifications,
    experience: document.experience.map((experience) => ({
      role: experience.role,
      company: experience.company,
      period: experience.period,
      summary: experience.summary,
      achievements: experience.achievements,
      skillSlugs: experience.stack,
      stack: resolveSkillNames(experience.stack, skillNameLookup),
    })),
    languages: document.languages.map((language) => ({
      name: language.name,
    })),
    skillSlugs: document.skillSlugs,
    skillNames: resolveSkillNames(document.skillSlugs, skillNameLookup),
  };
};

export const getCvPageViewModel = async (
  locale: Locale,
  repository?: ContentRepository
): Promise<CvPageViewModel> => {
  const cv = await getCvViewModel(locale, repository);

  return {
    cv,
    description: cv.profile.summary,
    title: `CV | ${cv.profile.name}`,
  };
};
