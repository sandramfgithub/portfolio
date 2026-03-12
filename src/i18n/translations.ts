export const translations = {
  es: {
    nav: {
      home: 'Inicio',
      projects: 'Proyectos',
      about: 'Sobre mí',
    },
    hero: {
      badge: 'Portfolio',
      heading: 'Proyectos y librerías.',
      intro:
        'Desarrolladora fullstack. Producto, tooling interno y servicios con TypeScript.',
      cta: 'Ver proyectos',
      ctaSecondary: 'Sobre mí',
    },
    projects: {
      intro:
        'Aqui estan los proyectos publicos y, debajo, trabajos privados de contexto tecnico. Si tienes curiosidad, pulsa en una skill para mas detalle.',
      publicHeading: 'Proyectos públicos',
      caseStudiesHeading: 'Trabajos privados',
      caseStudy: 'Caso de estudio',
    },
    about: {
      downloadCv: 'Descargar CV',
      downloading: 'Generando…',
      downloaded: 'Descargado',
      downloadError: 'No se pudo generar el PDF. Inténtalo de nuevo.',
      experience: 'Experiencia',
      skills: 'Habilidades',
    },
    common: {
      skipToContent: 'Saltar al contenido',
      backToHome: 'Volver al inicio',
      switchToLight: 'Cambiar a modo claro',
      switchToDark: 'Cambiar a modo oscuro',
      switchLang: 'Cambiar a inglés',
    },
    footer: {
      madeWith: 'Hecho con',
      tools: 'en Astro, con Claude y Codex',
    },
    terminal: {
      title: 'sandra@portfolio',
      loading: 'Cargando portfolio...',
      envReady: 'Entorno listo',
      projectsLoaded: 'Proyectos cargados',
      expVerified: 'Experiencia verificada',
      menuHint: 'Usa las flechas para navegar, enter para seleccionar',
    },
    notFound: {
      code: '404',
      heading: 'Página no encontrada.',
      description: 'La dirección no existe o ha cambiado.',
      cta: 'Volver al inicio',
    },
  },
  en: {
    nav: {
      home: 'Home',
      projects: 'Projects',
      about: 'About',
    },
    hero: {
      badge: 'Portfolio',
      heading: 'Projects & libraries.',
      intro:
        'Fullstack developer. Product, internal tooling, and services with TypeScript.',
      cta: 'View projects',
      ctaSecondary: 'About me',
    },
    projects: {
      intro:
        "Here are the public projects and, below, private work for technical context. If you're curious, click a skill for more detail.",
      publicHeading: 'Public projects',
      caseStudiesHeading: 'Private work',
      caseStudy: 'Case study',
    },
    about: {
      downloadCv: 'Download CV',
      downloading: 'Generating…',
      downloaded: 'Downloaded',
      downloadError: 'Could not generate PDF. Please try again.',
      experience: 'Experience',
      skills: 'Skills',
    },
    common: {
      skipToContent: 'Skip to content',
      backToHome: 'Back to home',
      switchToLight: 'Switch to light mode',
      switchToDark: 'Switch to dark mode',
      switchLang: 'Switch to Spanish',
    },
    footer: {
      madeWith: 'Made with',
      tools: 'in Astro, with Claude & Codex',
    },
    terminal: {
      title: 'sandra@portfolio',
      loading: 'Loading portfolio...',
      envReady: 'Environment ready',
      projectsLoaded: 'Projects loaded',
      expVerified: 'Experience verified',
      menuHint: 'Use arrow keys to navigate, enter to select',
    },
    notFound: {
      code: '404',
      heading: 'Page not found.',
      description: 'The address does not exist or has changed.',
      cta: 'Back to home',
    },
  },
} as const;

export type Lang = keyof typeof translations;
export type TranslationKeys = (typeof translations)['es'];
