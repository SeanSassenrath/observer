import {
  AudioFingerprint,
  MeditationFingerprint,
  loadMeditationFingerprints,
} from './meditationFingerprintStorage';
import {loadStaticFingerprintDatabase} from './staticFingerprintDatabase';
import {calculateNameSimilarity} from './fuzzyMeditationMatching';
import {meditationBaseMap} from '../constants/meditation-data';
import {MeditationBase} from '../types';

export interface FingerprintMatchResult {
  meditationId: string;
  confidence: number;
  matchType: 'hash' | 'spectral' | 'peaks' | 'duration' | 'combined';
  details: {
    hashSimilarity: number;
    spectralSimilarity: number;
    peaksSimilarity: number;
    durationSimilarity: number;
    combinedScore: number;
  };
}

export interface MatchingOptions {
  hashWeight: number;
  spectralWeight: number;
  peaksWeight: number;
  durationWeight: number;
  confidenceThreshold: number;
  maxResults: number;
}

const DEFAULT_MATCHING_OPTIONS: MatchingOptions = {
  hashWeight: 0.3,
  spectralWeight: 0.3,
  peaksWeight: 0.25,
  durationWeight: 0.15,
  confidenceThreshold: 0.7,
  maxResults: 5,
};

/**
 * Calculate similarity between two hash strings
 */
export const calculateHashSimilarity = (hash1: string, hash2: string): number => {
  if (!hash1 || !hash2 || hash1.length !== hash2.length) {
    return 0;
  }

  let matches = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] === hash2[i]) {
      matches++;
    }
  }

  return matches / hash1.length;
};

/**
 * Calculate spectral hash similarity
 */
export const calculateSpectralSimilarity = (spectral1: string, spectral2: string): number => {
  if (!spectral1 || !spectral2) {
    return 0;
  }

  // For spectral hashes, exact match is most important
  if (spectral1 === spectral2) {
    return 1.0;
  }

  // Partial similarity for close spectral characteristics
  return calculateHashSimilarity(spectral1, spectral2);
};

/**
 * Calculate peaks similarity using correlation analysis
 */
export const calculatePeaksSimilarity = (peaks1: number[], peaks2: number[]): number => {
  if (!peaks1.length || !peaks2.length) {
    return 0;
  }

  // Normalize peak arrays to same length for comparison
  const maxLength = Math.max(peaks1.length, peaks2.length);
  const minLength = Math.min(peaks1.length, peaks2.length);
  
  // Calculate correlation on overlapping portion
  let correlation = 0;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
  
  for (let i = 0; i < minLength; i++) {
    const x = peaks1[i];
    const y = peaks2[i];
    
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
    sumY2 += y * y;
  }
  
  const numerator = (minLength * sumXY) - (sumX * sumY);
  const denominator = Math.sqrt(
    ((minLength * sumX2) - (sumX * sumX)) * 
    ((minLength * sumY2) - (sumY * sumY))
  );
  
  if (denominator === 0) {
    return 0;
  }
  
  correlation = Math.abs(numerator / denominator);
  
  // Penalize for significant length differences
  const lengthPenalty = minLength / maxLength;
  
  return correlation * lengthPenalty;
};

/**
 * Calculate duration similarity (meditation length matching)
 */
export const calculateDurationSimilarity = (duration1: number, duration2: number): number => {
  if (duration1 <= 0 || duration2 <= 0) {
    return 0;
  }

  const longer = Math.max(duration1, duration2);
  const shorter = Math.min(duration1, duration2);
  
  // Allow for 5% variance in duration (encoding differences)
  const variance = longer * 0.05;
  const difference = longer - shorter;
  
  if (difference <= variance) {
    return 1.0;
  }
  
  // Gradual decline for larger differences
  const maxAllowedDifference = longer * 0.2; // 20% max difference
  if (difference >= maxAllowedDifference) {
    return 0;
  }
  
  return 1 - (difference / maxAllowedDifference);
};

/**
 * Compare two audio fingerprints and calculate detailed similarity
 */
