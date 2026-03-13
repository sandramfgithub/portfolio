import type {
  AnalyticsEventName,
  AnalyticsEventRecord,
} from '@/domain/analytics/events';

export interface AnalyticsGateway {
  track<Name extends AnalyticsEventName>(
    event: AnalyticsEventRecord<Name>
  ): void;
}
