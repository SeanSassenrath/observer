/**
 * Enhanced fuzzy meditation matching with Dr. Joe Dispenza series detection
 * Handles series abbreviations, number variations, and "updated" meditations
 */

export interface SeriesAbbreviation {
  abbreviation: string;
  fullName: string;
  aliases: string[];
}

// Common Dr. Joe Dispenza series abbreviations and patterns
const DR_JOE_SERIES: SeriesAbbreviation[] = [
  {
    abbreviation: 'BEC',
    fullName: 'Blessing of the Energy Centers',
    aliases: ['blessing energy centers', 'energy centers blessing', 'blessing of energy centers', 'bec']
  },
  {
    abbreviation: 'BOTEC',
    fullName: 'Blessing of the Energy Centers',
    aliases: ['blessing energy centers', 'energy centers blessing', 'blessing of energy centers']
  },
  {
    abbreviation: 'TMM',
    fullName: 'Tuning into New Potentials',
    aliases: ['tuning new potentials', 'new potentials']
  },
  {
    abbreviation: 'BHM',
    fullName: 'Body Heart Mind',
    aliases: ['body heart mind meditation']
  },
  {
    abbreviation: 'WIM',
    fullName: 'Water Rising Meditation',
    aliases: ['water rising', 'water meditation']
  },
  {
    abbreviation: 'MM',
    fullName: 'Morning Meditation',
    aliases: ['morning med', 'am meditation']
  },
  {
    abbreviation: 'EM',
    fullName: 'Evening Meditation',
    aliases: ['evening med', 'pm meditation']
  }
];

// Number variations for series matching
const NUMBER_VARIATIONS: Record<string, string[]> = {
  '1': ['1', '01', 'one', 'i', 'part 1', 'session 1', 'chapter 1'],
  '2': ['2', '02', 'two', 'ii', 'part 2', 'session 2', 'chapter 2'],
  '3': ['3', '03', 'three', 'iii', 'part 3', 'session 3', 'chapter 3'],
  '4': ['4', '04', 'four', 'iv', 'part 4', 'session 4', 'chapter 4'],
  '5': ['5', '05', 'five', 'v', 'part 5', 'session 5', 'chapter 5'],
  '6': ['6', '06', 'six', 'vi', 'part 6', 'session 6', 'chapter 6'],
  '7': ['7', '07', 'seven', 'vii', 'part 7', 'session 7', 'chapter 7'],
  '8': ['8', '08', 'eight', 'viii', 'part 8', 'session 8', 'chapter 8'],
  '9': ['9', '09', 'nine', 'ix', 'part 9', 'session 9', 'chapter 9'],
  '10': ['10', 'ten', 'x', 'part 10', 'session 10', 'chapter 10'],
};

// Update indicators that should be handled intelligently
const UPDATE_INDICATORS = [
  'updated', 'update', 'revised', 'revision', 'new version', 'v2', 'v3', 
  '2021', '2022', '2023', '2024', '2025', 'latest', 'final'
];

/**
 * Calculate similarity between file names using enhanced Dr. Joe meditation matching
 */
