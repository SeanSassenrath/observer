import {DocumentPickerResponse} from 'react-native-document-picker';
import {AudioFingerprint} from '../utils/meditationFingerprintStorage';
import {analyzeAudioFile} from '../utils/audioFileAnalysis';
import {
  findBestFingerprintMatch,
  FingerprintMatchResult,
  MatchingOptions,
  validateFingerprintQuality,
} from '../utils/fingerprintMatching';
import {makeFilePathData} from '../utils/filePicker';

export interface MeditationMatchResult {
  file: DocumentPickerResponse;
  meditation: {
    baseKey: string;
    name: string;
    confidence: number;
  } | null;
  matchMethod: 'fingerprint' | 'size' | 'manual' | 'failed';
  fingerprint?: AudioFingerprint;
  fingerprintMatch?: FingerprintMatchResult;
  sizeMatch?: any;
  processingTime: number;
  error?: string;
}

export interface MatchingProgress {
  current: number;
  total: number;
  currentFile: string;
  phase: 'analyzing' | 'fingerprinting' | 'size_matching' | 'complete';
}

export interface MeditationMatcherOptions {
  enableFingerprinting: boolean;
  enableSizeMatching: boolean;
  fingerprintOptions: Partial<MatchingOptions>;
  processingTimeout: number; // milliseconds
}

const DEFAULT_MATCHER_OPTIONS: MeditationMatcherOptions = {
  enableFingerprinting: true,
  enableSizeMatching: true,
  fingerprintOptions: {
    confidenceThreshold: 0.75,
    maxResults: 3,
  },
  processingTimeout: 30000, // 30 seconds max per file
};

export class MeditationMatcher {
  private options: MeditationMatcherOptions;

  constructor(options: Partial<MeditationMatcherOptions> = {}) {
    this.options = {...DEFAULT_MATCHER_OPTIONS, ...options};
  }

  /**
   * Match a single meditation file using all available methods
   */
  async matchSingleFile(
    file: DocumentPickerResponse,
    progressCallback?: (phase: string) => void
  ): Promise<MeditationMatchResult> {
    const startTime = Date.now();
    const result: MeditationMatchResult = {
      file,
      meditation: null,
      matchMethod: 'failed',
      processingTime: 0,
    };

    try {
      // Phase 1: Try fingerprint matching first (if enabled)
      if (this.options.enableFingerprinting && file.fileCopyUri) {
        progressCallback?.('Analyzing audio fingerprint...');
        
        try {
          const audioAnalysis = await this.timeoutPromise(
            analyzeAudioFile(file.fileCopyUri),
            this.options.processingTimeout
          );
          
          result.fingerprint = audioAnalysis.fingerprint;
          
          // Validate fingerprint quality
          const quality = validateFingerprintQuality(audioAnalysis.fingerprint);
          
          if (quality.isValid) {
            progressCallback?.('Matching fingerprint...');
            
            const fingerprintMatches = await findBestFingerprintMatch(
              audioAnalysis.fingerprint,
              this.options.fingerprintOptions
            );
            
            if (fingerprintMatches.length > 0) {
              const bestMatch = fingerprintMatches[0];
              result.fingerprintMatch = bestMatch;
              result.meditation = {
                baseKey: bestMatch.meditationId,
                name: bestMatch.meditationId, // TODO: Get actual name from database
                confidence: bestMatch.confidence,
              };
              result.matchMethod = 'fingerprint';
              result.processingTime = Date.now() - startTime;
              return result;
            }
          } else {
            console.warn(`Low quality fingerprint for ${file.name}:`, quality.issues);
          }
        } catch (fingerprintError) {
          console.warn(`Fingerprint analysis failed for ${file.name}:`, fingerprintError);
        }
      }

      // Phase 2: Fall back to size matching (if enabled)
      if (this.options.enableSizeMatching) {
        progressCallback?.('Trying size-based matching...');
        
        const sizeMatch = makeFilePathData(file);
        if (sizeMatch) {
          const baseKey = Object.keys(sizeMatch)[0];
          result.sizeMatch = sizeMatch;
          result.meditation = {
            baseKey,
            name: baseKey, // TODO: Get actual name from meditation data
            confidence: 0.95, // High confidence for exact size matches
          };
          result.matchMethod = 'size';
          result.processingTime = Date.now() - startTime;
          return result;
        }
      }

      // Phase 3: No automatic match found
      progressCallback?.('No automatic match found');
      result.matchMethod = 'manual';
      result.processingTime = Date.now() - startTime;
      return result;

    } catch (error) {
      result.error = error instanceof Error ? error.message : 'Unknown error';
      result.processingTime = Date.now() - startTime;
      return result;
    }
  }

  /**
   * Match multiple meditation files with progress tracking
   */
  async matchMultipleFiles(
    files: DocumentPickerResponse[],
    progressCallback?: (progress: MatchingProgress) => void
  ): Promise<MeditationMatchResult[]> {
    const results: MeditationMatchResult[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      progressCallback?.({
        current: i + 1,
        total: files.length,
        currentFile: file.name || 'Unknown file',
        phase: 'analyzing',
      });
      
      const fileProgressCallback = (phase: string) => {
        progressCallback?.({
          current: i + 1,
          total: files.length,
          currentFile: file.name || 'Unknown file',
          phase: phase.includes('fingerprint') ? 'fingerprinting' : 
                  phase.includes('size') ? 'size_matching' : 'analyzing',
        });
      };
      
      const result = await this.matchSingleFile(file, fileProgressCallback);
      results.push(result);
    }
    
    progressCallback?.({
      current: files.length,
      total: files.length,
      currentFile: 'Complete',
      phase: 'complete',
    });
    
    return results;
  }

  /**
   * Get matching statistics for analysis
   */
  getMatchingStats(results: MeditationMatchResult[]): {
    total: number;
    fingerprint: number;
    size: number;
    manual: number;
    failed: number;
    avgConfidence: number;
    avgProcessingTime: number;
  } {
    const stats = {
      total: results.length,
      fingerprint: 0,
      size: 0,
      manual: 0,
      failed: 0,
      avgConfidence: 0,
      avgProcessingTime: 0,
    };
    
    let totalConfidence = 0;
    let totalProcessingTime = 0;
    
    results.forEach(result => {
      switch (result.matchMethod) {
        case 'fingerprint':
          stats.fingerprint++;
          break;
        case 'size':
          stats.size++;
          break;
        case 'manual':
          stats.manual++;
          break;
        case 'failed':
          stats.failed++;
          break;
      }
      
      if (result.meditation) {
        totalConfidence += result.meditation.confidence;
      }
      
      totalProcessingTime += result.processingTime;
    });
    
    stats.avgConfidence = totalConfidence / Math.max(1, results.length - stats.failed);
    stats.avgProcessingTime = totalProcessingTime / results.length;
    
    return stats;
  }


  /**
   * Timeout wrapper for async operations
   */
  private timeoutPromise<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
      ),
    ]);
  }
}

/**
 * Default matcher instance for easy usage
 */
export const defaultMeditationMatcher = new MeditationMatcher();

/**
 * Quick helper for single file matching
 */
export const matchMeditationFile = async (
  file: DocumentPickerResponse,
  options?: Partial<MeditationMatcherOptions>
): Promise<MeditationMatchResult> => {
  const matcher = new MeditationMatcher(options);
  return matcher.matchSingleFile(file);
};