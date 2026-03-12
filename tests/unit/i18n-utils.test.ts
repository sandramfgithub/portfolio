import { describe, expect, it } from 'vitest';

import {
  getAlternateLang,
  getLangFromUrl,
  getLocalizedPath,
  getTranslations,
} from '../../src/i18n/utils';

describe('i18n utils', () => {
  it('detects the locale from the pathname', () => {
    expect(getLangFromUrl(new URL('https://sandramf.dev/'))).toBe('es');
    expect(getLangFromUrl(new URL('https://sandramf.dev/en/projects'))).toBe(
      'en'
    );
  });

  it('builds localized paths with explicit locale prefixes', () => {
    expect(getLocalizedPath('/', 'es')).toBe('/es');
    expect(getLocalizedPath('/', 'en')).toBe('/en');
    expect(getLocalizedPath('/projects', 'en')).toBe('/en/projects');
    expect(getLocalizedPath('/en/about/', 'es')).toBe('/es/about');
  });

  it('returns the alternate locale', () => {
    expect(getAlternateLang('es')).toBe('en');
    expect(getAlternateLang('en')).toBe('es');
  });

  it('returns the translation tree for the selected locale', () => {
    expect(getTranslations('es').nav.home).toBe('Inicio');
    expect(getTranslations('en').nav.home).toBe('Home');
  });
});
