/**
 * Expanded fuzzy matching tests - confidence thresholds, edge cases
 */

import {
  calculateNameSimilarity,
  expandSeriesAbbreviations,
  numbersMatch,
  romanToArabic,
} from '../src/utils/fuzzyMeditationMatching';

describe('Confidence threshold behavior', () => {
  it('exact match returns score well above 0.5', () => {
    const score = calculateNameSimilarity(
      'Blessing of the Energy Centers 01',
      'Blessing of the Energy Centers 01',
    );
    expect(score).toBeGreaterThan(0.8);
  });

  it('close match returns score above 0.5', () => {
    const score = calculateNameSimilarity(
      'blessing energy centers 1',
      'Blessing of the Energy Centers 01',
    );
    expect(score).toBeGreaterThan(0.5);
  });

  it('completely unrelated names return score below 0.5', () => {
    const score = calculateNameSimilarity(
      'my podcast episode 47',
      'Blessing of the Energy Centers 01',
    );
    expect(score).toBeLessThan(0.5);
  });
});

describe('Multiple close matches - highest confidence wins', () => {
  it('exact name beats partial name', () => {
    const exactScore = calculateNameSimilarity(
      'Tuning Into New Potentials',
      'Tuning Into New Potentials',
    );

    const partialScore = calculateNameSimilarity(
      'Tuning Into New Potentials',
      'Tuning Into New Potentials - Breath',
    );

    expect(exactScore).toBeGreaterThanOrEqual(partialScore);
  });

  it('matching number beats wrong number', () => {
    const correctScore = calculateNameSimilarity(
      'BEC 02',
      'Blessing of the Energy Centers 02',
    );

    const wrongScore = calculateNameSimilarity(
      'BEC 02',
      'Blessing of the Energy Centers 03',
    );

    expect(correctScore).toBeGreaterThan(wrongScore);
  });
});

describe('Edge cases - empty and garbage filenames', () => {
  it('empty filename returns 0 or very low score', () => {
    const score = calculateNameSimilarity(
      '',
      'Blessing of the Energy Centers 01',
    );
    expect(score).toBeLessThan(0.5);
  });

  it('random characters return low score', () => {
    const score = calculateNameSimilarity(
      'asdfghjkl123',
      'Blessing of the Energy Centers 01',
    );
    expect(score).toBeLessThan(0.5);
  });

  it('file extension stripped from matching', () => {
    const withExt = calculateNameSimilarity(
      'Tuning Into New Potentials.m4a',
      'Tuning Into New Potentials',
    );

    const withoutExt = calculateNameSimilarity(
      'Tuning Into New Potentials',
      'Tuning Into New Potentials',
    );

    // Should be close or equal since extension is removed
    expect(Math.abs(withExt - withoutExt)).toBeLessThan(0.2);
  });
});

describe('Series abbreviation expansion', () => {
  it('expands BOTEC to full name', () => {
    const expanded = expandSeriesAbbreviations('botec 3 meditation');
    expect(expanded).toContain('blessing of the energy centers');
  });

  it('expands TMM abbreviation', () => {
    const expanded = expandSeriesAbbreviations('tmm 1');
    expect(expanded.length).toBeGreaterThan('tmm 1'.length);
  });

  it('does not modify text without abbreviations', () => {
    const original = 'some random text';
    const expanded = expandSeriesAbbreviations(original);
    expect(expanded).toBe(original);
  });
});

describe('Number matching', () => {
  it('matches identical numbers', () => {
    expect(numbersMatch('5', '5')).toBe(true);
  });

  it('matches zero-padded with non-padded', () => {
    expect(numbersMatch('3', '03')).toBe(true);
    expect(numbersMatch('07', '7')).toBe(true);
  });

  it('rejects different numbers', () => {
    expect(numbersMatch('1', '2')).toBe(false);
    expect(numbersMatch('01', '02')).toBe(false);
  });
});

describe('Roman numeral conversion', () => {
  it('converts basic roman numerals', () => {
    expect(romanToArabic('i')).toBe(1);
    expect(romanToArabic('ii')).toBe(2);
    expect(romanToArabic('iii')).toBe(3);
    expect(romanToArabic('iv')).toBe(4);
    expect(romanToArabic('v')).toBe(5);
  });

  it('converts larger roman numerals', () => {
    expect(romanToArabic('vi')).toBe(6);
    expect(romanToArabic('vii')).toBe(7);
    expect(romanToArabic('viii')).toBe(8);
    expect(romanToArabic('ix')).toBe(9);
    expect(romanToArabic('x')).toBe(10);
  });

  it('returns null for invalid roman numerals', () => {
    expect(romanToArabic('invalid')).toBeNull();
    expect(romanToArabic('abc')).toBeNull();
  });
});
