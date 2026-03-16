import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import type { ContentRepository } from '@/domain/portfolio/repository';
import type { Locale, PageSlug } from '@/domain/portfolio/value-objects';
import {
  mapAboutEntry,
  mapCvEntry,
  mapPageEntry,
  mapPolicyEntry,
  mapPortfolioEntry,
  mapSiteEntry,
  mapSkillEntry,
} from '@/infrastructure/content-local/mappers';

const buildRelatedEntryMap = async (locale: Locale) => {
  const entries = await getCollection(
    'entries',
    (entry: CollectionEntry<'entries'>) => {
      return entry.data.locale === locale;
    }
  );

  const relatedEntries = new Map<string, string[]>();

  for (const entry of entries) {
    for (const skillSlug of entry.data.stack) {
      const current = relatedEntries.get(skillSlug) ?? [];
      current.push(entry.data.slug);
      relatedEntries.set(skillSlug, current);
    }
  }

  return relatedEntries;
};

export class LocalContentRepository implements ContentRepository {
  async getAbout(locale: Locale) {
    const entries = await getCollection(
      'about',
      (entry: CollectionEntry<'about'>) => {
        return entry.data.locale === locale;
      }
    );

    const entry = entries[0];
    return entry ? mapAboutEntry(entry) : null;
  }

  async getSite(locale: Locale) {
    const entries = await getCollection(
      'site',
      (entry: CollectionEntry<'site'>) => {
        return entry.data.locale === locale;
      }
    );

    const entry = entries[0];
    return entry ? mapSiteEntry(entry) : null;
  }

  async getPage(locale: Locale, slug: PageSlug) {
    const entries = await getCollection(
      'pages',
      (entry: CollectionEntry<'pages'>) => {
        return entry.data.locale === locale && entry.data.slug === slug;
      }
    );

    const entry = entries[0];
    return entry ? mapPageEntry(entry) : null;
  }

  async getPolicy(locale: Locale, slug: 'privacy') {
    const entries = await getCollection(
      'policies',
      (entry: CollectionEntry<'policies'>) => {
        return entry.data.locale === locale && entry.data.slug === slug;
      }
    );

    const entry = entries[0];
    return entry ? mapPolicyEntry(entry) : null;
  }

  async listEntries(locale: Locale) {
    const entries = await getCollection(
      'entries',
      (entry: CollectionEntry<'entries'>) => {
        return entry.data.locale === locale;
      }
    );

    return entries.map(mapPortfolioEntry);
  }

  async getEntry(locale: Locale, slug: string) {
    const entries = await getCollection(
      'entries',
      (entry: CollectionEntry<'entries'>) => {
        return entry.data.locale === locale && entry.data.slug === slug;
      }
    );

    const entry = entries[0];
    return entry ? mapPortfolioEntry(entry) : null;
  }

  async listSkills(locale: Locale) {
    const [skills, relatedEntries] = await Promise.all([
      getCollection('skills', (entry: CollectionEntry<'skills'>) => {
        return entry.data.locale === locale;
      }),
      buildRelatedEntryMap(locale),
    ]);

    return skills.map((entry: CollectionEntry<'skills'>) => {
      return mapSkillEntry(entry, relatedEntries.get(entry.data.slug) ?? []);
    });
  }

  async getSkill(locale: Locale, slug: string) {
    const [skills, relatedEntries] = await Promise.all([
      getCollection('skills', (entry: CollectionEntry<'skills'>) => {
        return entry.data.locale === locale && entry.data.slug === slug;
      }),
      buildRelatedEntryMap(locale),
    ]);

    const entry = skills[0];
    return entry
      ? mapSkillEntry(entry, relatedEntries.get(entry.data.slug) ?? [])
      : null;
  }

  async getCv(locale: Locale) {
    const entries = await getCollection(
      'cv',
      (entry: CollectionEntry<'cv'>) => {
        return entry.data.locale === locale;
      }
    );

    const entry = entries[0];
    return entry ? mapCvEntry(entry) : null;
  }
}

export const localContentRepository = new LocalContentRepository();
