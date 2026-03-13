import { useSyncExternalStore } from 'react';

const MEDIA_QUERY = '(prefers-reduced-motion: reduce)';

const noop = () => undefined;

const getSnapshot = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia(MEDIA_QUERY).matches;
};

const subscribe = (onStoreChange: () => void) => {
  if (typeof window === 'undefined') {
    return noop;
  }

  const mediaQuery = window.matchMedia(MEDIA_QUERY);
  const handleChange = () => onStoreChange();

  mediaQuery.addEventListener('change', handleChange);
  return () => mediaQuery.removeEventListener('change', handleChange);
};

export const usePrefersReducedMotion = () =>
  useSyncExternalStore(subscribe, getSnapshot, () => false);
