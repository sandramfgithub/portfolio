import type { Lang } from '@/i18n/translations';

export const navigation: Record<Lang, { href: string; label: string }[]> = {
  es: [
    { href: '/', label: 'Inicio' },
    { href: '/projects', label: 'Proyectos' },
    { href: '/about', label: 'Sobre mí' },
  ],
  en: [
    { href: '/en', label: 'Home' },
    { href: '/en/projects', label: 'Projects' },
    { href: '/en/about', label: 'About' },
  ],
};

export const socialLinks = [
  {
    href: 'https://x.com/sandramfgithub',
    label: 'X',
    icon: 'twitter' as const,
  },
  {
    href: 'https://github.com/sandramfgithub',
    label: 'GitHub',
    icon: 'github' as const,
  },
  {
    href: 'https://www.linkedin.com/in/sandramfdeveloper',
    label: 'LinkedIn',
    icon: 'linkedin' as const,
  },
  {
    href: 'mailto:sandramfgithub@gmail.com',
    label: 'Email',
    icon: 'mail' as const,
  },
] as const;

export const publicProjects: Record<
  Lang,
  {
    title: string;
    summary: string;
    stack: string[];
    github: string;
  }[]
> = {
  es: [
    {
      title: 'portfolio',
      summary:
        'Sitio en Astro para ordenar repos, librerías y documentación pública.',
      stack: ['Astro', 'React', 'Tailwind CSS', 'shadcn/ui'],
      github: 'https://github.com/sandramfgithub/portfolio',
    },
    {
      title: 'react-table-system',
      summary:
        'Extracción de un sistema de tablas server-side con filtros, persistencia, vistas y contratos reutilizables.',
      stack: ['React', 'TanStack Table', 'Zustand', 'Vitest'],
      github: 'https://github.com/sandramfgithub/react-table-system',
    },
    {
      title: 'pg-lease-runtime',
      summary:
        'Librería pequeña para workers con leasing sobre PostgreSQL, pensada para polling, heartbeats y cierre limpio.',
      stack: ['Bun', 'PostgreSQL', 'Drizzle ORM', 'OpenTelemetry'],
      github: 'https://github.com/sandramfgithub/pg-lease-runtime',
    },
    {
      title: 'project-radar',
      summary:
        'POC para relacionar señales externas con proyectos propios y convertir novedades en backlog revisable.',
      stack: ['Bun', 'tRPC', 'Elasticsearch', 'PostgreSQL'],
      github: 'https://github.com/sandramfgithub/project-radar',
    },
  ],
  en: [
    {
      title: 'portfolio',
      summary:
        'Astro site to organize repos, libraries, and public documentation.',
      stack: ['Astro', 'React', 'Tailwind CSS', 'shadcn/ui'],
      github: 'https://github.com/sandramfgithub/portfolio',
    },
    {
      title: 'react-table-system',
      summary:
        'Extraction of a server-side table system with filters, persistence, views, and reusable contracts.',
      stack: ['React', 'TanStack Table', 'Zustand', 'Vitest'],
      github: 'https://github.com/sandramfgithub/react-table-system',
    },
    {
      title: 'pg-lease-runtime',
      summary:
        'Small library for PostgreSQL-based worker leasing, designed for polling, heartbeats, and clean shutdown.',
      stack: ['Bun', 'PostgreSQL', 'Drizzle ORM', 'OpenTelemetry'],
      github: 'https://github.com/sandramfgithub/pg-lease-runtime',
    },
    {
      title: 'project-radar',
      summary:
        'POC to match external signals with own projects and turn news into a reviewable backlog.',
      stack: ['Bun', 'tRPC', 'Elasticsearch', 'PostgreSQL'],
      github: 'https://github.com/sandramfgithub/project-radar',
    },
  ],
};

export const caseStudies: Record<
  Lang,
  {
    title: string;
    summary: string;
    stack: string[];
    caseStudy?: boolean;
  }[]
> = {
  es: [
    {
      title: 'pim',
      summary:
        'Monorepo real con Bun, workers con leasing, contratos API, búsqueda y una base fuerte de tooling interno.',
      stack: ['Bun', 'React', 'tRPC', 'PostgreSQL'],
    },
    {
      title: 'Picking App',
      summary:
        'Aplicación móvil de picking para almacén con lectura de códigos y sincronización offline.',
      stack: ['Capacitor', 'Nest', 'GraphQL'],
    },
    {
      title: 'Pedidos Comerciales',
      summary:
        'Sistema de gestión de pedidos comerciales con flujos de aprobación y reporting.',
      stack: ['Nest', 'REST', 'Vue'],
    },
    {
      title: 'Gestión de Aparatología',
      summary:
        'Plataforma de gestión de equipamiento con inventario, mantenimiento y reservas.',
      stack: ['Nest', 'GraphQL', 'React'],
    },
    {
      title: 'mini-c',
      summary:
        'Compilador en C con análisis léxico y sintáctico, tabla hash, warnings y optimización de código.',
      stack: ['C'],
      caseStudy: true,
    },
    {
      title: 'chat-app',
      summary:
        'Aplicación desktop con gRPC, persistencia propia y componentes custom, útil como antecedente de producto end-to-end.',
      stack: ['Java', 'gRPC'],
      caseStudy: true,
    },
    {
      title: 'courses-app',
      summary:
        'Aplicación modular en Java con sistema de plugins, CI y una disciplina de release mejor de lo habitual en un proyecto académico.',
      stack: ['Java'],
      caseStudy: true,
    },
  ],
  en: [
    {
      title: 'pim',
      summary:
        'Real-world monorepo with Bun, lease-based workers, API contracts, search, and strong internal tooling.',
      stack: ['Bun', 'React', 'tRPC', 'PostgreSQL'],
    },
    {
      title: 'Picking App',
      summary:
        'Mobile warehouse picking app with barcode scanning and offline sync.',
      stack: ['Capacitor', 'Nest', 'GraphQL'],
    },
    {
      title: 'Pedidos Comerciales',
      summary:
        'Commercial order management system with approval workflows and reporting.',
      stack: ['Nest', 'REST', 'Vue'],
    },
    {
      title: 'Gestión de Aparatología',
      summary:
        'Equipment management platform with inventory, maintenance, and reservations.',
      stack: ['Nest', 'GraphQL', 'React'],
    },
    {
      title: 'mini-c',
      summary:
        'C compiler with lexical/syntactic analysis, hash tables, warnings, and code optimization.',
      stack: ['C'],
      caseStudy: true,
    },
    {
      title: 'chat-app',
      summary:
        'Desktop app with gRPC, custom persistence, and UI components -- an end-to-end product antecedent.',
      stack: ['Java', 'gRPC'],
      caseStudy: true,
    },
    {
      title: 'courses-app',
      summary:
        'Modular Java app with plugin system, CI, and unusually disciplined release process for an academic project.',
      stack: ['Java'],
      caseStudy: true,
    },
  ],
};

export const aboutProfile: Record<Lang, { paragraphs: string[] }> = {
  es: {
    paragraphs: [
      'Trabajo sobre todo en frontends de producto, tooling interno y servicios donde la estructura del repositorio, los contratos y la operacion importan tanto como la funcionalidad.',
      'Aqui agrupo proyectos en curso, librerias que quiero extraer y algunos trabajos anteriores que sirven de contexto tecnico.',
    ],
  },
  en: {
    paragraphs: [
      'I mostly work on product frontends, internal tooling, and services where repository structure, contracts, and operations matter as much as functionality.',
      'Here I group ongoing projects, libraries I want to extract, and some previous work that provides technical context.',
    ],
  },
};
