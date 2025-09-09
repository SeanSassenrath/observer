import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';
import RNFS from 'react-native-fs';
import {TranscriptionExcerpt} from './meditationFingerprintStorage';

export interface TranscriptionOptions {
  language: string;
  maxResults: number;
  partialResults: boolean;
  continuous: boolean;
  excerptDuration: number; // seconds for each excerpt
}

export interface AudioTranscriptionResult {
  excerpts: TranscriptionExcerpt[];
  fullTranscription: string;
  confidence: number; // overall confidence score
  processingTime: number; // milliseconds
}

export interface TranscriptionProgress {
  current: number;
  total: number;
  currentExcerpt: string;
  phase: 'initializing' | 'processing' | 'analyzing' | 'complete';
}

const DEFAULT_OPTIONS: TranscriptionOptions = {
  language: 'en-US',
  maxResults: 1,
  partialResults: false,
  continuous: true,
  excerptDuration: 30,
};

export class SpeechTranscriber {
  private isListening = false;
  private currentTranscription = '';
  private transcriptionResults: string[] = [];
  private startTime = 0;
  private options: TranscriptionOptions;
  private isInitialized = false;

  constructor(options: Partial<TranscriptionOptions> = {}) {
    this.options = {...DEFAULT_OPTIONS, ...options};
  }

  private async initializeVoice() {
    if (this.isInitialized) return;
    
    try {
      // Destroy any existing instance first
      await Voice.destroy();
      this.setupVoiceListeners();
      this.isInitialized = true;
    } catch (error) {
      console.warn('Voice initialization warning (expected on first run):', error);
      this.setupVoiceListeners();
      this.isInitialized = true;
    }
  }

  private setupVoiceListeners() {
    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
    Voice.onSpeechError = this.onSpeechError.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
  }

  private onSpeechStart(e: any) {
    console.log('Speech recognition started', e);
    this.startTime = Date.now();
  }

  private onSpeechRecognized(e: SpeechRecognizedEvent) {
    console.log('Speech recognized', e);
  }

  private onSpeechEnd(e: any) {
    console.log('Speech recognition ended', e);
    this.isListening = false;
  }

  private onSpeechError(e: SpeechErrorEvent) {
    console.log('Speech recognition error', e);
    this.isListening = false;
  }

  private onSpeechResults(e: SpeechResultsEvent) {
    console.log('Speech results', e);
    if (e.value && e.value.length > 0) {
      this.transcriptionResults = e.value;
      this.currentTranscription = e.value[0];
    }
  }

  private onSpeechPartialResults(e: SpeechResultsEvent) {
    if (this.options.partialResults && e.value && e.value.length > 0) {
      this.currentTranscription = e.value[0];
    }
  }

  async startTranscription(): Promise<void> {
    try {
      await this.initializeVoice();
      
      if (this.isListening) {
        await this.stopTranscription();
      }

      await Voice.start(this.options.language);
      this.isListening = true;
      this.transcriptionResults = [];
      this.currentTranscription = '';
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      throw new Error(`Speech recognition failed: ${error}`);
    }
  }

  async stopTranscription(): Promise<string> {
    try {
      if (this.isListening) {
        await Voice.stop();
        this.isListening = false;
      }
      return this.currentTranscription;
    } catch (error) {
      console.error('Failed to stop speech recognition:', error);
      return this.currentTranscription;
    }
  }

  getCurrentTranscription(): string {
    return this.currentTranscription;
  }

  getResults(): string[] {
    return this.transcriptionResults;
  }

  async cleanup(): Promise<void> {
    try {
      if (this.isListening) {
        await Voice.stop();
      }
      await Voice.destroy();
      this.isListening = false;
      this.transcriptionResults = [];
      this.currentTranscription = '';
    } catch (error) {
      console.error('Failed to cleanup speech recognition:', error);
    }
  }
}

/**
 * Transcribe audio file by analyzing segments
 * Note: This is a simplified implementation. Real file transcription would require
 * audio playback coordination with speech recognition timing.
 */
