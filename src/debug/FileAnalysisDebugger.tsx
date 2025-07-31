import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useDebug} from './DebugContext';

const FileAnalysisDebugger: React.FC = () => {
  const {currentAnalysis, addLog} = useDebug();

  const simulateFileUpload = () => {
    addLog('info', 'FileAnalysis', 'Simulating file upload for testing');
    
    // Simulate file analysis process
    const mockAnalysis = {
      fileName: 'test_meditation.mp3',
      fileSize: 52464670,
      duration: 3420, // 57 minutes
      audioFingerprint: {
        hash: 'abc123def456',
        peaks: [0.2, 0.8, 0.3, 0.9, 0.1, 0.7],
        spectralHash: 'spectral789',
        confidence: 0.85,
      },
      transcriptionResults: {
        excerpts: [
          {
            startTime: 0,
            endTime: 30,
            text: 'Welcome to this meditation. Find a comfortable position and close your eyes.',
            confidence: 0.92,
          },
          {
            startTime: 1710,
            endTime: 1740,
            text: 'Now bring your attention to your breath and feel the energy moving through your body.',
            confidence: 0.88,
          },
          {
            startTime: 3390,
            endTime: 3420,
            text: 'When you are ready, slowly open your eyes and return to the present moment.',
            confidence: 0.90,
          },
        ],
        overallConfidence: 0.90,
      },
      matchingResults: {
        topMatches: [
          {
            meditationId: 'm-botec-3-updated',
            name: 'Blessing of the Energy Centers 03 (Updated)',
            confidence: 0.87,
            matchMethod: 'combined' as const,
          },
          {
            meditationId: 'm-botec-3',
            name: 'Blessing of the Energy Centers 03',
            confidence: 0.62,
            matchMethod: 'fingerprint' as const,
          },
        ],
        processingSteps: [
          {
            step: 'Audio Loading',
            duration: 245,
            success: true,
          },
          {
            step: 'Fingerprint Extraction',
            duration: 1850,
            success: true,
            details: {peaks: 247, spectralFeatures: 128},
          },
          {
            step: 'Transcription Processing',
            duration: 8900,
            success: true,
            details: {excerpts: 3, avgConfidence: 0.90},
          },
          {
            step: 'Database Matching',
            duration: 340,
            success: true,
            details: {candidatesChecked: 156, topMatches: 2},
          },
        ],
      },
    };

    // Simulate the analysis happening over time
    setTimeout(() => {
      addLog('info', 'FileAnalysis', 'Mock analysis completed', mockAnalysis);
    }, 1000);
  };

  const clearAnalysis = () => {
    addLog('info', 'FileAnalysis', 'Clearing current analysis');
  };

  const renderAudioFingerprint = () => {
    if (!currentAnalysis?.audioFingerprint) {
      return <Text style={styles.noDataText}>No audio fingerprint data</Text>;
    }

    const {hash, peaks, spectralHash, confidence} = currentAnalysis.audioFingerprint;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Audio Fingerprint</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Hash:</Text>
          <Text style={styles.value}>{hash}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Spectral Hash:</Text>
          <Text style={styles.value}>{spectralHash}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Confidence:</Text>
          <Text style={[styles.value, styles.confidence]}>{(confidence * 100).toFixed(1)}%</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Peaks:</Text>
          <Text style={styles.value}>[{peaks.map(p => p.toFixed(2)).join(', ')}]</Text>
        </View>
      </View>
    );
  };

  const renderTranscriptionResults = () => {
    if (!currentAnalysis?.transcriptionResults) {
      return <Text style={styles.noDataText}>No transcription data</Text>;
    }

    const {excerpts, overallConfidence} = currentAnalysis.transcriptionResults;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transcription Results</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Overall Confidence:</Text>
          <Text style={[styles.value, styles.confidence]}>{(overallConfidence * 100).toFixed(1)}%</Text>
        </View>
        {excerpts.map((excerpt, index) => (
          <View key={index} style={styles.excerptContainer}>
            <Text style={styles.excerptHeader}>
              Excerpt {index + 1} ({excerpt.startTime}s - {excerpt.endTime}s)
            </Text>
            <Text style={styles.excerptText}>"{excerpt.text}"</Text>
            <Text style={styles.excerptConfidence}>
              Confidence: {(excerpt.confidence * 100).toFixed(1)}%
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderMatchingResults = () => {
    if (!currentAnalysis?.matchingResults) {
      return <Text style={styles.noDataText}>No matching results</Text>;
    }

    const {topMatches, processingSteps} = currentAnalysis.matchingResults;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Matching Results</Text>
        
        <Text style={styles.subsectionTitle}>Top Matches:</Text>
        {topMatches.map((match, index) => (
          <View key={index} style={styles.matchContainer}>
            <Text style={styles.matchName}>{match.name}</Text>
            <Text style={styles.matchId}>ID: {match.meditationId}</Text>
            <View style={styles.matchRow}>
              <Text style={styles.matchMethod}>{match.matchMethod.toUpperCase()}</Text>
              <Text style={[styles.matchConfidence, styles.confidence]}>
                {(match.confidence * 100).toFixed(1)}%
              </Text>
            </View>
          </View>
        ))}

        <Text style={styles.subsectionTitle}>Processing Steps:</Text>
        {processingSteps.map((step, index) => (
          <View key={index} style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepName}>{step.step}</Text>
              <Text style={styles.stepDuration}>{step.duration}ms</Text>
              <Text style={[styles.stepStatus, step.success ? styles.stepSuccess : styles.stepError]}>
                {step.success ? '✓' : '✗'}
              </Text>
            </View>
            {step.details && (
              <Text style={styles.stepDetails}>
                {JSON.stringify(step.details, null, 2)}
              </Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={true}
      bounces={true}>
      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={simulateFileUpload}>
          <Text style={styles.buttonText}>Simulate File Upload</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={clearAnalysis}>
          <Text style={styles.buttonText}>Clear Analysis</Text>
        </TouchableOpacity>
      </View>

      {currentAnalysis ? (
        <>
          {/* File Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>File Information</Text>
            <View style={styles.row}>
              <Text style={styles.label}>File Name:</Text>
              <Text style={styles.value}>{currentAnalysis.fileName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>File Size:</Text>
              <Text style={styles.value}>{(currentAnalysis.fileSize / 1024 / 1024).toFixed(2)} MB</Text>
            </View>
            {currentAnalysis.duration && (
              <View style={styles.row}>
                <Text style={styles.label}>Duration:</Text>
                <Text style={styles.value}>{Math.floor(currentAnalysis.duration / 60)}:{(currentAnalysis.duration % 60).toString().padStart(2, '0')}</Text>
              </View>
            )}
          </View>

          {renderAudioFingerprint()}
          {renderTranscriptionResults()}
          {renderMatchingResults()}
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No file analysis data available</Text>
          <Text style={styles.emptyStateSubtext}>Upload a file or run a simulation to see analysis results</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  controls: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#333',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ccc',
    marginTop: 12,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  label: {
    color: '#999',
    fontSize: 14,
    minWidth: 100,
  },
  value: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  confidence: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  noDataText: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  excerptContainer: {
    backgroundColor: '#333',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  excerptHeader: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 4,
  },
  excerptText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  excerptConfidence: {
    color: '#4CAF50',
    fontSize: 12,
  },
  matchContainer: {
    backgroundColor: '#333',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  matchName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  matchId: {
    color: '#999',
    fontSize: 12,
    marginBottom: 4,
  },
  matchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchMethod: {
    color: '#FF9500',
    fontSize: 12,
    fontWeight: '600',
  },
  matchConfidence: {
    fontSize: 14,
  },
  stepContainer: {
    backgroundColor: '#333',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepName: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  stepDuration: {
    color: '#999',
    fontSize: 12,
    marginRight: 8,
  },
  stepStatus: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepSuccess: {
    color: '#4CAF50',
  },
  stepError: {
    color: '#F44336',
  },
  stepDetails: {
    color: '#ccc',
    fontSize: 11,
    fontFamily: 'monospace',
    backgroundColor: '#1a1a1a',
    borderRadius: 4,
    padding: 8,
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default FileAnalysisDebugger;