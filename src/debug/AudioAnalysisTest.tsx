import React, {useState} from 'react';
import {View, Alert, ScrollView} from 'react-native';
import {Text, Button} from '@ui-kitten/components';
import DocumentPicker from 'react-native-document-picker';
import {analyzeAudioFile} from '../utils/audioFileAnalysis';
import {AudioAnalyzer} from '../utils/audioAnalysis';
import {
  safeFileTranscription,
} from '../utils/speechTranscriptionSafe';
import {
  findBestFingerprintMatch,
  debugFingerprintComparison,
  validateFingerprintQuality,
} from '../utils/fingerprintMatching';
import {matchMeditationFile, MeditationMatchResult} from '../services/meditationMatcher';
import {buildReferenceDatabase, getDatabaseStatus} from '../services/databaseBuilder';
import {getDatabaseStats, hasStaticDatabase} from '../utils/staticFingerprintDatabase';

export const AudioAnalysisTest = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string>('');
  const [transcriptionResult, setTranscriptionResult] = useState<string>('');
  const [matchingResult, setMatchingResult] = useState<string>('');
  const [databaseStatus, setDatabaseStatus] = useState<string>('Checking...');

  const testFileAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      setResult('Picking audio file...');

      const file = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
        copyTo: 'documentDirectory',
      });

      if (file[0] && file[0].fileCopyUri) {
        setResult('Analyzing audio file...');
        
        const analysis = await analyzeAudioFile(file[0].fileCopyUri);
        
        const resultText = `
📁 File: ${analysis.fileName}
📊 Size: ${analysis.fileSize} bytes
🔢 Hash: ${analysis.fingerprint.hash}
🎵 Spectral: ${analysis.fingerprint.spectralHash}
⏱️ Duration: ${analysis.fingerprint.duration}s
📈 Peaks: ${analysis.fingerprint.peaks.length} frequency bands
🎯 Sample Rate: ${analysis.fingerprint.sampleRate}Hz
📅 Created: ${new Date(analysis.fingerprint.createdAt).toLocaleString()}

Peak Values (first 10):
${analysis.fingerprint.peaks.slice(0, 10).map(p => p.toFixed(3)).join(', ')}
        `;
        
        setResult(resultText);
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        setResult('File selection cancelled');
      } else {
        setResult(`Error: ${error}`);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const testLiveAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      setResult('Starting live audio analysis (5 seconds)...');

      const analyzer = new AudioAnalyzer({
        analysisWindowSize: 5, // 5 second test
        sampleRate: 44100,
      });

      const analysis = await analyzer.analyzeAudioFile('live-recording');
      
      const resultText = `
🎤 Live Recording Analysis:
🔢 Hash: ${analysis.fingerprint.hash}
🎵 Spectral: ${analysis.fingerprint.spectralHash}
⏱️ Duration: ${analysis.fingerprint.duration}s
📈 Peaks: ${analysis.fingerprint.peaks.length} frequency bands
📅 Created: ${new Date(analysis.fingerprint.createdAt).toLocaleString()}

Peak Values (first 10):
${analysis.fingerprint.peaks.slice(0, 10).map(p => p.toFixed(3)).join(', ')}
      `;
      
      setResult(resultText);
      analyzer.cleanup();
    } catch (error) {
      setResult(`Live analysis error: ${error}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const testFileTranscription = async () => {
    try {
      setIsAnalyzing(true);
      setTranscriptionResult('Picking audio file...');

      const file = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
        copyTo: 'documentDirectory',
      });

      if (file[0] && file[0].fileCopyUri) {
        setTranscriptionResult('Generating contextual transcription...');
        
        // Use safe transcription that generates contextual content
        const transcription = await safeFileTranscription(
          file[0].fileCopyUri,
          file[0].name
        );
        
        if (transcription.error) {
          setTranscriptionResult(`Error: ${transcription.error}`);
          return;
        }
        
        const resultText = `
📁 File: ${file[0].name}
⏱️ Processing Time: ${transcription.processingTime}ms
🎯 Overall Confidence: ${(transcription.confidence * 100).toFixed(1)}%
📝 Full Text: ${transcription.fullTranscription}

📊 Excerpts (${transcription.excerpts.length}):
${transcription.excerpts.map((excerpt, i) => `
${i + 1}. ${excerpt.startTime}s-${excerpt.endTime}s (${(excerpt.confidence * 100).toFixed(1)}%)
   "${excerpt.text}"
`).join('')}

💡 Note: Currently using contextual mock transcription.
Real speech analysis will be added in future phases.
        `;
        
        setTranscriptionResult(resultText);
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        setTranscriptionResult('File selection cancelled');
      } else {
        setTranscriptionResult(`Error: ${error}`);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const testMeditationMatching = async () => {
    try {
      setIsAnalyzing(true);
      setMatchingResult('Picking audio file for meditation matching...');

      const file = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
        copyTo: 'documentDirectory',
      });

      if (file[0]) {
        setMatchingResult('Running complete meditation matching algorithm...');
        
        const matchResult = await matchMeditationFile(file[0], {
          enableFingerprinting: true,
          enableSizeMatching: true,
          fingerprintOptions: {
            confidenceThreshold: 0.5, // Lower threshold for testing
          },
        });
        
        const resultText = `
📁 File: ${file[0].name}
📏 Size: ${file[0].size} bytes
⏱️ Processing Time: ${matchResult.processingTime}ms

🎯 Match Result:
Method: ${matchResult.matchMethod.toUpperCase()}
${matchResult.meditation ? 
  `✅ MATCHED: ${matchResult.meditation.baseKey}
🎯 Confidence: ${(matchResult.meditation.confidence * 100).toFixed(1)}%` : 
  '❌ NO MATCH FOUND - Would go to manual selection'}

${matchResult.fingerprintMatch ? `
🔍 Fingerprint Match Details:
- Hash Similarity: ${(matchResult.fingerprintMatch.details.hashSimilarity * 100).toFixed(1)}%
- Spectral Similarity: ${(matchResult.fingerprintMatch.details.spectralSimilarity * 100).toFixed(1)}%
- Peaks Correlation: ${(matchResult.fingerprintMatch.details.peaksSimilarity * 100).toFixed(1)}%
- Duration Match: ${(matchResult.fingerprintMatch.details.durationSimilarity * 100).toFixed(1)}%
- Combined Score: ${(matchResult.fingerprintMatch.details.combinedScore * 100).toFixed(1)}%
` : ''}

${matchResult.fingerprint ? `
🎵 Generated Fingerprint:
- Hash: ${matchResult.fingerprint.hash}
- Spectral: ${matchResult.fingerprint.spectralHash}
- Duration: ${matchResult.fingerprint.duration}s
- Peaks: ${matchResult.fingerprint.peaks.length} points
- Quality: ${validateFingerprintQuality(matchResult.fingerprint).quality.toUpperCase()}
` : ''}

${matchResult.error ? `❌ Error: ${matchResult.error}` : ''}
        `;
        
        setMatchingResult(resultText);
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        setMatchingResult('File selection cancelled');
      } else {
        setMatchingResult(`Error: ${error}`);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const checkDatabaseStatus = async () => {
    try {
      const staticStats = await getDatabaseStats();
      const hasStatic = hasStaticDatabase();
      
      if (staticStats.source === 'static') {
        setDatabaseStatus(`✅ Static database loaded: ${staticStats.count} meditations (v${staticStats.version})`);
      } else if (staticStats.source === 'dynamic') {
        setDatabaseStatus(`🔧 Dynamic database: ${staticStats.count} meditations (v${staticStats.version})`);
      } else {
        setDatabaseStatus(`❌ No database found - ${hasStatic ? 'Static file exists but failed to load' : 'Run build script or build dynamically'}`);
      }
    } catch (error) {
      setDatabaseStatus(`❌ Database error: ${error}`);
    }
  };

  const buildDatabase = async () => {
    try {
      setIsAnalyzing(true);
      setDatabaseStatus('Building reference database...');
      
      const progressCallback = (progress: any) => {
        setDatabaseStatus(`Building: ${progress.current}/${progress.total} - ${progress.currentMeditation}`);
      };
      
      const result = await buildReferenceDatabase(progressCallback, true);
      
      if (result.success) {
        setDatabaseStatus(`✅ Database built successfully: ${result.count} meditations`);
      } else {
        setDatabaseStatus(`❌ Database build failed: ${result.error}`);
      }
    } catch (error) {
      setDatabaseStatus(`❌ Database build error: ${error}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearResults = () => {
    setResult('');
    setTranscriptionResult('');
    setMatchingResult('');
  };

  // Check database status on component mount
  React.useEffect(() => {
    checkDatabaseStatus();
  }, []);

  return (
    <ScrollView style={{padding: 20}}>
      <Text category="h6" style={{marginBottom: 20}}>
        Audio Analysis & Transcription Testing
      </Text>
      
      {/* Database Status Section */}
      <Text category="s1" style={{marginBottom: 10, fontWeight: 'bold'}}>
        🗄️ Reference Database
      </Text>
      
      <Text style={{marginBottom: 10, fontSize: 12, opacity: 0.8}}>
        {databaseStatus}
      </Text>
      
      <Text style={{marginBottom: 15, fontSize: 11, opacity: 0.6}}>
        💡 To create real fingerprint database:{'\n'}
        node scripts/buildRealFingerprintDatabase.js /path/to/meditation-files
      </Text>
      
      <Button
        onPress={buildDatabase}
        disabled={isAnalyzing}
        appearance="outline"
        style={{marginBottom: 10}}>
        Build Reference Database
      </Button>
      
      <Button
        onPress={checkDatabaseStatus}
        appearance="ghost"
        size="small"
        style={{marginBottom: 20}}>
        Refresh Status
      </Button>
      
      {/* Audio Analysis Section */}
      <Text category="s1" style={{marginBottom: 10, fontWeight: 'bold'}}>
        🎵 Audio Fingerprinting
      </Text>
      
      <Button
        onPress={testFileAnalysis}
        disabled={isAnalyzing}
        style={{marginBottom: 10}}>
        Test File Analysis
      </Button>
      
      <Button
        onPress={testLiveAnalysis}
        disabled={isAnalyzing}
        style={{marginBottom: 20}}>
        Test Live Recording (5s)
      </Button>
      
      {/* Meditation Matching Section */}
      <Text category="s1" style={{marginBottom: 10, fontWeight: 'bold'}}>
        🎯 Meditation Matching
      </Text>
      
      <Button
        onPress={testMeditationMatching}
        disabled={isAnalyzing}
        style={{marginBottom: 20}}>
        Test Complete Matching Algorithm
      </Button>
      
      {/* File Transcription Section */}
      <Text category="s1" style={{marginBottom: 10, fontWeight: 'bold'}}>
        📝 File Transcription (Optional)
      </Text>
      
      <Button
        onPress={testFileTranscription}
        disabled={isAnalyzing}
        style={{marginBottom: 20}}>
        Test File Transcription (Mock)
      </Button>
      
      <Button
        onPress={clearResults}
        appearance="ghost"
        style={{marginBottom: 20}}>
        Clear All Results
      </Button>
      
      {/* Audio Analysis Results */}
      {result ? (
        <View style={{marginBottom: 20}}>
          <Text category="s2" style={{marginBottom: 10, fontWeight: 'bold'}}>
            Audio Analysis Results:
          </Text>
          <View style={{
            backgroundColor: '#1a1a1a',
            padding: 15,
            borderRadius: 8
          }}>
            <Text style={{
              fontFamily: 'monospace',
              fontSize: 12,
              color: '#00ff00'
            }}>
              {result}
            </Text>
          </View>
        </View>
      ) : null}
      
      {/* Meditation Matching Results */}
      {matchingResult ? (
        <View style={{marginBottom: 20}}>
          <Text category="s2" style={{marginBottom: 10, fontWeight: 'bold'}}>
            Meditation Matching Results:
          </Text>
          <View style={{
            backgroundColor: '#1a1a1a',
            padding: 15,
            borderRadius: 8
          }}>
            <Text style={{
              fontFamily: 'monospace',
              fontSize: 12,
              color: '#ffff00'
            }}>
              {matchingResult}
            </Text>
          </View>
        </View>
      ) : null}

      {/* Transcription Results */}
      {transcriptionResult ? (
        <View style={{marginBottom: 20}}>
          <Text category="s2" style={{marginBottom: 10, fontWeight: 'bold'}}>
            Transcription Results:
          </Text>
          <View style={{
            backgroundColor: '#1a1a1a',
            padding: 15,
            borderRadius: 8
          }}>
            <Text style={{
              fontFamily: 'monospace',
              fontSize: 12,
              color: '#00ffff'
            }}>
              {transcriptionResult}
            </Text>
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
};