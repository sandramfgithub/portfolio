import { describe, expect, it, vi } from 'vitest';
import { createAnalyticsAttributes } from '@/application/analytics/attributes';
import { trackAnalyticsEvent } from '@/application/analytics/track';
import { isAnalyticsEventName } from '@/domain/analytics/events';

describe('analytics helpers', () => {
  it('creates delegated analytics attributes for click events', () => {
    const attributes = createAnalyticsAttributes('project_detail_clicked', {
      lang: 'en',
      location: 'projects',
      publicationState: 'published',
      slug: 'portfolio',
    });

    expect(attributes['data-analytics-event']).toBe('project_detail_clicked');
    expect(attributes['data-analytics-payload']).toContain(
      '"slug":"portfolio"'
    );
  });

  it('creates delegated analytics attributes for view events', () => {
    const attributes = createAnalyticsAttributes(
      'not_found_viewed',
      {
        lang: 'en',
        location: '404',
      },
      { trigger: 'view' }
    );

    expect(attributes['data-analytics-trigger']).toBe('view');
  });

  it('guards event names at runtime', () => {
    expect(isAnalyticsEventName('cv_download_started')).toBe(true);
    expect(isAnalyticsEventName('unknown_event')).toBe(false);
  });

  it('dispatches typed events through the analytics gateway', () => {
    const track = vi.fn();

    trackAnalyticsEvent({ track }, 'theme_toggle_clicked', {
      lang: 'es',
      location: 'nav',
      nextTheme: 'light',
    });

    expect(track).toHaveBeenCalledWith({
      name: 'theme_toggle_clicked',
      payload: {
        lang: 'es',
        location: 'nav',
        nextTheme: 'light',
      },
    });
  });
});
