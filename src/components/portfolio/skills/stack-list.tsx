import type { SkillBadgeViewModel } from '@/application/portfolio/dto';
import { SkillBadge } from '@/components/portfolio/skills/skill-badge';
import type { Lang } from '@/i18n/translations';

export function StackList({
  skills,
  lang,
}: {
  skills: readonly SkillBadgeViewModel[];
  lang: Lang;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {skills.map((skill) => (
        <SkillBadge key={skill.slug} lang={lang} skill={skill} />
      ))}
    </div>
  );
}
