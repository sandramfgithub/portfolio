export const MOBILE_BREAKPOINT = 640;
export const COMPACT_MOBILE_BREAKPOINT = 576;
export const NAV_STACK_GAP = 20;

export type MorphNavLayoutState = {
  brandHidden: boolean;
  brandMarginBottom: number;
  containerAlignItems: 'center' | 'stretch';
  containerDirection: 'column' | 'row';
  navFullWidth: boolean;
  navJustify: 'center' | 'start';
  navMarginBottom: number;
  navMarginLeft: number;
  navPaddingRight: number;
  socialsFullWidth: boolean;
  socialsJustify: 'center' | 'start';
  socialsMarginLeftAuto: boolean;
  togglesInline: boolean;
};

type MorphNavLayoutInput = {
  isCompactMobile: boolean;
  scrolled: boolean;
};

const getExpandedLayoutState = (): MorphNavLayoutState => ({
  brandHidden: false,
  brandMarginBottom: NAV_STACK_GAP,
  containerAlignItems: 'center',
  containerDirection: 'column',
  navFullWidth: false,
  navJustify: 'center',
  navMarginBottom: NAV_STACK_GAP,
  navMarginLeft: 0,
  navPaddingRight: 0,
  socialsFullWidth: false,
  socialsJustify: 'center',
  socialsMarginLeftAuto: false,
  togglesInline: false,
});

const getInlineScrolledLayoutState = (): MorphNavLayoutState => ({
  brandHidden: false,
  brandMarginBottom: 0,
  containerAlignItems: 'center',
  containerDirection: 'row',
  navFullWidth: false,
  navJustify: 'start',
  navMarginBottom: 0,
  navMarginLeft: 16,
  navPaddingRight: 0,
  socialsFullWidth: false,
  socialsJustify: 'start',
  socialsMarginLeftAuto: true,
  togglesInline: true,
});

const getCompactScrolledLayoutState = (): MorphNavLayoutState => ({
  brandHidden: true,
  brandMarginBottom: 0,
  containerAlignItems: 'stretch',
  containerDirection: 'column',
  navFullWidth: true,
  navJustify: 'start',
  navMarginBottom: NAV_STACK_GAP,
  navMarginLeft: 0,
  navPaddingRight: 84,
  socialsFullWidth: true,
  socialsJustify: 'center',
  socialsMarginLeftAuto: false,
  togglesInline: false,
});

export const getMorphNavLayoutState = ({
  isCompactMobile,
  scrolled,
}: MorphNavLayoutInput): MorphNavLayoutState => {
  if (!scrolled) {
    return getExpandedLayoutState();
  }

  if (isCompactMobile) {
    return getCompactScrolledLayoutState();
  }

  return getInlineScrolledLayoutState();
};
