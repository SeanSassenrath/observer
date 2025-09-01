import LiveAudioStream, {NativeRecordReceivePCM} from 'react-native-live-audio-fft';
import {AudioFingerprint} from './meditationFingerprintStorage';

export interface AudioAnalysisOptions {
  sampleRate: number;
  channels: number;
  bitsPerSample: number;
  analysisWindowSize: number;
}

export interface AudioAnalysisResult {
  fingerprint: AudioFingerprint;
  rawData: {
    pcmData: Float32Array;
    fftData: Float32Array;
    peaks: number[];
  };
}

const DEFAULT_OPTIONS: AudioAnalysisOptions = {
  sampleRate: 44100,
  channels: 1,
  bitsPerSample: 16,
  analysisWindowSize: 30, // Analyze first 30 seconds
};

export class AudioAnalyzer {
  private isRecording = false;
  private pcmDataBuffer: number[] = [];
  private analysisStartTime: number = 0;
  private options: AudioAnalysisOptions;

  constructor(options: Partial<AudioAnalysisOptions> = {}) {
    this.options = {...DEFAULT_OPTIONS, ...options};
  }

  async analyzeAudioFile(filePath: string): Promise<AudioAnalysisResult> {
    return new Promise((resolve, reject) => {
      try {
        this.pcmDataBuffer = [];
        this.analysisStartTime = Date.now();

        LiveAudioStream.on('data', this.handleAudioData.bind(this, resolve, reject));
        
        LiveAudioStream.init({
          sampleRate: this.options.sampleRate,
          channels: this.options.channels,
          bitsPerSample: this.options.bitsPerSample,
        });

        this.startAnalysis();

        // Stop analysis after specified window
        setTimeout(() => {
          this.stopAnalysis();
          const result = this.processCollectedData();
          resolve(result);
        }, this.options.analysisWindowSize * 1000);

      } catch (error) {
        reject(new Error(`Audio analysis failed: ${error}`));
      }
    });
  }

  private handleAudioData(
    resolve: (result: AudioAnalysisResult) => void,
    reject: (error: Error) => void,
    pcmDataBase64: string
  ) {
    try {
      const {pcmData} = NativeRecordReceivePCM(pcmDataBase64);
      
      if (pcmData && pcmData.length > 0) {
        this.pcmDataBuffer.push(...pcmData);
      }

      // Check if we have enough data for analysis
      const targetSamples = this.options.sampleRate * this.options.analysisWindowSize;
      if (this.pcmDataBuffer.length >= targetSamples) {
        this.stopAnalysis();
        const result = this.processCollectedData();
        resolve(result);
      }
    } catch (error) {
      reject(new Error(`Audio data processing failed: ${error}`));
    }
  }

  private startAnalysis() {
    if (!this.isRecording) {
      this.isRecording = true;
      LiveAudioStream.start();
    }
  }

  private stopAnalysis() {
    if (this.isRecording) {
      this.isRecording = false;
      LiveAudioStream.stop();
      LiveAudioStream.removeAllListeners('data');
    }
  }

  private processCollectedData(): AudioAnalysisResult {
    const pcmData = new Float32Array(this.pcmDataBuffer);
    const fftData = this.computeFFT(pcmData);
    const peaks = this.extractPeaks(fftData);
    const hash = this.generateHash(peaks);
    const spectralHash = this.generateSpectralHash(fftData);

    const fingerprint: AudioFingerprint = {
      hash,
      duration: this.options.analysisWindowSize,
      sampleRate: this.options.sampleRate,
      peaks,
      spectralHash,
      createdAt: new Date().toISOString(),
    };

    return {
      fingerprint,
      rawData: {
        pcmData,
        fftData,
        peaks,
      },
    };
  }

  private computeFFT(pcmData: Float32Array): Float32Array {
    // Simple FFT implementation for React Native
    // In production, consider using a more optimized FFT library
    const n = Math.pow(2, Math.floor(Math.log2(pcmData.length)));
    const fftInput = pcmData.slice(0, n);
    
    // Apply Hamming window
    for (let i = 0; i < n; i++) {
      fftInput[i] *= 0.54 - 0.46 * Math.cos(2 * Math.PI * i / (n - 1));
    }
    
    return this.fft(fftInput);
  }

  private fft(x: Float32Array): Float32Array {
    const N = x.length;
    if (N <= 1) return x;
    
    // Simple Cooley-Tukey FFT implementation
    const even = new Float32Array(N / 2);
    const odd = new Float32Array(N / 2);
    
    for (let i = 0; i < N / 2; i++) {
      even[i] = x[2 * i];
      odd[i] = x[2 * i + 1];
    }
    
    const evenFFT = this.fft(even);
    const oddFFT = this.fft(odd);
    const result = new Float32Array(N);
    
    for (let k = 0; k < N / 2; k++) {
      const t = Math.cos(-2 * Math.PI * k / N) * oddFFT[k];
      result[k] = evenFFT[k] + t;
      result[k + N / 2] = evenFFT[k] - t;
    }
    
    return result;
  }

  private extractPeaks(fftData: Float32Array): number[] {
    const peaks: number[] = [];
    const binCount = Math.min(50, fftData.length / 2); // Extract up to 50 frequency peaks
    const binSize = Math.floor(fftData.length / 2 / binCount);
    
    for (let i = 0; i < binCount; i++) {
      const startBin = i * binSize;
      const endBin = Math.min((i + 1) * binSize, fftData.length / 2);
      
      let maxMagnitude = 0;
      for (let j = startBin; j < endBin; j++) {
        const magnitude = Math.abs(fftData[j]);
        maxMagnitude = Math.max(maxMagnitude, magnitude);
      }
      
      peaks.push(maxMagnitude);
    }
    
    return peaks;
  }

  private generateHash(peaks: number[]): string {
    // Create hash from peak values
    const hashString = peaks
      .map(peak => Math.floor(peak * 1000))
      .join(',');
    
    return this.simpleHash(hashString);
  }

  private generateSpectralHash(fftData: Float32Array): string {
    // Generate spectral centroid hash
    let weightedSum = 0;
    let magnitudeSum = 0;
    
    for (let i = 0; i < fftData.length / 2; i++) {
      const magnitude = Math.abs(fftData[i]);
      weightedSum += i * magnitude;
      magnitudeSum += magnitude;
    }
    
    const spectralCentroid = magnitudeSum > 0 ? weightedSum / magnitudeSum : 0;
    return this.simpleHash(spectralCentroid.toString());
  }

  private simpleHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(12, '0');
  }

  cleanup() {
    this.stopAnalysis();
    this.pcmDataBuffer = [];
  }
}

// Utility function for easy usage
export const analyzeAudioFile = async (
  filePath: string,
  options?: Partial<AudioAnalysisOptions>
): Promise<AudioAnalysisResult> => {
  const analyzer = new AudioAnalyzer(options);
  try {
    return await analyzer.analyzeAudioFile(filePath);
  } finally {
    analyzer.cleanup();
  }
};