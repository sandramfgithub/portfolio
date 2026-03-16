import type { CollectionEntry } from 'astro:content';
import type { PolicyDocument } from '@/domain/legal/entities';
import type {
  AboutDocument,
  CvDocument,
  PageContent,
  PortfolioEntry,
  SiteContent,
  Skill,
} from '@/domain/portfolio/entities';

export const mapSiteEntry = (entry: CollectionEntry<'site'>): SiteContent => {
  return {
    id: entry.id,
    locale: entry.data.locale,
    navigation: entry.data.navigation,
    socialLinks: entry.data.socialLinks,
  };
};

export const mapPageEntry = (entry: CollectionEntry<'pages'>): PageContent => {
  return {
    id: entry.id,
    slug: entry.data.slug,
    locale: entry.data.locale,
    title: entry.data.title,
    introParagraphs: entry.data.introParagraphs,
    seo: entry.data.seo,
  };
};

export const mapAboutEntry = (
  entry: CollectionEntry<'about'>
): AboutDocument => {
  return {
    id: entry.id,
    locale: entry.data.locale,
    title: entry.data.title,
    hero: entry.data.hero,
    professional: entry.data.professional,
    personal: entry.data.personal,
    popovers: entry.data.popovers,
    experience: entry.data.experience,
    skillSlugs: entry.data.skillSlugs,
    seo: entry.data.seo,
  };
};

export const mapPortfolioEntry = (
  entry: CollectionEntry<'entries'>
): PortfolioEntry => {
  return {
    id: entry.id,
    slug: entry.data.slug,
    locale: entry.data.locale,
    kind: entry.data.kind,
    privateEntryType: entry.data.privateEntryType,
    publicationState: entry.data.publicationState,
    sortDate: entry.data.sortDate,
    title: entry.data.title,
    summary: entry.data.summary,
    paragraphs: entry.data.paragraphs,
    bullets: entry.data.bullets,
    stack: entry.data.stack,
    links: entry.data.links,
    featured: entry.data.featured,
    organization: entry.data.organization,
    period: entry.data.period,
    seo: entry.data.seo,
  };
};

export const mapSkillEntry = (
  entry: CollectionEntry<'skills'>,
  relatedEntrySlugs: readonly string[]
): Skill => {
  return {
    id: entry.id,
    slug: entry.data.slug,
    locale: entry.data.locale,
    name: entry.data.name,
    status: entry.data.status,
    active: entry.data.active,
    lastUsedAt: entry.data.lastUsedAt,
    lastVersion: entry.data.lastVersion,
    url: entry.data.url,
    summary: entry.data.summary,
    details: entry.data.details,
    relatedEntrySlugs,
    seo: entry.data.seo,
  };
};

export const mapCvEntry = (entry: CollectionEntry<'cv'>): CvDocument => {
  return {
    id: entry.id,
    locale: entry.data.locale,
    profile: entry.data.profile,
    contacts: entry.data.contacts,
    experience: entry.data.experience,
    education: entry.data.education,
    languages: entry.data.languages,
    certifications: entry.data.certifications,
    skillSlugs: entry.data.skillSlugs,
  };
};

export const mapPolicyEntry = (
  entry: CollectionEntry<'policies'>
): PolicyDocument => {
  return {
    id: entry.id,
    slug: entry.data.slug,
    locale: entry.data.locale,
    title: entry.data.title,
    summary: entry.data.summary,
    controllerName: entry.data.controllerName,
    contactEmail: entry.data.contactEmail,
    providerName: entry.data.providerName,
    providerUrl: entry.data.providerUrl,
    retention: entry.data.retention,
    sections: entry.data.sections,
    seo: entry.data.seo,
  };
};
