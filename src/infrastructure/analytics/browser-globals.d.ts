export {};

declare global {
  interface Window {
    __portfolioAnalyticsInitialized?: boolean;
    __portfolioAnalyticsLastViewKey?: string;
    umami?: {
      track: (eventName: string, eventData?: Record<string, unknown>) => void;
    };
  }
}
