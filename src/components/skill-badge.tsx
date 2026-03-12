import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { skills } from '@/data/skills';
import type { Lang } from '@/i18n/translations';

export function SkillBadge({ name, lang }: { name: string; lang: Lang }) {
  const info = skills[name];

  if (!info) {
    return (
      <Badge className="text-[11px]" variant="secondary">
        {name}
      </Badge>
    );
  }

  return (
    <Popover>
      <PopoverTrigger
        render={<button className="cursor-pointer" type="button" />}
      >
        <Badge className="text-[11px]" variant="secondary">
          {name}
        </Badge>
      </PopoverTrigger>
      <PopoverContent side="top">
        <div className="flex items-center justify-between">
          <a
            className="font-semibold text-sm underline hover:text-foreground"
            href={info.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            {name}
          </a>
          {info.version && (
            <Badge className="text-[10px]" variant="outline">
              v{info.version}
            </Badge>
          )}
        </div>
        <p className="mt-1 text-muted-foreground text-xs">
          {lang === 'es' ? 'Uso reciente' : 'Last used'}: {info.lastUsed}
        </p>
        <p className="mt-2 text-muted-foreground text-sm">
          {info.description[lang]}
        </p>
      </PopoverContent>
    </Popover>
  );
}