export const transcribeAudioFile = async (
  filePath: string,
  options: Partial<TranscriptionOptions> = {},
  progressCallback?: (progress: TranscriptionProgress) => void
): Promise<AudioTranscriptionResult> => {
  const config = {...DEFAULT_OPTIONS, ...options};
  const startTime = Date.now();
  
  try {
    progressCallback?.({
      current: 0,
      total: 3,
      currentExcerpt: 'Initializing...',
      phase: 'initializing',
    });

    // Get file info for duration estimation
    const fileInfo = await RNFS.stat(filePath);
    const estimatedDurationMinutes = Math.max(10, Math.min(120, Math.floor(fileInfo.size / 1000000))); // Rough estimation
    const estimatedDuration = estimatedDurationMinutes * 60;

    // For now, generate mock transcription excerpts based on file characteristics
    // TODO: Replace with actual audio file transcription when audio playback integration is available
    const excerpts = await generateMockTranscriptionExcerpts(
      filePath,
      estimatedDuration,
      config,
      progressCallback
    );

    const fullTranscription = excerpts.map(excerpt => excerpt.text).join(' ');
    const avgConfidence = excerpts.reduce((sum, excerpt) => sum + excerpt.confidence, 0) / excerpts.length;
    
    progressCallback?.({
      current: 3,
      total: 3,
      currentExcerpt: 'Complete!',
      phase: 'complete',
    });

    return {
      excerpts,
      fullTranscription,
      confidence: avgConfidence,
      processingTime: Date.now() - startTime,
    };

  } catch (error) {
    console.error('Transcription failed:', error);
    throw new Error(`Audio transcription failed: ${error}`);
  }
};

/**
 * Generate mock transcription excerpts for testing
 * TODO: Replace with real transcription logic
 */
