import {
  LayoutGroup,
  type MotionValue,
  motion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type {
  NavigationItemViewModel,
  SocialLinkViewModel,
} from '@/application/portfolio/dto';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Lang } from '@/i18n/translations';
import {
  getAlternateLang,
  getLocalizedPath,
  getTranslations,
} from '@/i18n/utils';
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

const THEME_CHANGE_EVENT = 'portfolio-theme-change';
const noop = () => undefined;

const getThemeSnapshot = (): 'light' | 'dark' => {
  if (typeof document === 'undefined') {
    return 'dark';
  }
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
};

const subscribeTheme = (onStoreChange: () => void) => {
  if (typeof window === 'undefined') {
    return noop;
  }

  window.addEventListener('storage', onStoreChange);
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
  };
};

function ThemeToggle({ lang }: { lang: Lang }) {
  const t = getTranslations(lang);
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    () => 'dark'
  );

  const toggle = () => {
    document.documentElement.classList.add('theme-transition');
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    if (nextTheme === 'light') {
      localStorage.setItem('theme', 'light');
    } else {
      localStorage.removeItem('theme');
    }

    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 450);
  };

  const Icon = theme === 'dark' ? Sun : Moon;
  const label =
    theme === 'dark' ? t.common.switchToLight : t.common.switchToDark;

  return (
    <Tooltip>
      <TooltipTrigger
        aria-label={label}
        className="icon-btn inline-flex h-8 w-8 items-center justify-center rounded-lg"
        onClick={toggle}
      >
        <Icon className="size-4" />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function SocialLinks({
  className,
  links,
}: {
  className?: string;
  links: readonly SocialLinkViewModel[];
}) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {links.map((link) => (
        <Tooltip key={link.label}>
          <TooltipTrigger
            aria-label={link.label}
            render={
              <a
                className="icon-btn inline-flex h-8 w-8 items-center justify-center rounded-lg"
                href={link.href}
                rel={
                  link.href.startsWith('mailto:')
                    ? undefined
                    : 'noopener noreferrer'
                }
                target={link.href.startsWith('mailto:') ? undefined : '_blank'}
              />
            }
          >
            <SocialIcon icon={link.icon} />
          </TooltipTrigger>
          <TooltipContent>{link.label}</TooltipContent>
        </Tooltip>
      ))}
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

function Toggles({
  lang,
  altPath,
  altLabel,
}: {
  lang: Lang;
  altPath: string;
  altLabel: string;
}) {
  const t = getTranslations(lang);

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          aria-label={t.common.switchLang}
          render={
            <a
              className="icon-btn inline-flex h-8 items-center justify-center rounded-lg px-2 font-semibold text-xs"
              href={altPath}
            />
          }
        >
          {altLabel}
        </TooltipTrigger>
        <TooltipContent>{t.common.switchLang}</TooltipContent>
      </Tooltip>
      <ThemeToggle lang={lang} />
    </>
  );
}

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
const GAP = 20;

// Heights for the spacer (must match the expanded header)
// paddingTop + heroName(36) + gap + navRow(32) + gap + heroSocials(32) + paddingBottom(12)
const SPACER_DESKTOP = PADDING_DESKTOP + 36 + GAP + 32 + GAP + 32 + 12; // 212
const SPACER_MOBILE = PADDING_MOBILE + 36 + GAP + 32 + GAP + 32 + 12; // 184

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

