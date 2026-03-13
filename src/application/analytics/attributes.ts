import type {
  AnalyticsEventMap,
  AnalyticsEventName,
} from '@/domain/analytics/events';

type Trigger = 'click' | 'view';

type AnalyticsAttributes = {
  'data-analytics-event': string;
  'data-analytics-payload': string;
  'data-analytics-trigger'?: Trigger;
};

type Options = {
  trigger?: Trigger;
};

export const createAnalyticsAttributes = <Name extends AnalyticsEventName>(
  name: Name,
  payload: AnalyticsEventMap[Name],
  options?: Options
): AnalyticsAttributes => {
  return {
    'data-analytics-event': name,
    'data-analytics-payload': JSON.stringify(payload),
    ...(options?.trigger ? { 'data-analytics-trigger': options.trigger } : {}),
  };
};