export const compareFingerprintsDetailed = (
  fingerprint1: AudioFingerprint,
  fingerprint2: AudioFingerprint,
  options: Partial<MatchingOptions> = {}
): FingerprintMatchResult['details'] => {
  const config = {...DEFAULT_MATCHING_OPTIONS, ...options};
  
  const hashSimilarity = calculateHashSimilarity(fingerprint1.hash, fingerprint2.hash);
  const spectralSimilarity = calculateSpectralSimilarity(fingerprint1.spectralHash, fingerprint2.spectralHash);
  const peaksSimilarity = calculatePeaksSimilarity(fingerprint1.peaks, fingerprint2.peaks);
  const durationSimilarity = calculateDurationSimilarity(fingerprint1.duration, fingerprint2.duration);
  
  const combinedScore = (
    (hashSimilarity * config.hashWeight) +
    (spectralSimilarity * config.spectralWeight) +
    (peaksSimilarity * config.peaksWeight) +
    (durationSimilarity * config.durationWeight)
  );
  
  return {
    hashSimilarity,
    spectralSimilarity,
    peaksSimilarity,
    durationSimilarity,
    combinedScore,
  };
};

/**
 * Find best matching meditation using name-based fuzzy matching against complete meditation database
 */
export const findBestNameMatch = async (
  userFileName: string,
  options: Partial<MatchingOptions> = {}
): Promise<FingerprintMatchResult[]> => {
  const config = {...DEFAULT_MATCHING_OPTIONS, ...options};
  
  try {
    const results: FingerprintMatchResult[] = [];
    
    console.log(`🔍 Name-based matching for: "${userFileName}"`);
    console.log(`📚 Searching against ${Object.keys(meditationBaseMap).length} total supported meditations`);
    
    // Compare with each meditation in the complete meditation base map
    for (const [meditationId, meditation] of Object.entries(meditationBaseMap) as [string, MeditationBase][]) {
      const nameSimilarity = calculateNameSimilarity(userFileName, meditation.name);
      
      console.log(`📝 Checking "${meditation.name}": ${(nameSimilarity * 100).toFixed(1)}% similarity`);
      
      // Only include if similarity is above threshold AND greater than 0
      if (nameSimilarity > 0 && nameSimilarity >= config.confidenceThreshold) {
        const result: FingerprintMatchResult = {
          meditationId,
          confidence: nameSimilarity,
          matchType: 'combined', // Using 'combined' to represent name-based matching
          details: {
            hashSimilarity: nameSimilarity,
            spectralSimilarity: nameSimilarity,
            peaksSimilarity: nameSimilarity,
            durationSimilarity: nameSimilarity,
            combinedScore: nameSimilarity,
          },
        };
        
        results.push(result);
      }
    }
    
    // Sort by confidence (highest first) and limit results
    const finalResults = results
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, config.maxResults);
      
    console.log(`🏁 Found ${finalResults.length} name-based matches from complete meditation database`);
    if (finalResults.length > 0) {
      const bestMatch = meditationBaseMap[finalResults[0].meditationId];
      console.log(`  Best match: "${bestMatch?.name}" (${(finalResults[0].confidence * 100).toFixed(1)}%)`);
    }
    
    return finalResults;
      
  } catch (error) {
    console.error('Error finding name matches:', error);
    return [];
  }
};

/**
 * Find best matching meditation from reference database (legacy fingerprint method)
 */
export const findBestFingerprintMatch = async (
  userFingerprint: AudioFingerprint,
  options: Partial<MatchingOptions> = {}
): Promise<FingerprintMatchResult[]> => {
  const config = {...DEFAULT_MATCHING_OPTIONS, ...options};
  
  try {
    const referenceDatabase = await loadStaticFingerprintDatabase();
    const results: FingerprintMatchResult[] = [];
    
    // Compare with each meditation in database
    for (const [meditationId, meditation] of Object.entries(referenceDatabase)) {
      const details = compareFingerprintsDetailed(
        userFingerprint,
        meditation.audioFingerprint,
        options
      );
      
      // Determine primary match type based on highest individual score
      let matchType: FingerprintMatchResult['matchType'] = 'combined';
      if (details.hashSimilarity > 0.9) matchType = 'hash';
      else if (details.spectralSimilarity > 0.9) matchType = 'spectral';
      else if (details.peaksSimilarity > 0.8) matchType = 'peaks';
      else if (details.durationSimilarity > 0.95) matchType = 'duration';
      
      const result: FingerprintMatchResult = {
        meditationId,
        confidence: details.combinedScore,
        matchType,
        details,
      };
      
      // Only include results above threshold
      if (details.combinedScore >= config.confidenceThreshold) {
        results.push(result);
      }
    }
    
    // Sort by confidence (highest first) and limit results
    return results
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, config.maxResults);
      
  } catch (error) {
    console.error('Error finding fingerprint matches:', error);
    return [];
  }
};

