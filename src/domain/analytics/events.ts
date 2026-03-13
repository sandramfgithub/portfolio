import type {
  EntryKind,
  Locale,
  PrivateEntryType,
  PublicationState,
} from '@/domain/portfolio/value-objects';

export type AnalyticsEventMap = {
  cv_download_failed: {
    lang: Locale;
    location: 'about' | 'cv-preview';
  };
  cv_download_started: {
    lang: Locale;
    location: 'about' | 'cv-preview';
  };
  cv_download_succeeded: {
    lang: Locale;
    location: 'about' | 'cv-preview';
  };
  cv_preview_viewed: {
    lang: Locale;
    location: 'cv-preview';
  };
  entry_detail_viewed: {
    entryKind: EntryKind;
    lang: Locale;
    slug: string;
  };
  entry_link_clicked: {
    entryKind: EntryKind;
    lang: Locale;
    linkKind: string;
    slug: string;
  };
  not_found_viewed: {
    lang: Locale;
    location: '404';
  };
  private_entry_clicked: {
    lang: Locale;
    location: 'projects';
    privateEntryType: PrivateEntryType;
    slug: string;
  };
  project_detail_clicked: {
    lang: Locale;
    location: 'projects';
    publicationState: PublicationState;
    slug: string;
  };
  project_repository_clicked: {
    lang: Locale;
    location: 'projects';
    publicationState: PublicationState;
    slug: string;
  };
  skill_detail_opened: {
    lang: Locale;
    location: 'about' | 'entry-detail' | 'projects';
    skillSlug: string;
  };
  social_link_clicked: {
    channel: 'github' | 'linkedin' | 'x';
    lang: Locale;
    location: 'cv-preview' | 'nav';
  };
};

export const analyticsEventNames = [
  'cv_download_failed',
  'cv_download_started',
  'cv_download_succeeded',
  'cv_preview_viewed',
  'entry_detail_viewed',
  'entry_link_clicked',
  'not_found_viewed',
  'private_entry_clicked',
  'project_detail_clicked',
  'project_repository_clicked',
  'skill_detail_opened',
  'social_link_clicked',
] as const;

export type AnalyticsEventName = keyof AnalyticsEventMap;

export type AnalyticsEventRecord<
  Name extends AnalyticsEventName = AnalyticsEventName,
> = {
  name: Name;
  payload: AnalyticsEventMap[Name];
};

export const isAnalyticsEventName = (
  value: string
): value is AnalyticsEventName => {
  return analyticsEventNames.includes(value as AnalyticsEventName);
};
