import { createAnalyticsAttributes } from '@/application/analytics/attributes';
import type { ProjectCardViewModel } from '@/application/portfolio/dto';
import { SkillBadge } from '@/components/portfolio/skills/skill-badge';
import { Badge } from '@/components/ui/badge';
import type { Lang } from '@/i18n/translations';
import { getTranslations } from '@/i18n/utils';

type Props = {
  lang: Lang;
  projects: readonly ProjectCardViewModel[];
};

export function ProjectGridIsland({ lang, projects }: Props) {
  const t = getTranslations(lang);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {projects.map((project, index) => {
        const isComingSoon = project.publicationState === 'coming-soon';

        return (
          <div
            className={[
              'group fade-up-item flex flex-col gap-3 rounded-lg border border-border/60 bg-card p-4',
              isComingSoon ? '' : 'card-lift',
              isComingSoon ? 'opacity-85' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            key={project.slug}
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isComingSoon && (
                  <Badge className="text-[11px]" variant="outline">
                    {t.projects.comingSoon}
                  </Badge>
                )}
                <h3 className="font-semibold text-base">
                  {project.href ? (
                    <a
                      {...createAnalyticsAttributes('project_detail_clicked', {
                        lang,
                        location: 'projects',
                        publicationState: project.publicationState,
                        slug: project.slug,
                      })}
                      className="transition-colors hover:text-muted-foreground"
                      href={project.href}
                    >
                      {project.title}
                    </a>
                  ) : (
                    <span>{project.title}</span>
                  )}
                </h3>
              </div>
              {project.github && (
                <a
                  {...createAnalyticsAttributes('project_repository_clicked', {
                    lang,
                    location: 'projects',
                    publicationState: project.publicationState,
                    slug: project.slug,
                  })}
                  className="text-muted-foreground text-sm underline transition-colors hover:text-foreground group-hover:text-foreground"
                  href={project.github}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  GitHub
                </a>
              )}
            </div>
            <p
              className={[
                'text-muted-foreground text-sm leading-6',
                isComingSoon
                  ? 'pointer-events-none select-none blur-[3px]'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {project.summary}
            </p>
            <div
              className={[
                'mt-auto flex flex-wrap gap-1.5',
                isComingSoon
                  ? 'pointer-events-none select-none blur-[3px]'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {project.skills.map((skill) => (
                <SkillBadge
                  key={skill.slug}
                  lang={lang}
                  location="projects"
                  skill={skill}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
