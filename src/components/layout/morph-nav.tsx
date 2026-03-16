import {
  LayoutGroup,
  type MotionValue,
  motion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type {
  NavigationItemViewModel,
  SocialLinkViewModel,
} from '@/application/portfolio/dto';
import {
  COMPACT_MOBILE_BREAKPOINT,
  getMorphNavLayoutState,
  MOBILE_BREAKPOINT,
  NAV_STACK_GAP,
} from '@/components/layout/morph-nav-layout';
import { SiteUtilityControls } from '@/components/layout/site-utility-controls';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Lang } from '@/i18n/translations';
import { getLocalizedPath } from '@/i18n/utils';
import { trackBrowserAnalyticsEvent } from '@/infrastructure/analytics/browser';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';
import { cn } from '@/lib/utils';

type Props = {
  lang: Lang;
  pathname: string;
  navigation: readonly NavigationItemViewModel[];
  socialLinks: readonly SocialLinkViewModel[];
};

const iconPaths: Record<string, string> = {
  twitter:
    'M4 4l6.7 8.8L4 20h2.3l5.4-5.8L16 20h4.7l-7-9.2L20 4h-2.3l-5 5.4L8.7 4z',
  github:
    'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4M9 18c-4.51 2-5-2-7-2',
  linkedin:
    'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
  mail: 'M2 4h20c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H2c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 3l10 5.7L22 7',
};

function SocialIcon({ icon }: { icon: string }) {
  const paths = iconPaths[icon];
  if (!paths) {
    return null;
  }
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      {paths.split(/(?<=z|Z)\s*(?=M)/g).map((d, i) => (
        <path d={d} key={i} />
      ))}
    </svg>
  );
}

const noop = () => undefined;

const toContactChannel = (
  icon: SocialLinkViewModel['icon']
): 'github' | 'linkedin' | 'x' | null => {
  if (icon === 'twitter') {
    return 'x';
  }

  if (icon === 'github' || icon === 'linkedin') {
    return icon;
  }

  return null;
};

function SocialLinks({
  className,
  lang,
  links,
}: {
  className?: string;
  lang: Lang;
  links: readonly SocialLinkViewModel[];
}) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {links.map((link) => {
        const channel = toContactChannel(link.icon);

        return (
          <Tooltip key={link.label}>
            {/*
              The mail icon stays intentionally untracked; the user only wants
              social outbound clicks here.
            */}
            <TooltipTrigger
              aria-label={link.label}
              render={
                <a
                  className="icon-btn inline-flex h-8 w-8 items-center justify-center rounded-lg"
                  href={link.href}
                  onClick={() => {
                    if (!channel) {
                      return;
                    }

                    trackBrowserAnalyticsEvent('social_link_clicked', {
                      channel,
                      lang,
                      location: 'nav',
                    });
                  }}
                  rel={
                    link.href.startsWith('mailto:')
                      ? undefined
                      : 'noopener noreferrer'
                  }
                  target={
                    link.href.startsWith('mailto:') ? undefined : '_blank'
                  }
                />
              }
            >
              <SocialIcon icon={link.icon} />
            </TooltipTrigger>
            <TooltipContent>{link.label}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}

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

function useIsMobile(breakpoint = 640) {
  return useSyncExternalStore(
    (onStoreChange) => subscribeIsMobile(breakpoint, onStoreChange),
    () => getIsMobileSnapshot(breakpoint),
    () => false
  );
}

// Expanded padding values
const PADDING_DESKTOP = 60;
const PADDING_MOBILE = 32;

// Heights for the spacer (must match the expanded header)
// paddingTop + heroName(36) + gap + navRow(32) + gap + heroSocials(32) + paddingBottom(12)
const SPACER_DESKTOP =
  PADDING_DESKTOP + 36 + NAV_STACK_GAP + 32 + NAV_STACK_GAP + 32 + 12; // 212
const SPACER_MOBILE =
  PADDING_MOBILE + 36 + NAV_STACK_GAP + 32 + NAV_STACK_GAP + 32 + 12; // 184

const morphTransition = {
  layout: { duration: 0.4, ease: [0.25, 1, 0.5, 1] as const },
};

const reducedMorphTransition = {
  layout: { duration: 0, ease: [0.25, 1, 0.5, 1] as const },
};

const widthTransition = {
  duration: 0.4,
  ease: [0.25, 1, 0.5, 1] as const,
};

const reducedWidthTransition = {
  duration: 0,
  ease: [0.25, 1, 0.5, 1] as const,
};

const EXPANDED_BRAND_BLOCK_HEIGHT = 62;
const INLINE_BRAND_BLOCK_HEIGHT = 21;

const getActiveMorphTransition = (prefersReduced: boolean) =>
  prefersReduced ? reducedMorphTransition : morphTransition;

const getActiveWidthTransition = (prefersReduced: boolean) =>
  prefersReduced ? reducedWidthTransition : widthTransition;

const getActiveBrandTransition = (prefersReduced: boolean) =>
  prefersReduced
    ? { duration: 0 }
    : { duration: 0.32, ease: [0.25, 1, 0.5, 1] as const };

const getActiveTransitions = (motionEnabled: boolean) => ({
  brand: getActiveBrandTransition(!motionEnabled),
  layout: getActiveMorphTransition(!motionEnabled),
  width: getActiveWidthTransition(!motionEnabled),
});

const getBorderDelay = (prefersReduced: boolean, scrolled: boolean) => {
  if (prefersReduced) {
    return 0;
  }

  return scrolled ? 200 : 0;
};

const getBorderTransition = (
  prefersReduced: boolean,
  borderVisible: boolean
) => {
  if (prefersReduced) {
    return 'clip-path 0s linear';
  }

  if (borderVisible) {
    return 'clip-path 1s cubic-bezier(0.25, 1, 0.5, 1)';
  }

  return 'clip-path 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
};

function HeaderBackground({
  prefersReduced,
  scrolled,
  opacity,
}: {
  prefersReduced: boolean;
  scrolled: boolean;
  opacity: MotionValue<number>;
}) {
  if (prefersReduced) {
    return (
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: 'var(--background)',
          opacity: scrolled ? 1 : 0,
        }}
      />
    );
  }

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        backgroundColor: 'var(--background)',
        opacity,
      }}
    />
  );
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

