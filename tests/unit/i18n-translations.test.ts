import { describe, expect, it } from 'vitest';

import { translations } from '../../src/i18n/translations';

function collectPaths(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value) || value === null || typeof value !== 'object') {
    return prefix ? [prefix] : [];
  }

  return Object.entries(value as Record<string, unknown>).flatMap(
    ([key, nested]) => collectPaths(nested, prefix ? `${prefix}.${key}` : key)
  );
}

describe('translations', () => {
  it('keeps the english and spanish trees aligned', () => {
    const spanishPaths = collectPaths(translations.es).sort();
    const englishPaths = collectPaths(translations.en).sort();

    expect(englishPaths).toEqual(spanishPaths);
  });
});
