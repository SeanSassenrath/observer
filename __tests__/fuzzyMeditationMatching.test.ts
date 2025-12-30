/**
 * Tests for fuzzy meditation matching improvements
 * Focus on relative ranking and threshold behavior to avoid flaky tests
 */

import { calculateNameSimilarity, expandSeriesAbbreviations, numbersMatch, romanToArabic } from '../src/utils/fuzzyMeditationMatching';

describe('Fuzzy Meditation Matching', () => {
  /**
   * Test 1: Breath Variant Relative Ranking
   * Files with "breath" should score higher with breath variants than base meditations
   */
  test('should rank breath variant higher than base meditation for breath files', () => {
    const breathVariantScore = calculateNameSimilarity(
      'tuning into new potentials - breath',
      'Tuning Into New Potentials - Breath'
    );

    const baseVersionScore = calculateNameSimilarity(
      'tuning into new potentials - breath',
      'Tuning Into New Potentials'
    );

    // Breath variant should score significantly higher than base
    expect(breathVariantScore).toBeGreaterThan(baseVersionScore);
    expect(breathVariantScore).toBeGreaterThan(0.5); // Above match threshold
  });

  /**
   * Test 2: BEC Abbreviation Expansion (Unit Test)
   * "BEC" should expand to "Blessing of the Energy Centers"
   */
  test('should expand BEC abbreviation to full name', () => {
    const expanded = expandSeriesAbbreviations('2 bec ii meditation');
    expect(expanded).toContain('blessing of the energy centers');
  });

  /**
   * Test 3: BEC Matching Passes Threshold
   * BEC files should successfully match to database entries
   */
  test('should match BEC files above confidence threshold', () => {
    const score = calculateNameSimilarity(
      '2 BEC-II Meditation',
      'Blessing of the Energy Centers 02'
    );

    // Should be above the 0.5 matching threshold
    expect(score).toBeGreaterThan(0.5);
  });

  /**
   * Test 4: Zero-Padding Number Match (Unit Test)
   * Numbers should match regardless of zero-padding
   */
  test('should match zero-padded numbers with single digits', () => {
    expect(numbersMatch('2', '02')).toBe(true);
    expect(numbersMatch('1', '01')).toBe(true);
    expect(numbersMatch('2', '3')).toBe(false);
  });

  /**
   * Test 5: Roman Numeral Conversion (Unit Test)
   * Roman numerals should convert correctly to arabic numbers
   */
  test('should convert roman numerals to arabic numbers', () => {
    expect(romanToArabic('ii')).toBe(2);
    expect(romanToArabic('v')).toBe(5);
    expect(romanToArabic('x')).toBe(10);
    expect(romanToArabic('invalid')).toBeNull();
  });

  /**
   * Test 6: No Regression - Base Match Still Works
   * Files without variants should still match base meditations
   */
  test('should still match base meditations when no variant keywords present', () => {
    const score = calculateNameSimilarity(
      'tuning into new potentials',
      'Tuning Into New Potentials'
    );

    expect(score).toBeGreaterThan(0.5); // Should still match
  });

  /**
   * Test 7: Keyword Mismatch Penalty
   * Files with variant keywords should prefer matching variants
   */
  test('should prefer meditations with matching variant keywords', () => {
    const withBreathScore = calculateNameSimilarity(
      'changing beliefs - breath',
      'Changing Beliefs and Perceptions - Breath'
    );

    const withoutBreathScore = calculateNameSimilarity(
      'changing beliefs - breath',
      'Changing Beliefs and Perceptions - Meditation'
    );

    // File with "breath" should prefer meditation with "breath"
    expect(withBreathScore).toBeGreaterThan(withoutBreathScore);
  });
});