export function calculateNameSimilarity(
  userFileName: string,
  meditationName: string,
  sourceFileName?: string
): number {
  console.log(`🔍 Calculating similarity between:`);
  console.log(`  User: "${userFileName}"`);
  console.log(`  Meditation: "${meditationName}"`);
  console.log(`  Source: "${sourceFileName || 'N/A'}"`);
  
  // Normalize names for comparison
  const normalizeFileName = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/\.mp3$/i, '')     // Remove file extensions
      .replace(/\.m4a$/i, '')
      .replace(/\.wav$/i, '')
      .replace(/\.mp4$/i, '')
      .replace(/[^\w\s]/g, ' ')   // Replace special chars with spaces
      .replace(/\s+/g, ' ')       // Normalize whitespace
      .trim();
  };
  
  const userNormalized = normalizeFileName(userFileName);
  const meditationNormalized = normalizeFileName(meditationName);
  const sourceNormalized = sourceFileName ? normalizeFileName(sourceFileName) : '';
  
  console.log(`  Normalized user: "${userNormalized}"`);
  console.log(`  Normalized meditation: "${meditationNormalized}"`);
  
  // Quick debug check
  if (userNormalized.length === 0 || meditationNormalized.length === 0) {
    console.log(`  ⚠️ Empty normalized strings detected!`);
    return 0;
  }
  
  // 1. Exact match check
  if (userNormalized === meditationNormalized || 
      (sourceNormalized && userNormalized === sourceNormalized)) {
    console.log(`  ✅ Exact match found: 100%`);
    return 1.0;
  }
  
  // 2. Series abbreviation expansion
  const userExpanded = expandSeriesAbbreviations(userNormalized);
  const meditationExpanded = expandSeriesAbbreviations(meditationNormalized);
  
  console.log(`  Expanded user: "${userExpanded}"`);
  console.log(`  Expanded meditation: "${meditationExpanded}"`);
  
  // 3. Series + number matching
  const seriesScore = calculateSeriesScore(userExpanded, meditationExpanded);
  console.log(`  Series score: ${(seriesScore * 100).toFixed(1)}%`);
  
  // 4. Updated meditation handling
  const updateScore = calculateUpdateScore(userNormalized, meditationNormalized);
  console.log(`  Update score: ${(updateScore * 100).toFixed(1)}%`);

  // 5. Exact keyword matching
  const keywordScore = calculateExactKeywordScore(userNormalized, meditationNormalized);
  console.log(`  Keyword score: ${(keywordScore * 100).toFixed(1)}%`);

  // 6. Traditional fuzzy matching
  const fuzzyScore = calculateTraditionalFuzzy(userNormalized, meditationNormalized, sourceNormalized);
  console.log(`  Fuzzy score: ${(fuzzyScore * 100).toFixed(1)}%`);

  // Return the best score from all methods
  const bestScore = Math.max(seriesScore, updateScore, keywordScore, fuzzyScore);
  console.log(`  🎯 Best score: ${(bestScore * 100).toFixed(1)}%`);
  
  // Safety check - ensure we don't return invalid scores
  if (isNaN(bestScore) || bestScore < 0) {
    console.log(`  ⚠️ Invalid score detected, returning 0`);
    return 0;
  }
  
  console.log(`  ✅ Returning final score: ${(bestScore * 100).toFixed(1)}%`);
  return bestScore;
}

/**
 * Expand series abbreviations to full names for better matching
 */
function expandSeriesAbbreviations(text: string): string {
  let expanded = text;
  
  for (const series of DR_JOE_SERIES) {
    // Replace abbreviation with full name
    const abbrevPattern = new RegExp(`\\b${series.abbreviation}\\b`, 'gi');
    if (abbrevPattern.test(expanded)) {
      expanded = expanded.replace(abbrevPattern, series.fullName.toLowerCase());
      console.log(`    🔄 Expanded "${series.abbreviation}" → "${series.fullName}"`);
    }
    
    // Also check if text matches any aliases
    for (const alias of series.aliases) {
      if (expanded.includes(alias.toLowerCase())) {
        console.log(`    🔄 Found alias "${alias}" for "${series.fullName}"`);
      }
    }
  }
  
  return expanded;
}

/**
 * Calculate series-specific scoring with number variations
 */
