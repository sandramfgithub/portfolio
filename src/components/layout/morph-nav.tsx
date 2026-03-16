import {
  LayoutGroup,
  type MotionValue,
  motion,
  useScroll,
  useTransform,
} from 'framer-motion';
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
import { MorphNavSocialLinks } from '@/components/layout/morph-nav-social-links';
import {
  useBorderVisible,
  useIsMobile,
  useMorphNavState,
  useMotionReady,
} from '@/components/layout/morph-nav-state';
import { SiteUtilityControls } from '@/components/layout/site-utility-controls';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { Lang } from '@/i18n/translations';
import { getLocalizedPath } from '@/i18n/utils';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';
import { cn } from '@/lib/utils';

type Props = {
  lang: Lang;
  pathname: string;
  navigation: readonly NavigationItemViewModel[];
  socialLinks: readonly SocialLinkViewModel[];
};

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
                <MorphNavSocialLinks
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
