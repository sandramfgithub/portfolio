import type { SkillBadgeViewModel } from '@/application/portfolio/dto';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { Lang } from '@/i18n/translations';

export function SkillBadge({
  skill,
  lang,
}: {
  skill: SkillBadgeViewModel;
  lang: Lang;
}) {
  return (
    <Popover>
      <PopoverTrigger
        render={<button className="cursor-pointer" type="button" />}
      >
        <Badge className="text-[11px]" variant="secondary">
          {skill.name}
        </Badge>
      </PopoverTrigger>
      <PopoverContent side="top">
        <div className="flex items-center justify-between">
          <a
            className="font-semibold text-sm underline hover:text-foreground"
            href={skill.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            {skill.name}
          </a>
          {skill.lastVersion && (
            <Badge className="text-[10px]" variant="outline">
              v{skill.lastVersion}
            </Badge>
          )}
        </div>
        <p className="mt-1 text-muted-foreground text-xs">
          {lang === 'es' ? 'Uso reciente' : 'Last used'}: {skill.lastUsedAt}
        </p>
        <p className="mt-2 text-muted-foreground text-sm">{skill.summary}</p>
      </PopoverContent>
    </Popover>
  );
}
