import type { ProjectCardViewModel } from '@/application/portfolio/dto';
import { ProjectCard } from '@/components/project-card';
import type { Lang } from '@/i18n/translations';

export function ProjectGrid({
  projects,
  lang,
}: {
  projects: readonly ProjectCardViewModel[];
  lang: Lang;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {projects.map((project, i) => (
        <ProjectCard
          key={project.slug}
          {...project}
          lang={lang}
          style={{ animationDelay: `${i * 40}ms` }}
        />
      ))}
    </div>
  );
}
