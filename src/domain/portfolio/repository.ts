import type { PolicyDocument } from '@/domain/legal/entities';
import type {
  AboutDocument,
  CvDocument,
  PageContent,
  PortfolioEntry,
  SiteContent,
  Skill,
} from '@/domain/portfolio/entities';
import type { Locale, PageSlug } from '@/domain/portfolio/value-objects';

export interface ContentRepository {
  getAbout(locale: Locale): Promise<AboutDocument | null>;
  getCv(locale: Locale): Promise<CvDocument | null>;
  getEntry(locale: Locale, slug: string): Promise<PortfolioEntry | null>;
  getPage(locale: Locale, slug: PageSlug): Promise<PageContent | null>;
  getPolicy(locale: Locale, slug: 'privacy'): Promise<PolicyDocument | null>;
  getSite(locale: Locale): Promise<SiteContent | null>;
  getSkill(locale: Locale, slug: string): Promise<Skill | null>;
  listEntries(locale: Locale): Promise<readonly PortfolioEntry[]>;
  listSkills(locale: Locale): Promise<readonly Skill[]>;
}