/**
 * Quick fingerprint match for single best result
 */
export const quickFingerprintMatch = async (
  userFingerprint: AudioFingerprint,
  options: Partial<MatchingOptions> = {}
): Promise<FingerprintMatchResult | null> => {
  const matches = await findBestFingerprintMatch(userFingerprint, options);
  return matches.length > 0 ? matches[0] : null;
};

/**
 * Batch fingerprint matching for multiple files
 */
export const batchFingerprintMatching = async (
  userFingerprints: {fileName: string; fingerprint: AudioFingerprint}[],
  options: Partial<MatchingOptions> = {},
  progressCallback?: (current: number, total: number, fileName: string) => void
): Promise<{fileName: string; matches: FingerprintMatchResult[]}[]> => {
  const results: {fileName: string; matches: FingerprintMatchResult[]}[] = [];
  
  for (let i = 0; i < userFingerprints.length; i++) {
    const {fileName, fingerprint} = userFingerprints[i];
    
    progressCallback?.(i + 1, userFingerprints.length, fileName);
    
    try {
      const matches = await findBestFingerprintMatch(fingerprint, options);
      results.push({fileName, matches});
    } catch (error) {
      console.error(`Failed to match ${fileName}:`, error);
      results.push({fileName, matches: []});
    }
    
    // Small delay to prevent blocking
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  return results;
};

/**
 * Validate fingerprint quality before matching
 */
export const validateFingerprintQuality = (fingerprint: AudioFingerprint): {
  isValid: boolean;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  issues: string[];
} => {
  const issues: string[] = [];
  let qualityScore = 1.0;
  
  // Check hash validity
  if (!fingerprint.hash || fingerprint.hash.length < 8) {
    issues.push('Invalid or short hash');
    qualityScore -= 0.3;
  }
  
  // Check spectral hash
  if (!fingerprint.spectralHash || fingerprint.spectralHash.length < 8) {
    issues.push('Invalid spectral hash');
    qualityScore -= 0.2;
  }
  
  // Check peaks data
  if (!fingerprint.peaks || fingerprint.peaks.length < 10) {
    issues.push('Insufficient peak data');
    qualityScore -= 0.3;
  }
  
  // Check duration reasonableness
  if (fingerprint.duration < 60 || fingerprint.duration > 7200) { // 1 min to 2 hours
    issues.push('Unusual duration for meditation');
    qualityScore -= 0.1;
  }
  
  // Check sample rate
  if (fingerprint.sampleRate < 16000 || fingerprint.sampleRate > 48000) {
    issues.push('Unusual sample rate');
    qualityScore -= 0.1;
  }
  
  // Determine quality level
  let quality: 'excellent' | 'good' | 'fair' | 'poor';
  if (qualityScore >= 0.9) quality = 'excellent';
  else if (qualityScore >= 0.7) quality = 'good';
  else if (qualityScore >= 0.5) quality = 'fair';
  else quality = 'poor';
  
  return {
    isValid: qualityScore >= 0.5,
    quality,
    issues,
  };
};

/**
 * Debug fingerprint comparison with detailed breakdown
 */
export const debugFingerprintComparison = (
  fingerprint1: AudioFingerprint,
  fingerprint2: AudioFingerprint
): string => {
  const details = compareFingerprintsDetailed(fingerprint1, fingerprint2);
  
  return `
🔍 Fingerprint Comparison Debug:

📊 Hash Similarity: ${(details.hashSimilarity * 100).toFixed(1)}%
🎵 Spectral Similarity: ${(details.spectralSimilarity * 100).toFixed(1)}%
📈 Peaks Correlation: ${(details.peaksSimilarity * 100).toFixed(1)}%
⏱️ Duration Match: ${(details.durationSimilarity * 100).toFixed(1)}%

🎯 Combined Score: ${(details.combinedScore * 100).toFixed(1)}%

📋 Details:
- Hash 1: ${fingerprint1.hash}
- Hash 2: ${fingerprint2.hash}
- Spectral 1: ${fingerprint1.spectralHash}
- Spectral 2: ${fingerprint2.spectralHash}
- Duration 1: ${fingerprint1.duration}s
- Duration 2: ${fingerprint2.duration}s
- Peaks 1: ${fingerprint1.peaks.length} points
- Peaks 2: ${fingerprint2.peaks.length} points
  `;
};