const getNavSectionStyle = ({
  layoutState,
  scrolled,
}: {
  layoutState: ReturnType<typeof getMorphNavLayoutState>;
  scrolled: boolean;
}) => {
  if (layoutState.navFullWidth) {
    return {
      height: 32,
      marginBottom: layoutState.navMarginBottom,
      paddingRight: layoutState.navPaddingRight,
      width: '100%',
    };
  }

  if (scrolled) {
    return { marginLeft: layoutState.navMarginLeft };
  }

  return {
    height: 32,
    marginBottom: layoutState.navMarginBottom,
  };
};

const getToggleSectionStyle = (togglesInline: boolean) => {
  if (togglesInline) {
    return { marginLeft: 4 };
  }

  return {
    position: 'absolute' as const,
    right: 0,
    top: 12,
    zIndex: 10,
  };
};

const getHeaderMaxWidth = (scrolled: boolean) => (scrolled ? 768 : 896);

const getNavLayoutMode = (isCompactMobile: boolean) =>
  isCompactMobile ? true : 'position';

const getBrandWrapperHeight = ({
  brandHidden,
  scrolled,
}: {
  brandHidden: boolean;
  scrolled: boolean;
}) => {
  if (brandHidden) {
    return 0;
  }

  return scrolled ? INLINE_BRAND_BLOCK_HEIGHT : EXPANDED_BRAND_BLOCK_HEIGHT;
};

const getHeaderContentClassName = ({
  layoutState,
  scrolled,
}: {
  layoutState: ReturnType<typeof getMorphNavLayoutState>;
  scrolled: boolean;
}) =>
  cn(
    'relative flex pb-3',
    layoutState.containerDirection === 'column' ? 'flex-col' : 'flex-row',
    layoutState.containerAlignItems === 'center'
      ? 'items-center'
      : 'items-stretch',
    scrolled ? 'pt-3' : 'pt-8 sm:pt-[60px]'
  );

