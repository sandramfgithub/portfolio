import type {
  AnalyticsEventMap,
  AnalyticsEventName,
} from '@/domain/analytics/events';
import type { AnalyticsGateway } from '@/domain/analytics/gateway';

export const trackAnalyticsEvent = <Name extends AnalyticsEventName>(
  gateway: AnalyticsGateway,
  name: Name,
  payload: AnalyticsEventMap[Name]
) => {
  gateway.track({
    name,
    payload,
  });
};
