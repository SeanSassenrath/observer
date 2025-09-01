import React, {useState} from 'react';
import {View, Alert} from 'react-native';
import {Text, Button} from '@ui-kitten/components';
import DocumentPicker from 'react-native-document-picker';
import {analyzeAudioFile} from '../utils/audioFileAnalysis';
import {AudioAnalyzer} from '../utils/audioAnalysis';

export const AudioAnalysisTest = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string>('');

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

  const clearResults = () => {
    setResult('');
  };

  return (
    <View style={{padding: 20}}>
      <Text category="h6" style={{marginBottom: 20}}>
        Audio Analysis Testing
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
        style={{marginBottom: 10}}>
        Test Live Recording (5s)
      </Button>
      
      <Button
        onPress={clearResults}
        appearance="ghost"
        style={{marginBottom: 20}}>
        Clear Results
      </Button>
      
      {result ? (
        <View style={{
          backgroundColor: '#1a1a1a',
          padding: 15,
          borderRadius: 8,
          marginTop: 10
        }}>
          <Text style={{
            fontFamily: 'monospace',
            fontSize: 12,
            color: '#00ff00'
          }}>
            {result}
          </Text>
        </View>
      ) : null}
    </View>
  );
};