function calculateSeriesScore(userText: string, meditationText: string): number {
  // Extract potential series names and numbers
  const userNumbers = extractNumbers(userText);
  const meditationNumbers = extractNumbers(meditationText);
  
  // If both have numbers, check if they match across variations
  if (userNumbers.length > 0 && meditationNumbers.length > 0) {
    for (const userNum of userNumbers) {
      for (const medNum of meditationNumbers) {
        if (numbersMatch(userNum, medNum)) {
          // Numbers match, now check series name similarity
          const userWithoutNumbers = removeNumbers(userText);
          const meditationWithoutNumbers = removeNumbers(meditationText);
          
          const seriesNameScore = calculateEditDistanceSimilarity(userWithoutNumbers, meditationWithoutNumbers);
          
          if (seriesNameScore > 0.7) {
            console.log(`    📊 Series match: "${userNum}" = "${medNum}", series similarity: ${(seriesNameScore * 100).toFixed(1)}%`);
            return 0.9 + (seriesNameScore * 0.1); // High score for series + number match
          }
        }
      }
    }
  }
  
  return 0;
}

/**
 * Convert roman numeral to arabic number
 */
function romanToArabic(roman: string): number | null {
  const romanMap: Record<string, number> = {
    'i': 1, 'ii': 2, 'iii': 3, 'iv': 4, 'v': 5,
    'vi': 6, 'vii': 7, 'viii': 8, 'ix': 9, 'x': 10
  };
  return romanMap[roman.toLowerCase()] || null;
}

/**
 * Convert number word to arabic number
 */
function wordToArabic(word: string): number | null {
  const wordMap: Record<string, number> = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
  };
  return wordMap[word.toLowerCase()] || null;
}

/**
 * Extract numbers and number-like words from text
 * Normalizes all number formats to canonical arabic form
 */
function extractNumbers(text: string): string[] {
  const numbers: string[] = [];
  // Split on both spaces and hyphens to handle "BEC-II" format
  const tokens = text.toLowerCase().split(/[\s\-]+/);

  for (const word of tokens) {
    // Check for digit (including zero-padded)
    if (/^\d+$/.test(word)) {
      // Normalize by removing leading zeros
      const normalized = word.replace(/^0+/, '') || '0';
      if (!numbers.includes(normalized)) {
        numbers.push(normalized);
      }
    }
    // Check for roman numerals
    else if (/^[ivxlcdm]+$/.test(word) && word.length <= 4) {
      const arabic = romanToArabic(word);
      if (arabic && !numbers.includes(arabic.toString())) {
        numbers.push(arabic.toString());
      }
    }
    // Check for number words
    else if (['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'].includes(word)) {
      const arabic = wordToArabic(word);
      if (arabic && !numbers.includes(arabic.toString())) {
        numbers.push(arabic.toString());
      }
    }
    // Check for part/session/chapter patterns
    else if (word.includes('part') || word.includes('session') || word.includes('chapter')) {
      const match = word.match(/(part|session|chapter)\s*(\d+|[ivxlcdm]+|one|two|three|four|five|six|seven|eight|nine|ten)/);
      if (match) {
        const numStr = match[2];
        // Recursively normalize this number
        const extracted = extractNumbers(numStr);
        for (const num of extracted) {
          if (!numbers.includes(num)) {
            numbers.push(num);
          }
        }
      }
    }
  }

  return numbers;
}

/**
 * Check if two number representations match
 */
function numbersMatch(num1: string, num2: string): boolean {
  // Check all variations for each number
  for (const [canonical, variations] of Object.entries(NUMBER_VARIATIONS)) {
    if (variations.some(v => v.includes(num1.toLowerCase())) &&
        variations.some(v => v.includes(num2.toLowerCase()))) {
      return true;
    }
  }
  return num1.toLowerCase() === num2.toLowerCase();
}

/**
 * Remove numbers from text for series name comparison
 */
function removeNumbers(text: string): string {
  return text
    .replace(/\b\d+\b/g, '') // Remove digits
    .replace(/\b[ivxlcdm]+\b/g, '') // Remove roman numerals
    .replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten)\b/g, '') // Remove number words
    .replace(/\b(part|session|chapter)\s*\d*/g, '') // Remove part/session/chapter
    .replace(/\s+/g, ' ') // Clean up whitespace
    .trim();
}

