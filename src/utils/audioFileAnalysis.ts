import RNFS from 'react-native-fs';
import {AudioFingerprint} from './meditationFingerprintStorage';

export interface AudioFileAnalysisResult {
  fingerprint: AudioFingerprint;
  filePath: string;
  fileName: string;
  fileSize: number;
}

export interface AudioFileAnalysisOptions {
  analysisWindowSize: number; // seconds to analyze from start
  sampleRate: number;
  peakCount: number; // number of frequency peaks to extract
}

const DEFAULT_OPTIONS: AudioFileAnalysisOptions = {
  analysisWindowSize: 30,
  sampleRate: 44100,
  peakCount: 50,
};

/**
 * Analyze an audio file and generate fingerprint
 * This is a simplified version - in production you'd want proper audio decoding
 */
export const analyzeAudioFile = async (
  filePath: string,
  options: Partial<AudioFileAnalysisOptions> = {}
): Promise<AudioFileAnalysisResult> => {
  const config = {...DEFAULT_OPTIONS, ...options};
  
  try {
    // Get file info
    const fileInfo = await RNFS.stat(filePath);
    const fileName = filePath.split('/').pop() || 'unknown';
    
    // For now, generate deterministic fingerprint based on file characteristics
    // TODO: Replace with actual audio analysis once we have proper audio decoding
    const fingerprint = await generateFileFingerprintFromMetadata(
      filePath,
      fileInfo.size,
      config
    );
    
    return {
      fingerprint,
      filePath,
      fileName,
      fileSize: fileInfo.size,
    };
  } catch (error) {
    throw new Error(`Failed to analyze audio file ${filePath}: ${error}`);
  }
};

/**
 * Generate audio fingerprint from file metadata (temporary solution)
 * TODO: Replace with real audio analysis
 */
const generateFileFingerprintFromMetadata = async (
  filePath: string,
  fileSize: number,
  options: AudioFileAnalysisOptions
): Promise<AudioFingerprint> => {
  // Generate deterministic hash based on file characteristics
  const fileName = filePath.split('/').pop() || '';
  const seedString = `${fileName}-${fileSize}-${options.sampleRate}`;
  
  // Create deterministic peaks based on file characteristics
  const peaks = generateDeterministicPeaks(seedString, options.peakCount);
  
  // Generate hashes
  const hash = generateHash(seedString + '-audio');
  const spectralHash = generateHash(seedString + '-spectral');
  
  return {
    hash,
    duration: options.analysisWindowSize,
    sampleRate: options.sampleRate,
    peaks,
    spectralHash,
    createdAt: new Date().toISOString(),
  };
};

/**
 * Generate deterministic peaks for consistent fingerprinting
 */
const generateDeterministicPeaks = (
  seedString: string,
  peakCount: number
): number[] => {
  const peaks: number[] = [];
  let seed = 0;
  
  // Convert string to numeric seed
  for (let i = 0; i < seedString.length; i++) {
    seed += seedString.charCodeAt(i);
  }
  
  // Generate deterministic "random" peak values
  for (let i = 0; i < peakCount; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    const normalized = seed / 233280;
    peaks.push(0.1 + normalized * 0.8); // Scale to 0.1-0.9 range
  }
  
  return peaks;
};

/**
 * Generate deterministic hash
 */
const generateHash = (input: string): string => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).padStart(12, '0');
};

/**
 * Batch analyze multiple audio files
 */
export const batchAnalyzeAudioFiles = async (
  filePaths: string[],
  options?: Partial<AudioFileAnalysisOptions>,
  progressCallback?: (current: number, total: number, fileName: string) => void
): Promise<AudioFileAnalysisResult[]> => {
  const results: AudioFileAnalysisResult[] = [];
  
  for (let i = 0; i < filePaths.length; i++) {
    const filePath = filePaths[i];
    const fileName = filePath.split('/').pop() || 'unknown';
    
    progressCallback?.(i + 1, filePaths.length, fileName);
    
    try {
      const result = await analyzeAudioFile(filePath, options);
      results.push(result);
    } catch (error) {
      console.error(`Failed to analyze ${fileName}:`, error);
      // Continue with other files even if one fails
    }
    
    // Small delay to prevent blocking the UI
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
};