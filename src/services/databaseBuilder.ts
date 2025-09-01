import {
  MeditationFingerprint,
  AudioFingerprint,
  TranscriptionExcerpt,
  saveMeditationFingerprints,
  loadMeditationFingerprints,
} from '../utils/meditationFingerprintStorage';

// Import all the meditation data from existing constants
import {
  BotecBaseKeys,
  BotecSizes,
  botecMap,
  BreakingHabitBaseKeys,
  BreakingHabitSizes,
  breakingHabitMap,
  BreathBaseKeys,
  BreathSizes,
  breathMap,
  DailyMeditationBaseKeys,
  DailyMeditationSizes,
  dailyMeditationMap,
  FoundationalBaseKeys,
  FoundationalSizes,
  foundationalMap,
  GeneratingBaseKeys,
  GeneratingSizes,
  generatingMap,
  OtherBaseKeys,
  OtherSizes,
  otherMap,
  SynchronizeBaseKeys,
  synchronizeMap,
  UnlockedBaseKeys,
  unlockedMap,
  WalkingBaseKeys,
  walkingMap,
  MeditationGroupName,
} from '../constants/meditation-data';

interface MeditationSourceData {
  baseKey: string;
  name: string;
  groupName: MeditationGroupName;
  formattedDuration: string; // "42" means 42 minutes
  fileSizeBytes?: number;
}

// Database building progress callback
export type DatabaseBuildProgress = {
  current: number;
  total: number;
  currentMeditation: string;
  phase: 'initializing' | 'processing' | 'generating_fingerprints' | 'generating_transcriptions' | 'saving' | 'complete';
};

export type ProgressCallback = (progress: DatabaseBuildProgress) => void;

/**
 * Generate a mock audio fingerprint for a meditation
 * In the future, this will be replaced with real audio analysis
 */
const generateMockAudioFingerprint = (
  meditationId: string,
  durationMinutes: number,
  fileSizeBytes?: number
): AudioFingerprint => {
  const duration = durationMinutes * 60; // Convert to seconds
  
  // Generate a deterministic but unique hash based on meditation ID
  const hash = generateDeterministicHash(meditationId, 'audio');
  const spectralHash = generateDeterministicHash(meditationId, 'spectral');
  
  // Generate mock peaks based on meditation characteristics
  const peaks = generateMockPeaks(meditationId, duration);
  
  return {
    hash,
    duration,
    sampleRate: 44100, // Standard CD quality
    peaks,
    spectralHash,
    createdAt: new Date().toISOString(),
  };
};

/**
 * Generate mock transcription excerpts for a meditation
 * In the future, this will be replaced with real speech-to-text analysis
 */
const generateMockTranscriptionExcerpts = (
  meditationId: string,
  name: string,
  groupName: MeditationGroupName,
  durationMinutes: number
): TranscriptionExcerpt[] => {
  const duration = durationMinutes * 60;
  const excerpts: TranscriptionExcerpt[] = [];
  
  // Opening excerpt (0-30 seconds)
  excerpts.push({
    startTime: 0,
    endTime: 30,
    text: generateOpeningText(groupName),
    confidence: 0.90 + Math.random() * 0.08, // 90-98% confidence
  });
  
  // Middle excerpt (meditation-specific content)
  const midPoint = Math.floor(duration / 2);
  excerpts.push({
    startTime: midPoint - 15,
    endTime: midPoint + 15,
    text: generateMiddleText(name, groupName),
    confidence: 0.85 + Math.random() * 0.10, // 85-95% confidence
  });
  
  // Closing excerpt (last 30 seconds)
  excerpts.push({
    startTime: duration - 30,
    endTime: duration,
    text: generateClosingText(),
    confidence: 0.88 + Math.random() * 0.10, // 88-98% confidence
  });
  
  return excerpts;
};

/**
 * Generate deterministic hash for consistent results
 */
