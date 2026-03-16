import type { AnalyticsEventRecord } from '@/domain/analytics/events';
import type { AnalyticsGateway } from '@/domain/analytics/gateway';
import { noopAnalyticsGateway } from '@/infrastructure/analytics/noop-analytics-gateway';

const analyticsEnabled = Boolean(import.meta.env.PUBLIC_UMAMI_WEBSITE_ID);
const queue: AnalyticsEventRecord[] = [];
let listenersRegistered = false;

const flushQueue = () => {
  if (!analyticsEnabled) {
    queue.length = 0;
    return;
  }

  const umami = window.umami;

  if (!umami?.track) {
    return;
  }

  while (queue.length > 0) {
    const event = queue.shift();

    if (!event) {
      return;
    }

    umami.track(event.name, event.payload as Record<string, unknown>);
  }
};

export const umamiBrowserGateway: AnalyticsGateway = {
  track(event) {
    if (!analyticsEnabled) {
      return;
    }

    const umami = window.umami;

    if (!umami?.track) {
      queue.push(event);
      return;
    }

    umami.track(event.name, event.payload as Record<string, unknown>);
  },
};

export const getBrowserAnalyticsGateway = (): AnalyticsGateway => {
  if (
    typeof window === 'undefined' ||
    !analyticsEnabled ||
    window.__analyticsOptOut
  ) {
    return noopAnalyticsGateway;
  }

  if (!listenersRegistered) {
    listenersRegistered = true;
    queueMicrotask(flushQueue);
    window.addEventListener('astro:page-load', flushQueue);
    window.addEventListener('load', flushQueue, { once: true });
  }

  return umamiBrowserGateway;
};
