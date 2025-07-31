export interface DebugState {
  isVisible: boolean;
  activeTab: DebugTab;
  logs: DebugLog[];
  performanceMetrics: PerformanceMetrics;
}

export enum DebugTab {
  FILE_ANALYSIS = 'file_analysis',
  DATABASE = 'database',
  PERFORMANCE = 'performance',
  SETTINGS = 'settings',
  LOGS = 'logs',
}

export interface DebugLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  category: string;
  message: string;
  data?: any;
}

export interface PerformanceMetrics {
  audioProcessingTime: number;
  transcriptionTime: number;
  matchingTime: number;
  totalProcessingTime: number;
  memoryUsage: number;
  successRate: number;
  totalProcessed: number;
}

export interface FileAnalysisResult {
  fileName: string;
  fileSize: number;
  duration?: number;
  audioFingerprint?: {
    hash: string;
    peaks: number[];
    spectralHash: string;
    confidence: number;
  };
  transcriptionResults?: {
    excerpts: Array<{
      startTime: number;
      endTime: number;
      text: string;
      confidence: number;
    }>;
    overallConfidence: number;
  };
  matchingResults?: {
    topMatches: Array<{
      meditationId: string;
      name: string;
      confidence: number;
      matchMethod: 'fingerprint' | 'transcription' | 'size' | 'combined';
    }>;
    processingSteps: Array<{
      step: string;
      duration: number;
      success: boolean;
      details?: any;
    }>;
  };
}

export interface DatabaseStats {
  totalMeditations: number;
  avgTranscriptionExcerpts: number;
  oldestEntry: number | null;
  newestEntry: number | null;
  totalSize: number;
  integrityStatus: 'healthy' | 'warning' | 'error';
}

export interface DebugSettings {
  enableAudioFingerprinting: boolean;
  enableTranscription: boolean;
  enableSizeFallback: boolean;
  fingerprintWeight: number;
  transcriptionWeight: number;
  sizeWeight: number;
  confidenceThreshold: number;
  enablePerformanceLogging: boolean;
  enableVerboseLogging: boolean;
}