const generateDeterministicHash = (input: string, type: string): string => {
  let hash = 0;
  const fullInput = `${input}-${type}`;
  
  for (let i = 0; i < fullInput.length; i++) {
    const char = fullInput.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(16).padStart(12, '0');
};

/**
 * Generate mock audio peaks based on meditation characteristics
 */
const generateMockPeaks = (meditationId: string, duration: number): number[] => {
  const peakCount = Math.min(50, Math.max(20, Math.floor(duration / 60))); // 20-50 peaks
  const peaks: number[] = [];
  
  // Use meditation ID to seed deterministic randomness
  let seed = 0;
  for (let i = 0; i < meditationId.length; i++) {
    seed += meditationId.charCodeAt(i);
  }
  
  for (let i = 0; i < peakCount; i++) {
    // Generate deterministic "random" values
    seed = (seed * 9301 + 49297) % 233280;
    const normalized = seed / 233280;
    
    // Scale to reasonable audio peak values (0.1 - 0.9)
    peaks.push(0.1 + normalized * 0.8);
  }
  
  return peaks;
};

/**
 * Generate opening text based on meditation group
 */
const generateOpeningText = (groupName: MeditationGroupName): string => {
  const openings = {
    [MeditationGroupName.BlessingEnergyCenter]: "Welcome to this meditation. Find a comfortable position and close your eyes. We're going to bless the energy centers of your body.",
    [MeditationGroupName.BreakingHabit]: "Welcome to this meditation on breaking the habit of being yourself. Sit comfortably and prepare to step into a new way of being.",
    [MeditationGroupName.BreathTracks]: "Welcome to this breathwork session. Find your breath and prepare to connect with the energy within you.",
    [MeditationGroupName.Daily]: "Welcome to your daily meditation practice. Take a moment to center yourself and connect with your heart.",
    [MeditationGroupName.Foundational]: "Welcome to this foundational meditation. We're going to work on creating new neural pathways and new possibilities.",
    [MeditationGroupName.Generating]: "Welcome to this meditation on generating elevated emotions. Prepare to feel the energy of your future.",
    [MeditationGroupName.Synchronize]: "Welcome to this synchronization meditation. We're going to align our energy with our intentions.",
    [MeditationGroupName.Walking]: "Welcome to this walking meditation. We're going to practice embodying our future self with every step.",
    [MeditationGroupName.Unlocked]: "Welcome to this unlocked meditation. Prepare to access new levels of consciousness.",
    [MeditationGroupName.Other]: "Welcome to this meditation. Find a comfortable position and prepare to go beyond your limitations.",
    [MeditationGroupName.Custom]: "Welcome to this meditation practice. Center yourself and prepare for transformation.",
  };
  
  return openings[groupName] || openings[MeditationGroupName.Other];
};

/**
 * Generate middle text based on meditation name and group
 */
const generateMiddleText = (name: string, groupName: MeditationGroupName): string => {
  if (name.toLowerCase().includes('energy center') || name.toLowerCase().includes('botec')) {
    return "Now bring your attention to your energy centers. Feel the energy moving through your body, from your root to your crown.";
  }
  
  if (name.toLowerCase().includes('breath')) {
    return "Focus on your breath. Feel the energy entering your body with each inhale, transforming you with each exhale.";
  }
  
  if (name.toLowerCase().includes('heart')) {
    return "Place your attention on your heart center. Feel the coherence between your heart and your brain.";
  }
  
  if (name.toLowerCase().includes('abundance')) {
    return "Feel the energy of abundance flowing through you. You are worthy of receiving all that you desire.";
  }
  
  if (name.toLowerCase().includes('gratitude')) {
    return "Let gratitude fill your entire being. Feel thankful for this moment and all the possibilities ahead.";
  }
  
  // Default middle text
  return "Now bring your attention inward. Feel the energy of possibility flowing through every cell of your body.";
};

/**
 * Generate closing text - mostly consistent across meditations
 */
const generateClosingText = (): string => {
  const closings = [
    "When you're ready, slowly open your eyes and return to the present moment. Take this energy with you throughout your day.",
    "As we complete this meditation, feel yourself embodying this new energy. When you're ready, open your eyes.",
    "Take a moment to integrate this experience. When you're ready, slowly return your attention to the room and open your eyes.",
    "Feel gratitude for this time you've given yourself. When you're ready, open your eyes and step into your new future.",
  ];
  
  return closings[Math.floor(Math.random() * closings.length)];
};

/**
 * Extract meditation data from all the existing maps
 */
const getAllMeditationData = (): MeditationSourceData[] => {
  const allMeditations: MeditationSourceData[] = [];
  
  // Helper function to extract data from a map
  const extractFromMap = (baseKeys: any, sizes: any, map: any, groupName: MeditationGroupName) => {
    Object.values(baseKeys).forEach(key => {
      const keyStr = key as string;
      const meditation = map[keyStr];
      if (meditation) {
        allMeditations.push({
          baseKey: keyStr,
          name: meditation.name,
          groupName,
          formattedDuration: meditation.formattedDuration,
          fileSizeBytes: sizes[keyStr.split('-').pop()?.replace(/([A-Z])/g, '$1')] || undefined,
        });
      }
    });
  };
  
  // Extract from all meditation maps
  extractFromMap(BotecBaseKeys, BotecSizes, botecMap, MeditationGroupName.BlessingEnergyCenter);
  extractFromMap(BreakingHabitBaseKeys, BreakingHabitSizes, breakingHabitMap, MeditationGroupName.BreakingHabit);
  extractFromMap(BreathBaseKeys, BreathSizes, breathMap, MeditationGroupName.BreathTracks);
  extractFromMap(DailyMeditationBaseKeys, DailyMeditationSizes, dailyMeditationMap, MeditationGroupName.Daily);
  extractFromMap(FoundationalBaseKeys, FoundationalSizes, foundationalMap, MeditationGroupName.Foundational);
  extractFromMap(GeneratingBaseKeys, GeneratingSizes, generatingMap, MeditationGroupName.Generating);
  extractFromMap(OtherBaseKeys, OtherSizes, otherMap, MeditationGroupName.Other);
  extractFromMap(SynchronizeBaseKeys, {}, synchronizeMap, MeditationGroupName.Synchronize);
  extractFromMap(UnlockedBaseKeys, {}, unlockedMap, MeditationGroupName.Unlocked);
  extractFromMap(WalkingBaseKeys, {}, walkingMap, MeditationGroupName.Walking);
  
  return allMeditations;
};

/**
 * Build the complete reference database
 */
export const buildReferenceDatabase = async (
  progressCallback?: ProgressCallback,
  forceRebuild: boolean = false
): Promise<{success: boolean; error?: string; count: number}> => {
  try {
    // Check if database already exists and we're not forcing rebuild
    if (!forceRebuild) {
      const existing = await loadMeditationFingerprints();
      if (Object.keys(existing).length > 0) {
        return {
          success: true,
          count: Object.keys(existing).length,
        };
      }
    }
    
    progressCallback?.({
      current: 0,
      total: 0,
      currentMeditation: 'Initializing...',
      phase: 'initializing',
    });
    
    // Get all meditation data
    const allMeditations = getAllMeditationData();
    const totalCount = allMeditations.length;
    
    console.log(`Building reference database for ${totalCount} meditations...`);
    
    const database: {[key: string]: MeditationFingerprint} = {};
    
    // Process each meditation
    for (let i = 0; i < allMeditations.length; i++) {
      const meditation = allMeditations[i];
      const durationMinutes = parseInt(meditation.formattedDuration, 10) || 30; // Default to 30 minutes
      
      progressCallback?.({
        current: i + 1,
        total: totalCount,
        currentMeditation: meditation.name,
        phase: 'processing',
      });
      
      // Generate fingerprint
      const audioFingerprint = generateMockAudioFingerprint(
        meditation.baseKey,
        durationMinutes,
        meditation.fileSizeBytes
      );
      
      // Generate transcription excerpts
      const transcriptionExcerpts = generateMockTranscriptionExcerpts(
        meditation.baseKey,
        meditation.name,
        meditation.groupName,
        durationMinutes
      );
      
      // Create complete fingerprint entry
      const fingerprintEntry: MeditationFingerprint = {
        meditationBaseId: meditation.baseKey,
        name: meditation.name,
        groupName: meditation.groupName,
        audioFingerprint,
        transcriptionExcerpts,
        fileSizeBytes: meditation.fileSizeBytes,
        fileSizeString: meditation.fileSizeBytes?.toString().slice(0, 5),
        version: '1.0',
        lastUpdated: new Date().toISOString(),
      };
      
      database[meditation.baseKey] = fingerprintEntry;
      
      // Small delay to prevent blocking the UI
      if (i % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }
    
    progressCallback?.({
      current: totalCount,
      total: totalCount,
      currentMeditation: 'Saving database...',
      phase: 'saving',
    });
    
    // Save to AsyncStorage
    await saveMeditationFingerprints(database);
    
    progressCallback?.({
      current: totalCount,
      total: totalCount,
      currentMeditation: 'Complete!',
      phase: 'complete',
    });
    
    console.log(`Successfully built reference database with ${totalCount} meditations`);
    
    return {
      success: true,
      count: totalCount,
    };
    
  } catch (error) {
    console.error('Error building reference database:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      count: 0,
    };
  }
};

/**
 * Quick database status check
 */
export const getDatabaseStatus = async (): Promise<{
  exists: boolean;
  count: number;
  lastUpdated?: string;
}> => {
  try {
    const database = await loadMeditationFingerprints();
    const entries = Object.values(database);
    
    return {
      exists: entries.length > 0,
      count: entries.length,
      lastUpdated: entries.length > 0 
        ? Math.max(...entries.map(entry => new Date(entry.lastUpdated).getTime())).toString()
        : undefined,
    };
  } catch (error) {
    return {
      exists: false,
      count: 0,
    };
  }
};