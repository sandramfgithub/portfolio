import { trackAnalyticsEvent } from '@/application/analytics/track';
import {
  type AnalyticsEventMap,
  type AnalyticsEventName,
  type AnalyticsEventRecord,
  isAnalyticsEventName,
} from '@/domain/analytics/events';
import { getBrowserAnalyticsGateway } from '@/infrastructure/analytics/umami-browser-gateway';

const analyticsEnabled = Boolean(import.meta.env.PUBLIC_UMAMI_WEBSITE_ID);
const CLICK_TRIGGER = 'click';
const VIEW_TRIGGER = 'view';

const parseAnalyticsEvent = (
  element: HTMLElement
): AnalyticsEventRecord | null => {
  const name = element.dataset.analyticsEvent;
  const payload = element.dataset.analyticsPayload;
  const hasSerializedEvent = name && payload;

  if (!(hasSerializedEvent && isAnalyticsEventName(name))) {
    return null;
  }

  try {
    return {
      name,
      payload: JSON.parse(payload),
    } as AnalyticsEventRecord;
  } catch {
    return null;
  }
};

const trackElementEvent = (element: HTMLElement) => {
  const event = parseAnalyticsEvent(element);

  if (!event) {
    return;
  }

  trackAnalyticsEvent(getBrowserAnalyticsGateway(), event.name, event.payload);
};

const handleClick = (event: Event) => {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return;
  }

  const element = target.closest<HTMLElement>(
    `[data-analytics-trigger="${CLICK_TRIGGER}"], [data-analytics-event]:not([data-analytics-trigger])`
  );

  if (!element) {
    return;
  }

  trackElementEvent(element);
};

const trackViewEvents = () => {
  const elements = document.querySelectorAll<HTMLElement>(
    `[data-analytics-trigger="${VIEW_TRIGGER}"]`
  );

  for (const element of elements) {
    const event = parseAnalyticsEvent(element);

    if (!event) {
      continue;
    }

    const key = `${window.location.pathname}:${event.name}`;

    if (window.__portfolioAnalyticsLastViewKey === key) {
      continue;
    }

    window.__portfolioAnalyticsLastViewKey = key;
    trackAnalyticsEvent(
      getBrowserAnalyticsGateway(),
      event.name,
      event.payload
    );
  }
};

export const initializeBrowserAnalytics = () => {
  if (
    typeof window === 'undefined' ||
    !analyticsEnabled ||
    window.__portfolioAnalyticsInitialized
  ) {
    return;
  }

  window.__portfolioAnalyticsInitialized = true;

  document.addEventListener('click', handleClick);
  document.addEventListener('astro:page-load', trackViewEvents);
  queueMicrotask(trackViewEvents);
};

export const trackBrowserAnalyticsEvent = <Name extends AnalyticsEventName>(
  name: Name,
  payload: AnalyticsEventMap[Name]
) => {
  if (!analyticsEnabled) {
    return;
  }

  trackAnalyticsEvent(getBrowserAnalyticsGateway(), name, payload);
};
