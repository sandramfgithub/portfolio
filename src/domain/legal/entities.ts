import type { Locale } from '@/domain/portfolio/value-objects';

export type PolicySeoMetadata = {
  description: string;
  title: string;
};

export type PolicyLink = {
  href: string;
  label: string;
};

export type PolicySection = {
  bullets?: readonly string[];
  id:
    | 'collected'
    | 'contact'
    | 'legal-basis'
    | 'not-collected'
    | 'opt-out'
    | 'provider';
  paragraphs: readonly string[];
  title: string;
};

export type PolicyDocument = {
  contactEmail: string;
  controllerName: string;
  id: string;
  locale: Locale;
  providerLinks: readonly PolicyLink[];
  providerName: string;
  providerUrl: string;
  retention: string;
  sections: readonly PolicySection[];
  seo: PolicySeoMetadata;
  slug: 'privacy';
  summary: string;
  title: string;
};