/**
 * Calculate smart scoring for updated meditations
 * User preference should be respected: updated file should match updated meditation
 */
function calculateUpdateScore(userText: string, meditationText: string): number {
  const hasUserUpdate = UPDATE_INDICATORS.some(indicator => userText.includes(indicator));
  const hasMeditationUpdate = UPDATE_INDICATORS.some(indicator => meditationText.includes(indicator));
  
  // Remove update indicators for core comparison
  const userCore = removeUpdateIndicators(userText);
  const meditationCore = removeUpdateIndicators(meditationText);
  
  const coreScore = calculateEditDistanceSimilarity(userCore, meditationCore);
  
  // If cores are very similar, handle update relationships intelligently
  if (coreScore > 0.8) {
    if (hasUserUpdate && hasMeditationUpdate) {
      // Both have update indicators - BEST match (user wants updated, meditation is updated)
      console.log(`    🔄 PERFECT: Both have update indicators, core similarity: ${(coreScore * 100).toFixed(1)}%`);
      return coreScore * 1.0; // Full score for perfect version match
    } else if (hasUserUpdate && !hasMeditationUpdate) {
      // User wants updated but meditation is original - POOR match
      console.log(`    🔄 MISMATCH: User wants updated, meditation is original, core similarity: ${(coreScore * 100).toFixed(1)}%`);
      return coreScore * 0.3; // Heavy penalty - user specifically wants updated version
    } else if (!hasUserUpdate && hasMeditationUpdate) {
      // User has original but meditation is updated - MODERATE match
      console.log(`    🔄 PARTIAL: User has original, meditation is updated, core similarity: ${(coreScore * 100).toFixed(1)}%`);
      return coreScore * 0.7; // Some penalty - might be acceptable fallback
    } else {
      // Neither has update indicators - both are original versions - GOOD match
      console.log(`    🔄 ORIGINAL: Both are original versions, core similarity: ${(coreScore * 100).toFixed(1)}%`);
      return coreScore * 0.9; // High score for matching original versions
    }
  }
  
  return 0;
}

/**
 * Remove update indicators from text
 */
function removeUpdateIndicators(text: string): string {
  let cleaned = text;
  for (const indicator of UPDATE_INDICATORS) {
    const pattern = new RegExp(`\\b${indicator}\\b`, 'gi');
    cleaned = cleaned.replace(pattern, '');
  }
  return cleaned.replace(/\s+/g, ' ').trim();
}

/**
 * Remove keywords from text for base comparison
 */
function removeKeywords(text: string, keywords: string[]): string {
  let cleaned = text;
  for (const keyword of keywords) {
    const pattern = new RegExp(`\\b${keyword}\\b`, 'gi');
    cleaned = cleaned.replace(pattern, '');
  }
  return cleaned.replace(/\s+/g, ' ').trim();
}

/**
 * Calculate exact keyword match score for important distinguishing terms
 * Prioritizes meditations that contain exact keyword matches like "breath", "walking", "music only"
 */
