import type { Lang } from '@/i18n/translations';

// ---------- Types ----------

export type CvProfile = {
  name: string;
  role: string;
  location: string;
  web: string;
  summary: string;
};

export type Experience = {
  role: string;
  company: string;
  period: string;
  summary: string;
  achievements: string[];
  stack: string[];
};

export type Language = {
  name: string;
  level: string;
};

// ---------- Bilingual data ----------

export const cvData: Record<
  Lang,
  {
    profile: CvProfile;
    experience: Experience[];
    languages: Language[];
    skills: string[];
  }
> = {
  es: {
    profile: {
      name: 'Sandra Martínez Fernández',
      role: 'Desarrolladora de Software',
      location: 'España',
      web: 'sandramf.dev',
      summary:
        'Desarrolladora con experiencia en frontends de producto, tooling interno y servicios backend. Enfoque en contratos explícitos, estructura de repositorio mantenible y operación observable.',
    },
    experience: [
      {
        role: 'Desarrolladora de Software',
        company: 'Empresa Actual',
        period: '2022 – Presente',
        summary:
          'Desarrollo de frontends de producto, tooling interno y servicios backend con foco en contratos, estructura de repositorio y operación.',
        achievements: [
          'Desarrollo de monorepo con Bun, workers con leasing, contratos API y búsqueda',
          'Extracción de sistema de tablas server-side reutilizable con React y TanStack Table',
          'Implementación de runtime con leasing sobre PostgreSQL para polling y heartbeats',
        ],
        stack: [
          'React',
          'TypeScript',
          'Bun',
          'PostgreSQL',
          'tRPC',
          'Tailwind CSS',
        ],
      },
    ],
    languages: [
      { name: 'Español', level: 'Nativo' },
      { name: 'Inglés', level: 'Profesional' },
    ],
    skills: [
      'React',
      'TypeScript',
      'Bun',
      'PostgreSQL',
      'tRPC',
      'Tailwind CSS',
      'Drizzle ORM',
      'Vitest',
      'Vite',
      'OpenTelemetry',
      'Docker',
      'GitHub',
      'Codex',
      'Claude',
    ],
  },
  en: {
    profile: {
      name: 'Sandra Martínez Fernández',
      role: 'Software Developer',
      location: 'Spain',
      web: 'sandramf.dev',
      summary:
        'Developer with experience in product frontends, internal tooling, and backend services. Focus on explicit contracts, maintainable repository structure, and observable operations.',
    },
    experience: [
      {
        role: 'Software Developer',
        company: 'Current Company',
        period: '2022 – Present',
        summary:
          'Product frontend development, internal tooling, and backend services focused on contracts, repository structure, and operations.',
        achievements: [
          'Monorepo development with Bun, lease-based workers, API contracts, and search',
          'Extraction of reusable server-side table system with React and TanStack Table',
          'PostgreSQL-based leasing runtime implementation for polling and heartbeats',
        ],
        stack: [
          'React',
          'TypeScript',
          'Bun',
          'PostgreSQL',
          'tRPC',
          'Tailwind CSS',
        ],
      },
    ],
    languages: [
      { name: 'Spanish', level: 'Native' },
      { name: 'English', level: 'Professional' },
    ],
    skills: [
      'React',
      'TypeScript',
      'Bun',
      'PostgreSQL',
      'tRPC',
      'Tailwind CSS',
      'Drizzle ORM',
      'Vitest',
      'Vite',
      'OpenTelemetry',
      'Docker',
      'GitHub',
      'Codex',
      'Claude',
    ],
  },
};
