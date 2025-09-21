import AsyncStorage from '@react-native-async-storage/async-storage';

const FINGERPRINT_STORAGE_KEY = '@meditation_fingerprints';
const TRANSCRIPTION_STORAGE_KEY = '@meditation_transcriptions';

// Simplified audio fingerprint data structure (kept for legacy compatibility)
export interface AudioFingerprint {
  hash: string; // Primary fingerprint hash
  duration: number; // Duration in seconds
  sampleRate: number; // Audio sample rate
  peaks: number[]; // Audio peak values for matching
  spectralHash: string; // Spectral centroid hash
  createdAt: string; // ISO timestamp
}

// Streamlined meditation reference data focused on name-based matching
export interface MeditationFingerprint {
  meditationBaseId: string; // Links to existing BotecBaseKeys, etc.
  name: string; // Human readable name - PRIMARY MATCHING FIELD
  groupName: string; // Meditation group (e.g., "Blessing of Energy Centers")
  sourceFile?: string; // Original source filename for enhanced matching
  
  // Legacy compatibility (optional - only needed for fallback methods)
  audioFingerprint?: AudioFingerprint; // Optional legacy fingerprint
  
  // Simple fallback data
  fileSizeBytes?: number; // File size for basic matching
  
  // Metadata
  version: string; // Schema version: "3.0" = name-based, "2.0" = fingerprint, "1.0" = legacy
  lastUpdated: string; // ISO timestamp
  
  // Series information for enhanced matching
  seriesName?: string; // e.g., "Blessing of Energy Centers"
  seriesNumber?: number; // e.g., 3 for "Part 3"
  isUpdated?: boolean; // true if this is an updated version
}

// Storage interface for all meditation fingerprints
export interface MeditationFingerprintDatabase {
  [meditationBaseId: string]: MeditationFingerprint;
}

// Upload file matching result
export interface FileMatchResult {
  meditationBaseId: string;
  confidence: number; // 0-1 confidence score
  matchMethod: 'fingerprint' | 'transcription' | 'size' | 'combined';
  details: {
    fingerprintMatch?: number; // 0-1 similarity score
    transcriptionMatch?: number; // 0-1 similarity score  
    sizeMatch?: boolean; // Exact size match
  };
}

/**
 * Save meditation fingerprint database to AsyncStorage
 */
export const saveMeditationFingerprints = async (
  fingerprints: MeditationFingerprintDatabase
): Promise<void> => {
  try {
    const serialized = JSON.stringify(fingerprints);
    await AsyncStorage.setItem(FINGERPRINT_STORAGE_KEY, serialized);
    console.log('Successfully saved meditation fingerprints to storage');
  } catch (error) {
    console.error('Error saving meditation fingerprints:', error);
    throw error;
  }
};

/**
 * Load meditation fingerprint database from AsyncStorage
 */
export const loadMeditationFingerprints = async (): Promise<MeditationFingerprintDatabase> => {
  try {
    const serialized = await AsyncStorage.getItem(FINGERPRINT_STORAGE_KEY);
    if (!serialized) {
      return {};
    }
    return JSON.parse(serialized);
  } catch (error) {
    console.error('Error loading meditation fingerprints:', error);
    return {};
  }
};

/**
 * Save individual meditation fingerprint
 */
export const saveMeditationFingerprint = async (
  meditationBaseId: string,
  fingerprint: MeditationFingerprint
): Promise<void> => {
  try {
    const existing = await loadMeditationFingerprints();
    existing[meditationBaseId] = fingerprint;
    await saveMeditationFingerprints(existing);
  } catch (error) {
    console.error('Error saving individual meditation fingerprint:', error);
    throw error;
  }
};

/**
 * Get specific meditation fingerprint
 */
export const getMeditationFingerprint = async (
  meditationBaseId: string
): Promise<MeditationFingerprint | null> => {
  try {
    const fingerprints = await loadMeditationFingerprints();
    return fingerprints[meditationBaseId] || null;
  } catch (error) {
    console.error('Error getting meditation fingerprint:', error);
    return null;
  }
};

/**
 * Clear all meditation fingerprints
 */
export const clearMeditationFingerprints = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(FINGERPRINT_STORAGE_KEY);
    await AsyncStorage.removeItem(TRANSCRIPTION_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing meditation fingerprints:', error);
    throw error;
  }
};