function calculateExactKeywordScore(userText: string, meditationText: string): number {
  // Important keywords that distinguish meditation variants
  const CRITICAL_KEYWORDS = [
    'breath', 'breathwork',
    'walking', 'walk',
    'music', 'music only',
    'updated', 'update',
    'morning', 'evening',
    'short', 'long',
  ];

  const userWords = userText.toLowerCase().split(/\s+/);
  const meditationWords = meditationText.toLowerCase().split(/\s+/);

  let matchedKeywords = 0;
  let totalKeywordsInUser = 0;

  // Count how many critical keywords appear in user text
  for (const keyword of CRITICAL_KEYWORDS) {
    const keywordParts = keyword.split(/\s+/);
    const userHasKeyword = keywordParts.every(part => userWords.includes(part));
    const meditationHasKeyword = keywordParts.every(part => meditationWords.includes(part));

    if (userHasKeyword) {
      totalKeywordsInUser++;
      if (meditationHasKeyword) {
        matchedKeywords++;
      }
    }
  }

  // If user has critical keywords, they MUST match
  if (totalKeywordsInUser > 0) {
    const keywordMatchRate = matchedKeywords / totalKeywordsInUser;

    // Perfect keyword match + high base similarity = excellent match
    if (keywordMatchRate === 1.0) {
      // Check base similarity (without keywords)
      const userWithoutKeywords = removeKeywords(userText, CRITICAL_KEYWORDS);
      const meditationWithoutKeywords = removeKeywords(meditationText, CRITICAL_KEYWORDS);
      const baseSimilarity = calculateEditDistanceSimilarity(userWithoutKeywords, meditationWithoutKeywords);

      if (baseSimilarity > 0.7) {
        console.log(`    🎯 KEYWORD MATCH: All ${totalKeywordsInUser} keywords matched, base similarity: ${(baseSimilarity * 100).toFixed(1)}%`);
        return 0.95; // Very high score for exact keyword + good base match
      }
    } else {
      // Keywords present but DON'T match = penalty
      console.log(`    ⚠️ KEYWORD MISMATCH: Only ${matchedKeywords}/${totalKeywordsInUser} keywords matched`);
      return 0.3; // Low score for keyword mismatch
    }
  }

  return 0; // No critical keywords in user text, skip this strategy
}

/**
 * Traditional fuzzy matching methods
 */
function calculateTraditionalFuzzy(userText: string, meditationText: string, sourceText: string): number {
  // Word overlap similarity
  const userWords = removeCommonWords(userText);
  const meditationWords = removeCommonWords(meditationText);
  const sourceWords = sourceText ? removeCommonWords(sourceText) : [];
  
  const wordSimilarity = Math.max(
    calculateWordOverlapSimilarity(userWords, meditationWords),
    sourceWords.length > 0 ? calculateWordOverlapSimilarity(userWords, sourceWords) : 0
  );
  
  // Edit distance similarity
  const editSimilarity = Math.max(
    calculateEditDistanceSimilarity(userText, meditationText),
    sourceText ? calculateEditDistanceSimilarity(userText, sourceText) : 0
  );
  
  // Containment similarity
  const containsSimilarity = Math.max(
    calculateContainmentSimilarity(userText, meditationText),
    sourceText ? calculateContainmentSimilarity(userText, sourceText) : 0
  );
  
  return Math.max(wordSimilarity, editSimilarity, containsSimilarity);
}

/**
 * Remove common words that don't help with matching
 */
function removeCommonWords(text: string): string[] {
  const commonWords = [
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'meditation', 'med', 'audio', 'track', 'guided', 'dr', 'joe', 'dispenza'
  ];
  return text.split(' ').filter(word => word.length > 2 && !commonWords.includes(word.toLowerCase()));
}

/**
 * Calculate word overlap similarity using Jaccard index
 */
function calculateWordOverlapSimilarity(words1: string[], words2: string[]): number {
  if (words1.length === 0 || words2.length === 0) return 0;
  
  const set1 = new Set(words1.map(w => w.toLowerCase()));
  const set2 = new Set(words2.map(w => w.toLowerCase()));
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

/**
 * Calculate containment similarity
 */
function calculateContainmentSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0;
  
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.includes(shorter)) {
    return shorter.length / longer.length;
  }
  
  return 0;
}

/**
 * Calculate edit distance similarity using Levenshtein distance
 */
function calculateEditDistanceSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0;
  if (str1 === str2) return 1;
  
  const longer = str1.length > str2.length ? str1 : str2;
  const editDistance = levenshteinDistance(str1, str2);
  const maxLength = longer.length;
  
  return 1 - (editDistance / maxLength);
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

// Export helper functions for testing
export { expandSeriesAbbreviations, numbersMatch, romanToArabic };