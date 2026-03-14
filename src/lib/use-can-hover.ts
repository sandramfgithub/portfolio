import { useSyncExternalStore } from 'react';

const MEDIA_QUERY = '(hover: hover) and (pointer: fine)';

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

export const useCanHover = () =>
  useSyncExternalStore(subscribe, getSnapshot, () => false);
