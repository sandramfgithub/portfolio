import type { AnalyticsGateway } from '@/domain/analytics/gateway';

export const noopAnalyticsGateway: AnalyticsGateway = {
  track() {
    // Intentionally empty when analytics is disabled.
  },
};
