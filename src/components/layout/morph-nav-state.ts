import type { MotionValue } from 'framer-motion';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

const noop = () => undefined;

const getIsMobileSnapshot = (breakpoint: number) => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches;
};

const subscribeIsMobile = (breakpoint: number, onStoreChange: () => void) => {
  if (typeof window === 'undefined') {
    return noop;
  }

  const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
  const handler = () => onStoreChange();

  mql.addEventListener('change', handler);
  return () => mql.removeEventListener('change', handler);
};

export function useIsMobile(breakpoint = 640) {
  return useSyncExternalStore(
    (onStoreChange) => subscribeIsMobile(breakpoint, onStoreChange),
    () => getIsMobileSnapshot(breakpoint),
    () => false
  );
}

export function useMotionReady() {
  const [motionReady, setMotionReady] = useState(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setMotionReady(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  return motionReady;
}

const getNextScrolledState = ({
  expandedPadding,
  previous,
  scrollTop,
}: {
  expandedPadding: number;
  previous: boolean;
  scrollTop: number;
}) => {
  if (previous && scrollTop < expandedPadding - 10) {
    return false;
  }

  if (!previous && scrollTop > expandedPadding) {
    return true;
  }

  return previous;
};

export function useMorphNavState({
  expandedPadding,
  initialPathname,
  scrollY,
  spacerHeight,
}: {
  expandedPadding: number;
  initialPathname: string;
  scrollY: MotionValue<number>;
  spacerHeight: number;
}) {
  const [currentPath, setCurrentPath] = useState(initialPathname);
  const [scrolled, setScrolled] = useState(false);
  const scrollLockRef = useRef(0);
  const scrolledRef = useRef(false);
  const spacerHeightRef = useRef(spacerHeight);

  useEffect(() => {
    spacerHeightRef.current = spacerHeight;
  }, [spacerHeight]);

  useEffect(() => {
    scrolledRef.current = scrolled;
  }, [scrolled]);

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (scrollTop) => {
      if (Date.now() < scrollLockRef.current) {
        return;
      }

      setScrolled((previous) =>
        getNextScrolledState({
          expandedPadding,
          previous,
          scrollTop,
        })
      );
    });

    return unsubscribe;
  }, [expandedPadding, scrollY]);

  useEffect(() => {
    const onSwap = () => {
      setCurrentPath(window.location.pathname.replace(/\/$/, '') || '/');
      if (scrolledRef.current) {
        scrollLockRef.current = Date.now() + 600;
      }
    };

    const onLoad = () => {
      if (Date.now() >= scrollLockRef.current) {
        return;
      }

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll < 40) {
        scrollLockRef.current = 0;
        setScrolled(false);
        return;
      }

      window.scrollTo({
        top: spacerHeightRef.current - 56,
        behavior: 'instant',
      });
    };

    document.addEventListener('astro:after-swap', onSwap);
    document.addEventListener('astro:page-load', onLoad);

    return () => {
      document.removeEventListener('astro:after-swap', onSwap);
      document.removeEventListener('astro:page-load', onLoad);
    };
  }, []);

  return {
    currentPath,
    scrolled,
  };
}

const getBorderDelay = (prefersReduced: boolean, scrolled: boolean) => {
  if (prefersReduced) {
    return 0;
  }

  return scrolled ? 200 : 0;
};

export function useBorderVisible(prefersReduced: boolean, scrolled: boolean) {
  const [borderVisible, setBorderVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(
      () => setBorderVisible(scrolled),
      getBorderDelay(prefersReduced, scrolled)
    );
    return () => clearTimeout(timer);
  }, [prefersReduced, scrolled]);

  return borderVisible;
}
