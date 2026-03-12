import type { Lang } from '@/i18n/translations';

export type SkillInfo = {
  lastUsed: string;
  version?: string;
  url: string;
  description: Record<Lang, string>;
};

export const skills: Record<string, SkillInfo> = {
  React: {
    lastUsed: '2025',
    version: '19',
    url: 'https://react.dev',
    description: {
      es: 'Componentes de producto, sistemas de tablas server-side, formularios con validacion y UI interactiva.',
      en: 'Product components, server-side table systems, validated forms, and interactive UI.',
    },
  },
  TypeScript: {
    lastUsed: '2025',
    version: '5.7',
    url: 'https://www.typescriptlang.org',
    description: {
      es: 'Lenguaje principal en todos los proyectos. Contratos estrictos, inferencia y tipos utilitarios.',
      en: 'Primary language across all projects. Strict contracts, inference, and utility types.',
    },
  },
  Astro: {
    lastUsed: '2025',
    version: '5',
    url: 'https://astro.build',
    description: {
      es: 'Framework del portfolio. Islas de hidratacion, transiciones de vista y contenido estatico.',
      en: 'Portfolio framework. Hydration islands, view transitions, and static content.',
    },
  },
  'Tailwind CSS': {
    lastUsed: '2025',
    version: '4',
    url: 'https://tailwindcss.com',
    description: {
      es: 'Estilos de utilidad en todos los frontends. Temas custom, dark mode y responsive.',
      en: 'Utility styles across all frontends. Custom themes, dark mode, and responsive.',
    },
  },
  'shadcn/ui': {
    lastUsed: '2025',
    url: 'https://ui.shadcn.com',
    description: {
      es: 'Componentes accesibles basados en Base UI, adaptados al sistema de diseno propio.',
      en: "Accessible components built on Base UI, adapted to the project's design system.",
    },
  },
  'TanStack Table': {
    lastUsed: '2025',
    version: '8',
    url: 'https://tanstack.com/table',
    description: {
      es: 'Tablas server-side con filtros, paginacion, ordenacion y vistas persistentes.',
      en: 'Server-side tables with filters, pagination, sorting, and persistent views.',
    },
  },
  Zustand: {
    lastUsed: '2025',
    version: '5',
    url: 'https://zustand.docs.pmnd.rs',
    description: {
      es: 'Estado global ligero para filtros, vistas y configuracion de tablas.',
      en: 'Lightweight global state for filters, views, and table configuration.',
    },
  },
  Vitest: {
    lastUsed: '2025',
    version: '3',
    url: 'https://vitest.dev',
    description: {
      es: 'Tests unitarios y de integracion. Runner rapido compatible con el ecosistema Vite.',
      en: 'Unit and integration tests. Fast runner compatible with the Vite ecosystem.',
    },
  },
  Bun: {
    lastUsed: '2025',
    url: 'https://bun.sh',
    description: {
      es: 'Runtime y package manager. Monorepo, scripts, workers y tooling interno.',
      en: 'Runtime and package manager. Monorepo, scripts, workers, and internal tooling.',
    },
  },
  PostgreSQL: {
    lastUsed: '2025',
    version: '16',
    url: 'https://www.postgresql.org',
    description: {
      es: 'Base de datos principal. Leasing, advisory locks, migraciones y busqueda.',
      en: 'Primary database. Leasing, advisory locks, migrations, and search.',
    },
  },
  'Drizzle ORM': {
    lastUsed: '2025',
    url: 'https://orm.drizzle.team',
    description: {
      es: 'ORM type-safe para PostgreSQL. Esquemas declarativos y migraciones.',
      en: 'Type-safe ORM for PostgreSQL. Declarative schemas and migrations.',
    },
  },
  OpenTelemetry: {
    lastUsed: '2025',
    url: 'https://opentelemetry.io',
    description: {
      es: 'Trazas y metricas para observabilidad de workers y servicios.',
      en: 'Traces and metrics for worker and service observability.',
    },
  },
  tRPC: {
    lastUsed: '2025',
    version: '11',
    url: 'https://trpc.io',
    description: {
      es: 'Contratos API end-to-end type-safe entre cliente y servidor.',
      en: 'End-to-end type-safe API contracts between client and server.',
    },
  },
  Elasticsearch: {
    lastUsed: '2025',
    url: 'https://www.elastic.co/elasticsearch',
    description: {
      es: 'Motor de busqueda para indexacion y queries complejas sobre datos de producto.',
      en: 'Search engine for indexing and complex queries on product data.',
    },
  },
  Capacitor: {
    lastUsed: '2024',
    url: 'https://capacitorjs.com',
    description: {
      es: 'Apps hibridas moviles con acceso a APIs nativas y sync offline.',
      en: 'Hybrid mobile apps with native API access and offline sync.',
    },
  },
  Nest: {
    lastUsed: '2024',
    url: 'https://nestjs.com',
    description: {
      es: 'Framework backend con inyeccion de dependencias, modulos y guards.',
      en: 'Backend framework with dependency injection, modules, and guards.',
    },
  },
  GraphQL: {
    lastUsed: '2024',
    url: 'https://graphql.org',
    description: {
      es: 'APIs con schema tipado, resolvers y subscriptions en tiempo real.',
      en: 'APIs with typed schema, resolvers, and real-time subscriptions.',
    },
  },
  REST: {
    lastUsed: '2024',
    url: 'https://restfulapi.net',
    description: {
      es: 'APIs HTTP convencionales con contratos OpenAPI.',
      en: 'Conventional HTTP APIs with OpenAPI contracts.',
    },
  },
  Vue: {
    lastUsed: '2023',
    version: '3',
    url: 'https://vuejs.org',
    description: {
      es: 'Frontends de gestion con Composition API y formularios reactivos.',
      en: 'Management frontends with Composition API and reactive forms.',
    },
  },
  C: {
    lastUsed: '2022',
    url: 'https://en.cppreference.com/w/c',
    description: {
      es: 'Compilador propio con analisis lexico, sintactico y optimizacion de codigo.',
      en: 'Custom compiler with lexical analysis, parsing, and code optimization.',
    },
  },
  Java: {
    lastUsed: '2022',
    url: 'https://dev.java',
    description: {
      es: 'Apps modulares con sistema de plugins, gRPC y disciplina de release.',
      en: 'Modular apps with plugin system, gRPC, and release discipline.',
    },
  },
  gRPC: {
    lastUsed: '2022',
    url: 'https://grpc.io',
    description: {
      es: 'Comunicacion entre servicios con protobuf y streaming bidireccional.',
      en: 'Service communication with protobuf and bidirectional streaming.',
    },
  },
  Vite: {
    lastUsed: '2025',
    version: '6',
    url: 'https://vite.dev',
    description: {
      es: 'Bundler para desarrollo rapido con HMR y builds optimizados.',
      en: 'Bundler for fast development with HMR and optimized builds.',
    },
  },
  Docker: {
    lastUsed: '2025',
    url: 'https://www.docker.com',
    description: {
      es: 'Contenedores para desarrollo local, CI y despliegue de servicios.',
      en: 'Containers for local development, CI, and service deployment.',
    },
  },
  GitHub: {
    lastUsed: '2025',
    url: 'https://github.com',
    description: {
      es: 'Repositorios, CI/CD con Actions, revisiones de codigo y gestion de releases.',
      en: 'Repositories, CI/CD with Actions, code reviews, and release management.',
    },
  },
  Codex: {
    lastUsed: '2025',
    url: 'https://openai.com/index/codex',
    description: {
      es: 'Asistente de codigo para generacion, refactor y exploracion de APIs.',
      en: 'Code assistant for generation, refactoring, and API exploration.',
    },
  },
  Claude: {
    lastUsed: '2025',
    url: 'https://claude.ai',
    description: {
      es: 'Asistente AI para desarrollo, arquitectura y documentacion tecnica.',
      en: 'AI assistant for development, architecture, and technical documentation.',
    },
  },
};