export function MorphNav({
  lang,
  pathname: initialPathname,
  navigation,
  socialLinks,
}: Props) {
  const prefersReduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const [currentPath, setCurrentPath] = useState(initialPathname);

  const navItems = navigation;
  const altLang = getAlternateLang(lang);
  const altLabel = altLang.toUpperCase();
  const altPath = getLocalizedPath(currentPath, altLang);
  const homeHref = navItems[0]?.href ?? getLocalizedPath('/', lang);

  // Lock: prevents scroll handler from unsetting scrolled during Astro transitions
  const scrollLockRef = useRef(0);
  const scrolledRef = useRef(false);

  const { scrollY } = useScroll();

  const expandedPadding = isMobile ? PADDING_MOBILE : PADDING_DESKTOP;
  const spacerHeight = isMobile ? SPACER_MOBILE : SPACER_DESKTOP;
  const spacerHeightRef = useRef(spacerHeight);

  // Scroll-driven header chrome (continuous) — starts near the morph threshold
  const bgAlpha = useTransform(
    scrollY,
    [expandedPadding * 0.6, expandedPadding + 60],
    [0, 1]
  );

  // Discrete scroll state with hysteresis — triggers after scrolling past "sandra"
  const [scrolled, setScrolled] = useState(false);
  const activeMorphTransition = prefersReduced
    ? reducedMorphTransition
    : morphTransition;
  const activeWidthTransition = prefersReduced
    ? reducedWidthTransition
    : widthTransition;

  useEffect(() => {
    spacerHeightRef.current = spacerHeight;
  }, [spacerHeight]);

  useEffect(() => {
    scrolledRef.current = scrolled;
  }, [scrolled]);

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (v) => {
      if (Date.now() < scrollLockRef.current) {
        return;
      }
      setScrolled((prev) => {
        if (prev && v < expandedPadding - 10) {
          return false;
        }
        if (!prev && v > expandedPadding) {
          return true;
        }
        return prev;
      });
    });
    return unsubscribe;
  }, [scrollY, expandedPadding]);

  // Update path on Astro navigation; keep sticky if was scrolled
  useEffect(() => {
    const onSwap = () => {
      setCurrentPath(window.location.pathname.replace(/\/$/, '') || '/');
      if (scrolledRef.current) {
        scrollLockRef.current = Date.now() + 600;
      }
    };
    // After Astro finishes (including its scroll-to-top), restore scroll
    const onLoad = () => {
      if (Date.now() < scrollLockRef.current) {
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
      }
    };
    document.addEventListener('astro:after-swap', onSwap);
    document.addEventListener('astro:page-load', onLoad);
    return () => {
      document.removeEventListener('astro:after-swap', onSwap);
      document.removeEventListener('astro:page-load', onLoad);
    };
  }, []);

  // Border appears with scaleX after morph completes
  const [borderVisible, setBorderVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(
      () => setBorderVisible(scrolled),
      getBorderDelay(prefersReduced, scrolled)
    );
    return () => clearTimeout(timer);
  }, [prefersReduced, scrolled]);

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
          animate={{ maxWidth: scrolled ? 768 : 896 }}
          className="page-shell relative"
          transition={activeWidthTransition}
        >
          <LayoutGroup>
            <motion.div
              layout
              style={{
                display: 'flex',
                flexDirection: scrolled ? 'row' : 'column',
                alignItems: 'center',
                paddingTop: scrolled ? 12 : expandedPadding,
                paddingBottom: 12,
                position: 'relative',
              }}
              transition={activeMorphTransition}
            >
              {/* Sandra */}
              <motion.div
                layout="position"
                style={scrolled ? undefined : { marginBottom: GAP }}
                transition={activeMorphTransition}
              >
                <a
                  className={cn(
                    'font-serif',
                    scrolled
                      ? 'whitespace-nowrap font-medium text-[15px]'
                      : 'text-[28px]'
                  )}
                  href={homeHref}
                  style={scrolled ? undefined : { fontWeight: 500 }}
                >
                  sandra
                </a>
              </motion.div>

              {/* Nav */}
              <motion.div
                className={cn(
                  'flex items-center',
                  !scrolled && 'justify-center'
                )}
                layout="position"
                style={
                  scrolled
                    ? { marginLeft: 16 }
                    : { height: 32, marginBottom: GAP }
                }
                transition={activeMorphTransition}
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
                style={scrolled ? { marginLeft: 'auto' } : undefined}
                transition={activeMorphTransition}
              >
                <SocialLinks
                  className={scrolled ? undefined : 'justify-center'}
                  links={socialLinks}
                />
              </motion.div>

              {/* Toggles */}
              <motion.div
                className="flex items-center gap-1"
                layout="position"
                style={
                  scrolled
                    ? { marginLeft: 4 }
                    : {
                        position: 'absolute',
                        top: 12,
                        right: 0,
                        zIndex: 10,
                      }
                }
                transition={activeMorphTransition}
              >
                <Toggles altLabel={altLabel} altPath={altPath} lang={lang} />
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
      <div style={{ height: spacerHeight }} />
    </TooltipProvider>
  );
}
