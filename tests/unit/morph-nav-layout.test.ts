import { describe, expect, it } from 'vitest';
import {
  getMorphNavLayoutState,
  NAV_STACK_GAP,
} from '@/components/layout/morph-nav-layout';

describe('morph nav layout', () => {
  it('keeps the inline scrolled morph on larger mobile widths', () => {
    const state = getMorphNavLayoutState({
      isCompactMobile: false,
      scrolled: true,
    });

    expect(state.brandHidden).toBe(false);
    expect(state.containerDirection).toBe('row');
    expect(state.navMarginLeft).toBe(16);
    expect(state.socialsMarginLeftAuto).toBe(true);
    expect(state.togglesInline).toBe(true);
  });

  it('uses the compact scrolled morph on narrower viewports', () => {
    const state = getMorphNavLayoutState({
      isCompactMobile: true,
      scrolled: true,
    });

    expect(state.brandHidden).toBe(true);
    expect(state.containerDirection).toBe('column');
    expect(state.containerAlignItems).toBe('stretch');
    expect(state.navFullWidth).toBe(true);
    expect(state.navJustify).toBe('start');
    expect(state.navMarginBottom).toBe(NAV_STACK_GAP);
    expect(state.navPaddingRight).toBe(84);
    expect(state.socialsFullWidth).toBe(true);
    expect(state.socialsJustify).toBe('center');
    expect(state.togglesInline).toBe(false);
  });
});
