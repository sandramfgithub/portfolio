import { StackList } from '@/components/stack-list';
import { Badge } from '@/components/ui/badge';
import type { Lang } from '@/i18n/translations';
import { getTranslations } from '@/i18n/utils';

type CaseStudy = {
  title: string;
  summary: string;
  stack: string[];
  caseStudy?: boolean;
};

export function CaseStudyList({
  cases,
  lang,
}: {
  cases: CaseStudy[];
  lang: Lang;
}) {
  const t = getTranslations(lang);

  return (
    <ul className="grid gap-px overflow-hidden rounded-lg border border-border/60 bg-border/60">
      {cases.map((project, i) => (
        <li
          className="fade-up-item flex flex-col gap-2 bg-card px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
          key={project.title}
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base">{project.title}</h3>
              {project.caseStudy && (
                <Badge className="text-[11px]" variant="outline">
                  {t.projects.caseStudy}
                </Badge>
              )}
            </div>
            <p className="mt-1 text-muted-foreground text-sm leading-6">
              {project.summary}
            </p>
          </div>
          <div className="shrink-0">
            <StackList lang={lang} stack={project.stack} />
          </div>
        </li>
      ))}
    </ul>
  );
}
