import { describe, expect, it } from 'vitest';
import {
  getAgeFromBirthDate,
  isBirthday,
} from '@/application/portfolio/about-age';

describe('about age helpers', () => {
  it('calculates the age before the birthday of the current year', () => {
    expect(getAgeFromBirthDate('1989-09-15', new Date('2026-03-14'))).toBe(36);
  });

  it('calculates the age on the birthday', () => {
    expect(getAgeFromBirthDate('1989-09-15', new Date('2026-09-15'))).toBe(37);
    expect(isBirthday('1989-09-15', new Date('2026-09-15'))).toBe(true);
  });

  it('returns false when today is not the birthday', () => {
    expect(isBirthday('1989-09-15', new Date('2026-03-14'))).toBe(false);
  });
});