const generateMockTranscriptionExcerpts = async (
  filePath: string,
  estimatedDuration: number,
  options: TranscriptionOptions,
  progressCallback?: (progress: TranscriptionProgress) => void
): Promise<TranscriptionExcerpt[]> => {
  const fileName = filePath.split('/').pop()?.toLowerCase() || '';
  const excerpts: TranscriptionExcerpt[] = [];

  // Generate 3 excerpts: beginning, middle, end
  const excerptPoints = [
    { start: 0, end: options.excerptDuration, label: 'Opening' },
    { start: Math.floor(estimatedDuration / 2) - 15, end: Math.floor(estimatedDuration / 2) + 15, label: 'Middle' },
    { start: Math.max(0, estimatedDuration - options.excerptDuration), end: estimatedDuration, label: 'Closing' },
  ];

  for (let i = 0; i < excerptPoints.length; i++) {
    const point = excerptPoints[i];
    
    progressCallback?.({
      current: i + 1,
      total: 3,
      currentExcerpt: `Processing ${point.label}`,
      phase: 'processing',
    });

    // Generate contextual transcription based on filename and position
    const text = generateContextualTranscription(fileName, point.label, i);
    
    excerpts.push({
      startTime: point.start,
      endTime: point.end,
      text,
      confidence: 0.85 + Math.random() * 0.12, // 85-97% confidence
    });

    // Small delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  return excerpts;
};

/**
 * Generate contextual transcription text based on filename patterns
 */
const generateContextualTranscription = (fileName: string, position: string, index: number): string => {
  // Meditation-specific content based on filename patterns
  if (fileName.includes('energy') || fileName.includes('botec') || fileName.includes('bec')) {
    const texts = [
      "Welcome to this meditation on blessing the energy centers. Find a comfortable position and close your eyes.",
      "Now bring your attention to your heart center. Feel the energy moving through your chest, expanding with each breath.",
      "Take a moment to feel gratitude for this practice. When you're ready, slowly open your eyes."
    ];
    return texts[index] || texts[0];
  }

  if (fileName.includes('breath') || fileName.includes('breathing')) {
    const texts = [
      "Welcome to this breathwork session. We're going to work with the breath to elevate your energy.",
      "Feel the breath moving through your body. Let each inhale bring in new possibilities, each exhale release the old.",
      "Continue to breathe deeply. When you're ready, return your attention to the room around you."
    ];
    return texts[index] || texts[0];
  }

  if (fileName.includes('heart') || fileName.includes('love')) {
    const texts = [
      "Welcome to this heart-centered meditation. Place your attention on your heart space.",
      "Feel your heart opening. Allow love and compassion to flow through every cell of your being.",
      "Carry this heart energy with you. When you're ready, gently open your eyes."
    ];
    return texts[index] || texts[0];
  }

  if (fileName.includes('abundance') || fileName.includes('generating')) {
    const texts = [
      "Welcome to this meditation on generating abundance. Prepare to feel the energy of prosperity.",
      "Feel abundance flowing through you. You are worthy of receiving all that your heart desires.",
      "Embody this feeling of abundance. When you're ready, open your eyes and step into your abundant future."
    ];
    return texts[index] || texts[0];
  }

  if (fileName.includes('walking') || fileName.includes('walk')) {
    const texts = [
      "Welcome to this walking meditation. We're going to practice embodying your future self with every step.",
      "Feel yourself walking into your new future. Each step is a declaration of who you're becoming.",
      "Continue walking in this elevated energy. When you're ready, complete your walking practice."
    ];
    return texts[index] || texts[0];
  }

  // Default meditation content
  const defaultTexts = [
    "Welcome to this meditation. Find a comfortable position and allow yourself to relax deeply.",
    "Bring your attention inward. Feel the energy of possibility flowing through every part of your being.",
    "Take this energy with you as you return to your day. When you're ready, slowly open your eyes."
  ];
  
  return defaultTexts[index] || defaultTexts[0];
};

/**
 * Test live speech recognition
 */
export const testLiveSpeechRecognition = async (
  durationSeconds: number = 10,
  options: Partial<TranscriptionOptions> = {}
): Promise<{transcription: string; confidence: number}> => {
  // Check if speech recognition is available first
  const available = await isSpeechRecognitionAvailable();
  if (!available) {
    throw new Error('Speech recognition is not available on this device');
  }
  
  const transcriber = new SpeechTranscriber(options);
  
  try {
    await transcriber.startTranscription();
    
    // Record for specified duration
    await new Promise(resolve => setTimeout(resolve, durationSeconds * 1000));
    
    const transcription = await transcriber.stopTranscription();
    const results = transcriber.getResults();
    
    // Calculate confidence (mock for now)
    const confidence = transcription.length > 0 ? 0.90 : 0.0;
    
    return {
      transcription: transcription || 'No speech detected',
      confidence,
    };
    
  } finally {
    await transcriber.cleanup();
  }
};

/**
 * Check if speech recognition is available on device
 */
export const isSpeechRecognitionAvailable = async (): Promise<boolean> => {
  try {
    // First try to destroy any existing instance to clear NativeEventEmitter issues
    await Voice.destroy().catch(() => {});
    
    const available = await Voice.isAvailable();
    return available === '1' || available === true;
  } catch (error) {
    console.error('Error checking speech recognition availability:', error);
    return false;
  }
};

/**
 * Get available speech recognition languages
 */
export const getAvailableLanguages = async (): Promise<string[]> => {
  try {
    const languages = await Voice.getSupportedLocales();
    return languages || ['en-US'];
  } catch (error) {
    console.error('Error getting available languages:', error);
    return ['en-US'];
  }
};

/**
 * Calculate text similarity between two strings
 * Used for matching transcriptions to reference text
 */
export const calculateTextSimilarity = (text1: string, text2: string): number => {
  if (!text1 || !text2) return 0;
  
  const normalize = (str: string) => 
    str.toLowerCase()
       .replace(/[^\w\s]/g, '') // Remove punctuation
       .replace(/\s+/g, ' ')    // Normalize whitespace
       .trim();

  const normalized1 = normalize(text1);
  const normalized2 = normalize(text2);
  
  if (normalized1 === normalized2) return 1.0;
  
  // Simple word-based similarity
  const words1 = normalized1.split(' ');
  const words2 = normalized2.split(' ');
  
  const commonWords = words1.filter(word => 
    word.length > 2 && words2.includes(word)
  );
  
  const similarity = commonWords.length / Math.max(words1.length, words2.length);
  return Math.min(1.0, similarity);
};

/**
 * Find best matching transcription excerpt from reference database
 */
export const findBestTranscriptionMatch = (
  userExcerpts: TranscriptionExcerpt[],
  referenceExcerpts: TranscriptionExcerpt[]
): {match: TranscriptionExcerpt | null; confidence: number; similarityScore: number} => {
  if (!userExcerpts.length || !referenceExcerpts.length) {
    return {match: null, confidence: 0, similarityScore: 0};
  }

  let bestMatch: TranscriptionExcerpt | null = null;
  let bestSimilarity = 0;
  let bestConfidence = 0;

  // Compare each user excerpt with each reference excerpt
  for (const userExcerpt of userExcerpts) {
    for (const refExcerpt of referenceExcerpts) {
      const similarity = calculateTextSimilarity(userExcerpt.text, refExcerpt.text);
      
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
        bestMatch = refExcerpt;
        bestConfidence = Math.min(userExcerpt.confidence, refExcerpt.confidence);
      }
    }
  }

  return {
    match: bestMatch,
    confidence: bestConfidence,
    similarityScore: bestSimilarity,
  };
};

/**
 * Batch transcribe multiple audio files
 */
export const batchTranscribeAudioFiles = async (
  filePaths: string[],
  options?: Partial<TranscriptionOptions>,
  progressCallback?: (overall: number, total: number, current: string) => void
): Promise<AudioTranscriptionResult[]> => {
  const results: AudioTranscriptionResult[] = [];
  
  for (let i = 0; i < filePaths.length; i++) {
    const filePath = filePaths[i];
    const fileName = filePath.split('/').pop() || 'unknown';
    
    progressCallback?.(i + 1, filePaths.length, fileName);
    
    try {
      const result = await transcribeAudioFile(filePath, options);
      results.push(result);
    } catch (error) {
      console.error(`Failed to transcribe ${fileName}:`, error);
      // Add empty result for failed transcriptions
      results.push({
        excerpts: [],
        fullTranscription: '',
        confidence: 0,
        processingTime: 0,
      });
    }
    
    // Small delay between files
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return results;
};