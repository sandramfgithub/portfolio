import { createAnalyticsAttributes } from '@/application/analytics/attributes';
import type { PrivateEntryViewModel } from '@/application/portfolio/dto';
import { SkillBadge } from '@/components/portfolio/skills/skill-badge';
import { Badge } from '@/components/ui/badge';
import type { Lang } from '@/i18n/translations';
import { getTranslations } from '@/i18n/utils';

type Props = {
  entries: readonly PrivateEntryViewModel[];
  lang: Lang;
};

export function PrivateEntryListIsland({ entries, lang }: Props) {
  const t = getTranslations(lang);

  return (
    <ul className="grid gap-px overflow-hidden rounded-lg border border-border/60 bg-border/60">
      {entries.map((project, index) => (
        <li
          className="fade-up-item flex flex-col gap-2 bg-card px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
          key={project.slug}
          style={{ animationDelay: `${index * 40}ms` }}
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base">
                <a
                  {...createAnalyticsAttributes('private_entry_clicked', {
                    lang,
                    location: 'projects',
                    privateEntryType: project.privateEntryType,
                    slug: project.slug,
                  })}
                  className="transition-colors hover:text-muted-foreground"
                  href={project.href}
                >
                  {project.title}
                </a>
              </h3>
              {project.privateEntryType === 'work' && (
                <Badge className="text-[11px]" variant="outline">
                  {t.projects.work}
                </Badge>
              )}
              {project.privateEntryType === 'case-study' && (
                <Badge className="text-[11px]" variant="outline">
                  {t.projects.caseStudy}
                </Badge>
              )}
            </div>
            <p className="mt-1 text-muted-foreground text-sm leading-6">
              {project.summary}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-1.5">
            {project.skills.map((skill) => (
              <SkillBadge
                key={skill.slug}
                lang={lang}
                location="projects"
                skill={skill}
              />
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}
