import type { CSSProperties } from 'react';
import type { ProjectCardViewModel } from '@/application/portfolio/dto';
import { StackList } from '@/components/stack-list';
import { Badge } from '@/components/ui/badge';
import type { Lang } from '@/i18n/translations';
import { getTranslations } from '@/i18n/utils';
import { cn } from '@/lib/utils';

type Props = ProjectCardViewModel & {
  lang: Lang;
  style?: CSSProperties;
};

export function ProjectCard({
  href,
  title,
  summary,
  skills,
  github,
  publicationState,
  lang,
  style,
}: Props) {
  const t = getTranslations(lang);
  const isComingSoon = publicationState === 'coming-soon';

  return (
    <div
      className={cn(
        'group fade-up-item flex flex-col gap-3 rounded-lg border border-border/60 bg-card p-4',
        !isComingSoon && 'card-lift',
        isComingSoon && 'opacity-85'
      )}
      style={style}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isComingSoon && (
            <Badge className="text-[11px]" variant="outline">
              {t.projects.comingSoon}
            </Badge>
          )}
          <h3 className="font-semibold text-base">
            {href ? (
              <a
                className="transition-colors hover:text-muted-foreground"
                href={href}
              >
                {title}
              </a>
            ) : (
              <span>{title}</span>
            )}
          </h3>
        </div>
        {github && (
          <a
            className="text-muted-foreground text-sm underline transition-colors hover:text-foreground group-hover:text-foreground"
            href={github}
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub
          </a>
        )}
      </div>
      <p
        className={cn(
          'text-muted-foreground text-sm leading-6',
          isComingSoon && 'pointer-events-none select-none blur-[3px]'
        )}
      >
        {summary}
      </p>
      <div
        className={cn(
          'mt-auto',
          isComingSoon && 'pointer-events-none select-none blur-[3px]'
        )}
      >
        <StackList lang={lang} skills={skills} />
      </div>
    </div>
  );
}