/**
 * Get database statistics
 */
export const getFingerprintDatabaseStats = async () => {
  try {
    const fingerprints = await loadMeditationFingerprints();
    const keys = Object.keys(fingerprints);
    
    return {
      totalMeditations: keys.length,
      avgTranscriptionExcerpts: keys.length > 0 
        ? keys.reduce((sum, key) => sum + fingerprints[key].transcriptionExcerpts.length, 0) / keys.length 
        : 0,
      oldestEntry: keys.length > 0 
        ? Math.min(...keys.map(key => new Date(fingerprints[key].lastUpdated).getTime()))
        : null,
      newestEntry: keys.length > 0 
        ? Math.max(...keys.map(key => new Date(fingerprints[key].lastUpdated).getTime()))
        : null,
      totalSize: await AsyncStorage.getItem(FINGERPRINT_STORAGE_KEY).then(data => data?.length || 0),
    };
  } catch (error) {
    console.error('Error getting database stats:', error);
    return null;
  }
};

/**
 * Check database integrity
 */
export const checkDatabaseIntegrity = async (): Promise<{
  isHealthy: boolean;
  issues: string[];
  stats: {
    totalEntries: number;
    duplicateHashes: number;
    missingFingerprints: number;
    invalidEntries: number;
  };
}> => {
  try {
    const fingerprints = await loadMeditationFingerprints();
    const entries = Object.values(fingerprints);
    const issues: string[] = [];
    
    // Check for duplicate hashes
    const hashes = entries.map(entry => entry.audioFingerprint.hash);
    const duplicateHashes = hashes.length - new Set(hashes).size;
    
    if (duplicateHashes > 0) {
      issues.push(`Found ${duplicateHashes} duplicate audio fingerprint hashes`);
    }
    
    // Check for missing fingerprints
    const missingFingerprints = entries.filter(entry => 
      !entry.audioFingerprint.hash || 
      !entry.audioFingerprint.peaks?.length ||
      !entry.audioFingerprint.spectralHash
    ).length;
    
    if (missingFingerprints > 0) {
      issues.push(`Found ${missingFingerprints} entries with missing fingerprint data`);
    }
    
    // Check for invalid entries
    const invalidEntries = entries.filter(entry => 
      !entry.meditationBaseId ||
      !entry.name ||
      !entry.audioFingerprint ||
      !entry.transcriptionExcerpts?.length
    ).length;
    
    if (invalidEntries > 0) {
      issues.push(`Found ${invalidEntries} entries with invalid structure`);
    }
    
    return {
      isHealthy: issues.length === 0,
      issues,
      stats: {
        totalEntries: entries.length,
        duplicateHashes,
        missingFingerprints,
        invalidEntries,
      },
    };
  } catch (error) {
    console.error('Error checking database integrity:', error);
    return {
      isHealthy: false,
      issues: ['Failed to check database integrity'],
      stats: {
        totalEntries: 0,
        duplicateHashes: 0,
        missingFingerprints: 0,
        invalidEntries: 0,
      },
    };
  }
};

/**
 * Export database as JSON string for backup/sharing
 */
export const exportDatabase = async (): Promise<string | null> => {
  try {
    const fingerprints = await loadMeditationFingerprints();
    return JSON.stringify(fingerprints, null, 2);
  } catch (error) {
    console.error('Error exporting database:', error);
    return null;
  }
};

/**
 * Import database from JSON string
 */
export const importDatabase = async (jsonString: string): Promise<boolean> => {
  try {
    const fingerprints = JSON.parse(jsonString) as MeditationFingerprintDatabase;
    
    // Basic validation
    if (typeof fingerprints !== 'object' || fingerprints === null) {
      throw new Error('Invalid database format');
    }
    
    // Validate structure of first entry
    const firstEntry = Object.values(fingerprints)[0];
    if (firstEntry && (!firstEntry.meditationBaseId || !firstEntry.audioFingerprint)) {
      throw new Error('Invalid database structure');
    }
    
    await saveMeditationFingerprints(fingerprints);
    return true;
  } catch (error) {
    console.error('Error importing database:', error);
    return false;
  }
};