function useMotionReady() {
  const [motionReady, setMotionReady] = useState(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setMotionReady(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  return motionReady;
}

function useMorphNavState({
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

function useBorderVisible(prefersReduced: boolean, scrolled: boolean) {
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

export function MorphNav({
  lang,
  pathname: initialPathname,
  navigation,
  socialLinks,
}: Props) {
  const prefersReduced = usePrefersReducedMotion();
  const isMobile = useIsMobile(MOBILE_BREAKPOINT);
  const isCompactMobile = useIsMobile(COMPACT_MOBILE_BREAKPOINT);
  const motionReady = useMotionReady();

  const navItems = navigation;
  const { scrollY } = useScroll();

  const expandedPadding = isMobile ? PADDING_MOBILE : PADDING_DESKTOP;
  const spacerHeight = isMobile ? SPACER_MOBILE : SPACER_DESKTOP;
  const { currentPath, scrolled } = useMorphNavState({
    expandedPadding,
    initialPathname,
    scrollY,
    spacerHeight,
  });
  const homeHref = navItems[0]?.href ?? getLocalizedPath('/', lang);

  // Scroll-driven header chrome (continuous) — starts near the morph threshold
  const bgAlpha = useTransform(
    scrollY,
    [expandedPadding * 0.6, expandedPadding + 60],
    [0, 1]
  );

  const motionEnabled = motionReady && !prefersReduced;
  const activeTransitions = getActiveTransitions(motionEnabled);
  const layoutState = getMorphNavLayoutState({
    isCompactMobile,
    scrolled,
  });
  const borderVisible = useBorderVisible(prefersReduced, scrolled);
  const navLayoutMode = getNavLayoutMode(isCompactMobile);
  const brandWrapperHeight = getBrandWrapperHeight({
    brandHidden: layoutState.brandHidden,
    scrolled,
  });

  const renderNavLink = (item: NavigationItemViewModel) => {
    const itemPath = item.href.replace(/\/$/, '') || '/';
    const isActive = currentPath === itemPath;
    return (
      <a
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          'nav-link relative px-3 py-1.5 font-medium text-sm transition-colors',
          isActive
            ? 'text-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
        href={item.href}
        key={item.href}
      >
        {item.label}
      </a>
    );
  };

  return (
    <TooltipProvider>
      {/* Fixed header — does NOT affect document flow */}
      <motion.header className="fixed top-0 right-0 left-0 z-50">
        <HeaderBackground
          opacity={bgAlpha}
          prefersReduced={prefersReduced}
          scrolled={scrolled}
        />

        <motion.div
          animate={{ maxWidth: getHeaderMaxWidth(scrolled) }}
          className="page-shell relative"
          transition={activeTransitions.width}
        >
          <LayoutGroup>
            <motion.div
              className={getHeaderContentClassName({
                layoutState,
                scrolled,
              })}
              initial={false}
              layout
              transition={activeTransitions.layout}
            >
              {/* Sandra */}
              <motion.div
                animate={{
                  height: brandWrapperHeight,
                  opacity: layoutState.brandHidden ? 0 : 1,
                }}
                aria-hidden={layoutState.brandHidden || undefined}
                className={cn(layoutState.brandHidden && 'pointer-events-none')}
                initial={false}
                layout
                style={{ overflow: 'hidden' }}
                transition={activeTransitions.brand}
              >
                <motion.div
                  animate={{ y: layoutState.brandHidden ? -12 : 0 }}
                  initial={false}
                  transition={activeTransitions.brand}
                >
                  <a
                    className={cn(
                      'font-serif',
                      scrolled && !layoutState.brandHidden
                        ? 'whitespace-nowrap font-medium text-[15px]'
                        : 'text-[28px]'
                    )}
                    href={homeHref}
                    style={
                      scrolled && !layoutState.brandHidden
                        ? undefined
                        : { fontWeight: 500 }
                    }
                    tabIndex={layoutState.brandHidden ? -1 : undefined}
                  >
                    sandra
                  </a>
                </motion.div>
              </motion.div>

              {/* Nav */}
              <motion.div
                className={cn(
                  'flex items-center',
                  layoutState.navJustify === 'center'
                    ? 'justify-center'
                    : 'justify-start'
                )}
                layout={navLayoutMode}
                style={getNavSectionStyle({ layoutState, scrolled })}
                transition={activeTransitions.layout}
              >
                <nav
                  aria-label="Principal"
                  className="flex items-center gap-1 text-sm"
                >
                  {navItems.map(renderNavLink)}
                </nav>
              </motion.div>

              {/* Socials */}
              <motion.div
                layout="position"
                style={{
                  marginLeft: layoutState.socialsMarginLeftAuto
                    ? 'auto'
                    : undefined,
                  width: layoutState.socialsFullWidth ? '100%' : undefined,
                }}
                transition={activeTransitions.layout}
              >
                <SocialLinks
                  className={
                    layoutState.socialsJustify === 'center'
                      ? 'justify-center'
                      : undefined
                  }
                  lang={lang}
                  links={socialLinks}
                />
              </motion.div>

              {/* Toggles */}
              <motion.div
                className="flex items-center gap-1"
                layout="position"
                style={getToggleSectionStyle(layoutState.togglesInline)}
                transition={activeTransitions.layout}
              >
                <SiteUtilityControls lang={lang} pathname={currentPath} />
              </motion.div>
            </motion.div>
          </LayoutGroup>
        </motion.div>

        {/* Border line — grows from center */}
        <div
          style={{
            height: 1,
            backgroundColor: 'var(--border)',
            opacity: 0.65,
            clipPath: borderVisible ? 'inset(0 0 0 0)' : 'inset(0 50% 0 50%)',
            transition: getBorderTransition(prefersReduced, borderVisible),
          }}
        />
      </motion.header>

      {/* Spacer — reserves space in document flow matching expanded header */}
      <div className="h-[184px] sm:h-[212px]" />
    </TooltipProvider>
  );
}
