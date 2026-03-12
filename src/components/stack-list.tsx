import { SkillBadge } from '@/components/skill-badge';
import type { Lang } from '@/i18n/translations';

export function StackList({ stack, lang }: { stack: string[]; lang: Lang }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {stack.map((s) => (
        <SkillBadge key={s} lang={lang} name={s} />
      ))}
    </div>
  );
}
