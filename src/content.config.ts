import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

const localeSchema = z.enum(['es', 'en']);
const seoSchema = z.object({
  title: z.string(),
  description: z.string(),
});
const navigationItemSchema = z.object({
  href: z.string(),
  label: z.string(),
});
const socialLinkSchema = z.object({
  href: z.string(),
  label: z.string(),
  icon: z.enum(['twitter', 'github', 'linkedin', 'mail']),
});
const linkSchema = z.object({
  label: z.string(),
  href: z.url(),
  kind: z.enum(['repository', 'external', 'case-study']),
});
const experienceSchema = z.object({
  role: z.string(),
  company: z.string(),
  period: z.string(),
  summary: z.string(),
  achievements: z.array(z.string()),
  stack: z.array(z.string()),
});
const languageSchema = z.object({
  name: z.string(),
  level: z.string(),
});
const educationSchema = z.object({
  title: z.string(),
  institution: z.string(),
  period: z.string(),
  summary: z.string().optional(),
});
const certificationSchema = z.object({
  name: z.string(),
  issuer: z.string(),
  issuedAt: z.string().optional(),
  url: z.url().optional(),
});
const aboutInlineTextSchema = z.object({
  type: z.literal('text'),
  value: z.string(),
});
const aboutInlineStrongSchema = z.object({
  type: z.literal('strong'),
  value: z.string(),
});
const aboutInlinePopoverSchema = z.object({
  type: z.literal('popover'),
  key: z.enum(['age', 'films', 'realityShows', 'music', 'games', 'drawing']),
  trigger: z.string().optional(),
});
const aboutParagraphSchema = z.object({
  nodes: z.array(
    z.union([
      aboutInlineTextSchema,
      aboutInlineStrongSchema,
      aboutInlinePopoverSchema,
    ])
  ),
});
const aboutListPopoverSchema = z.object({
  kind: z.literal('list'),
  title: z.string(),
  intro: z.string().optional(),
  items: z.array(z.string()),
});
const aboutAgePopoverSchema = z.object({
  kind: z.literal('age'),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD birth date'),
  birthdayText: z.string(),
  defaultText: z.string(),
});
const aboutMediaPopoverSchema = z.object({
  kind: z.literal('media'),
  title: z.string(),
  body: z.array(z.string()),
  image: z
    .object({
      alt: z.string(),
      caption: z.string().optional(),
      height: z.number().int().positive(),
      src: z.string(),
      width: z.number().int().positive(),
    })
    .nullable(),
});
const aboutExperienceSchema = z.object({
  role: z.string(),
  company: z.string(),
  period: z.string(),
  summary: z.string(),
  achievements: z.array(z.string()),
  skillSlugs: z.array(z.string()),
});

const site = defineCollection({
  loader: file('src/content/data/site.json'),
  schema: z.object({
    locale: localeSchema,
    navigation: z.array(navigationItemSchema),
    socialLinks: z.array(socialLinkSchema),
  }),
});

const pages = defineCollection({
  loader: file('src/content/data/pages.json'),
  schema: z.object({
    slug: z.enum(['home', 'projects']),
    locale: localeSchema,
    title: z.string(),
    introParagraphs: z.array(z.string()),
    seo: seoSchema,
  }),
});

const about = defineCollection({
  loader: file('src/content/data/about.json'),
  schema: z.object({
    locale: localeSchema,
    title: z.string(),
    hero: z.object({
      location: z.string(),
      name: z.string(),
      roleChip: z.string(),
      roleTitle: z.string(),
    }),
    professional: z.array(aboutParagraphSchema),
    personal: z.array(aboutParagraphSchema),
    popovers: z.object({
      age: aboutAgePopoverSchema,
      drawing: aboutMediaPopoverSchema,
      films: aboutListPopoverSchema,
      games: aboutListPopoverSchema,
      music: aboutListPopoverSchema,
      realityShows: aboutListPopoverSchema,
    }),
    experience: z.array(aboutExperienceSchema),
    skillSlugs: z.array(z.string()),
    seo: seoSchema,
  }),
});

const entries = defineCollection({
  loader: file('src/content/data/entries.json'),
  schema: z.object({
    slug: z.string(),
    locale: localeSchema,
    kind: z.enum(['public-project', 'case-study']),
    privateEntryType: z.enum(['work', 'case-study']).nullable(),
    publicationState: z.enum(['draft', 'published', 'coming-soon']),
    sortDate: z.string(),
    title: z.string(),
    summary: z.string(),
    paragraphs: z.array(z.string()),
    bullets: z.array(z.string()),
    stack: z.array(z.string()),
    links: z.array(linkSchema),
    featured: z.boolean(),
    organization: z.string().nullable(),
    period: z.string().nullable(),
    seo: seoSchema,
  }),
});

const skills = defineCollection({
  loader: file('src/content/data/skills.json'),
  schema: z.object({
    slug: z.string(),
    locale: localeSchema,
    name: z.string(),
    status: z.enum(['active', 'recent', 'legacy', 'learning']),
    active: z.boolean(),
    lastUsedAt: z.string(),
    lastVersion: z.string().nullable(),
    url: z.url(),
    summary: z.string(),
    details: z.array(z.string()),
    seo: seoSchema,
  }),
});

const cv = defineCollection({
  loader: file('src/content/data/cv.json'),
  schema: z.object({
    locale: localeSchema,
    profile: z.object({
      name: z.string(),
      role: z.string(),
      location: z.string(),
      web: z.string(),
      summary: z.string(),
      photo: z.string().nullable(),
    }),
    contacts: z.object({
      github: z.url().nullable(),
      linkedin: z.url().nullable(),
      email: z.email().nullable(),
    }),
    experience: z.array(experienceSchema),
    education: z.array(educationSchema),
    languages: z.array(languageSchema),
    certifications: z.array(certificationSchema),
    skillSlugs: z.array(z.string()),
  }),
});

export const collections = { site, pages, about, entries, skills, cv };
