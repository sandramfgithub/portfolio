import type { CSSProperties } from 'react';
import type { ProjectCardViewModel } from '@/application/portfolio/dto';
import { StackList } from '@/components/stack-list';
import type { Lang } from '@/i18n/translations';

type Props = ProjectCardViewModel & {
  lang: Lang;
  style?: CSSProperties;
};

export function ProjectCard({
  title,
  summary,
  skills,
  github,
  lang,
  style,
}: Props) {
  return (
    <div
      className="group card-lift fade-up-item flex flex-col gap-3 rounded-lg border border-border/60 bg-card p-4"
      style={style}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-base">{title}</h3>
        <a
          className="text-muted-foreground text-sm underline transition-colors hover:text-foreground group-hover:text-foreground"
          href={github}
          rel="noopener noreferrer"
          target="_blank"
        >
          GitHub
        </a>
      </div>
      <p className="text-muted-foreground text-sm leading-6">{summary}</p>
      <div className="mt-auto">
        <StackList lang={lang} skills={skills} />
      </div>
    </div>
  );
}
