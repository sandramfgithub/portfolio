import { ProjectCard } from '@/components/project-card';
import type { Lang } from '@/i18n/translations';

type Project = {
  title: string;
  summary: string;
  stack: string[];
  github: string;
};

export function ProjectGrid({
  projects,
  lang,
}: {
  projects: Project[];
  lang: Lang;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {projects.map((project, i) => (
        <ProjectCard
          key={project.title}
          {...project}
          lang={lang}
          style={{ animationDelay: `${i * 40}ms` }}
        />
      ))}
    </div>
  );
}
