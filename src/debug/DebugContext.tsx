import React, {createContext, useContext, useState, ReactNode} from 'react';
import {DebugState, DebugTab, DebugLog, PerformanceMetrics, FileAnalysisResult, DebugSettings} from './types';

interface DebugContextValue {
  debugState: DebugState;
  setDebugState: React.Dispatch<React.SetStateAction<DebugState>>;
  addLog: (level: DebugLog['level'], category: string, message: string, data?: any) => void;
  clearLogs: () => void;
  updatePerformanceMetrics: (metrics: Partial<PerformanceMetrics>) => void;
  currentAnalysis: FileAnalysisResult | null;
  setCurrentAnalysis: React.Dispatch<React.SetStateAction<FileAnalysisResult | null>>;
  debugSettings: DebugSettings;
  setDebugSettings: React.Dispatch<React.SetStateAction<DebugSettings>>;
}

const defaultDebugState: DebugState = {
  isVisible: false,
  activeTab: DebugTab.FILE_ANALYSIS,
  logs: [],
  performanceMetrics: {
    audioProcessingTime: 0,
    transcriptionTime: 0,
    matchingTime: 0,
    totalProcessingTime: 0,
    memoryUsage: 0,
    successRate: 0,
    totalProcessed: 0,
  },
};

const defaultDebugSettings: DebugSettings = {
  enableAudioFingerprinting: true,
  enableTranscription: true,
  enableSizeFallback: true,
  fingerprintWeight: 0.4,
  transcriptionWeight: 0.4,
  sizeWeight: 0.2,
  confidenceThreshold: 0.7,
  enablePerformanceLogging: true,
  enableVerboseLogging: false,
};

const DebugContext = createContext<DebugContextValue | undefined>(undefined);

export const useDebug = (): DebugContextValue => {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
};

interface DebugProviderProps {
  children: ReactNode;
}

export const DebugProvider: React.FC<DebugProviderProps> = ({children}) => {
  const [debugState, setDebugState] = useState<DebugState>(defaultDebugState);
  const [currentAnalysis, setCurrentAnalysis] = useState<FileAnalysisResult | null>(null);
  const [debugSettings, setDebugSettings] = useState<DebugSettings>(defaultDebugSettings);

  const addLog = (level: DebugLog['level'], category: string, message: string, data?: any) => {
    const log: DebugLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
    };

    setDebugState(prev => ({
      ...prev,
      logs: [log, ...prev.logs].slice(0, 1000), // Keep only last 1000 logs
    }));

    // Also log to console in dev mode
    if (__DEV__) {
      const consoleMethod = level === 'error' ? console.error : 
                           level === 'warn' ? console.warn : 
                           console.log;
      consoleMethod(`[${category}] ${message}`, data);
    }
  };

  const clearLogs = () => {
    setDebugState(prev => ({
      ...prev,
      logs: [],
    }));
  };

  const updatePerformanceMetrics = (metrics: Partial<PerformanceMetrics>) => {
    setDebugState(prev => ({
      ...prev,
      performanceMetrics: {
        ...prev.performanceMetrics,
        ...metrics,
      },
    }));
  };

  const value: DebugContextValue = {
    debugState,
    setDebugState,
    addLog,
    clearLogs,
    updatePerformanceMetrics,
    currentAnalysis,
    setCurrentAnalysis,
    debugSettings,
    setDebugSettings,
  };

  return (
    <DebugContext.Provider value={value}>
      {children}
    </DebugContext.Provider>
  );
};