import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import {useDebug} from './DebugContext';

const SettingsDebugger: React.FC = () => {
  const {debugSettings, setDebugSettings, addLog} = useDebug();

  const updateSetting = (key: keyof typeof debugSettings, value: any) => {
    setDebugSettings(prev => ({
      ...prev,
      [key]: value,
    }));
    addLog('info', 'Settings', `Updated ${key} to ${value}`);
  };

  const resetToDefaults = () => {
    Alert.alert(
      'Reset to Defaults',
      'Are you sure you want to reset all settings to their default values?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Reset',
          onPress: () => {
            const defaultSettings = {
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
            setDebugSettings(defaultSettings);
            addLog('info', 'Settings', 'Reset all settings to defaults', defaultSettings);
          },
        },
      ]
    );
  };

  const exportSettings = () => {
    const settingsJson = JSON.stringify(debugSettings, null, 2);
    addLog('info', 'Settings', 'Exported settings', debugSettings);
    Alert.alert('Settings Exported', `Settings exported to logs:\n\n${settingsJson}`);
  };

  const WeightSlider: React.FC<{
    label: string;
    value: number;
    onChange: (value: number) => void;
    step?: number;
  }> = ({label, value, onChange, step = 0.1}) => {
    const decrease = () => {
      const newValue = Math.max(0, value - step);
      onChange(newValue);
    };

    const increase = () => {
      const newValue = Math.min(1, value + step);
      onChange(newValue);
    };

    return (
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>{label}</Text>
        <View style={styles.sliderControls}>
          <TouchableOpacity style={styles.sliderButton} onPress={decrease}>
            <Text style={styles.sliderButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.sliderValue}>{value.toFixed(2)}</Text>
          <TouchableOpacity style={styles.sliderButton} onPress={increase}>
            <Text style={styles.sliderButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={true}
      bounces={true}>
      {/* Matching Algorithm Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Matching Algorithm</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Audio Fingerprinting</Text>
          <Switch
            value={debugSettings.enableAudioFingerprinting}
            onValueChange={(value) => updateSetting('enableAudioFingerprinting', value)}
            trackColor={{false: '#333', true: '#007AFF'}}
            thumbColor={'#fff'}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Speech Transcription</Text>
          <Switch
            value={debugSettings.enableTranscription}
            onValueChange={(value) => updateSetting('enableTranscription', value)}
            trackColor={{false: '#333', true: '#007AFF'}}
            thumbColor={'#fff'}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>File Size Fallback</Text>
          <Switch
            value={debugSettings.enableSizeFallback}
            onValueChange={(value) => updateSetting('enableSizeFallback', value)}
            trackColor={{false: '#333', true: '#007AFF'}}
            thumbColor={'#fff'}
          />
        </View>
      </View>

      {/* Algorithm Weights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Algorithm Weights</Text>
        <Text style={styles.sectionDescription}>
          Adjust how much each matching method contributes to the final confidence score.
        </Text>

        <WeightSlider
          label="Audio Fingerprint Weight"
          value={debugSettings.fingerprintWeight}
          onChange={(value) => updateSetting('fingerprintWeight', value)}
        />

        <WeightSlider
          label="Transcription Weight"
          value={debugSettings.transcriptionWeight}
          onChange={(value) => updateSetting('transcriptionWeight', value)}
        />

        <WeightSlider
          label="File Size Weight"
          value={debugSettings.sizeWeight}
          onChange={(value) => updateSetting('sizeWeight', value)}
        />

        <View style={styles.weightSummary}>
          <Text style={styles.weightSummaryText}>
            Total Weight: {(debugSettings.fingerprintWeight + debugSettings.transcriptionWeight + debugSettings.sizeWeight).toFixed(2)}
          </Text>
          {Math.abs((debugSettings.fingerprintWeight + debugSettings.transcriptionWeight + debugSettings.sizeWeight) - 1.0) > 0.01 && (
            <Text style={styles.weightWarning}>
              ⚠️ Weights should sum to 1.0 for optimal results
            </Text>
          )}
        </View>
      </View>

      {/* Confidence Threshold */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Confidence Threshold</Text>
        <Text style={styles.sectionDescription}>
          Minimum confidence score required to consider a match successful.
        </Text>

        <WeightSlider
          label="Confidence Threshold"
          value={debugSettings.confidenceThreshold}
          onChange={(value) => updateSetting('confidenceThreshold', value)}
          step={0.05}
        />

        <View style={styles.thresholdGuide}>
          <Text style={styles.thresholdGuideTitle}>Threshold Guide:</Text>
          <Text style={styles.thresholdGuideItem}>• 0.9+ : Very strict, few false positives</Text>
          <Text style={styles.thresholdGuideItem}>• 0.7-0.9 : Balanced accuracy</Text>
          <Text style={styles.thresholdGuideItem}>• 0.5-0.7 : More permissive</Text>
          <Text style={styles.thresholdGuideItem}>• &lt;0.5 : Very permissive, many false positives</Text>
        </View>
      </View>

      {/* Logging Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Logging</Text>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Performance Logging</Text>
          <Switch
            value={debugSettings.enablePerformanceLogging}
            onValueChange={(value) => updateSetting('enablePerformanceLogging', value)}
            trackColor={{false: '#333', true: '#007AFF'}}
            thumbColor={'#fff'}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Verbose Logging</Text>
          <Switch
            value={debugSettings.enableVerboseLogging}
            onValueChange={(value) => updateSetting('enableVerboseLogging', value)}
            trackColor={{false: '#333', true: '#007AFF'}}
            thumbColor={'#fff'}
          />
        </View>
        
        <Text style={styles.loggingNote}>
          Note: Verbose logging may impact performance and should only be enabled for debugging.
        </Text>
      </View>

      {/* Quick Presets */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Presets</Text>
        
        <View style={styles.presetButtons}>
          <TouchableOpacity 
            style={styles.presetButton}
            onPress={() => {
              const preset = {
                enableAudioFingerprinting: true,
                enableTranscription: true,
                enableSizeFallback: false,
                fingerprintWeight: 0.6,
                transcriptionWeight: 0.4,
                sizeWeight: 0.0,
                confidenceThreshold: 0.8,
                enablePerformanceLogging: true,
                enableVerboseLogging: false,
              };
              setDebugSettings(preset);
              addLog('info', 'Settings', 'Applied High Accuracy preset', preset);
            }}>
            <Text style={styles.presetButtonText}>High Accuracy</Text>
            <Text style={styles.presetButtonDesc}>Fingerprint + Transcription</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.presetButton}
            onPress={() => {
              const preset = {
                enableAudioFingerprinting: true,
                enableTranscription: false,
                enableSizeFallback: true,
                fingerprintWeight: 0.7,
                transcriptionWeight: 0.0,
                sizeWeight: 0.3,
                confidenceThreshold: 0.6,
                enablePerformanceLogging: true,
                enableVerboseLogging: false,
              };
              setDebugSettings(preset);
              addLog('info', 'Settings', 'Applied Fast Processing preset', preset);
            }}>
            <Text style={styles.presetButtonText}>Fast Processing</Text>
            <Text style={styles.presetButtonDesc}>Fingerprint + Size only</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.presetButton}
            onPress={() => {
              const preset = {
                enableAudioFingerprinting: false,
                enableTranscription: false,
                enableSizeFallback: true,
                fingerprintWeight: 0.0,
                transcriptionWeight: 0.0,
                sizeWeight: 1.0,
                confidenceThreshold: 0.9,
                enablePerformanceLogging: false,
                enableVerboseLogging: false,
              };
              setDebugSettings(preset);
              addLog('info', 'Settings', 'Applied Legacy Mode preset', preset);
            }}>
            <Text style={styles.presetButtonText}>Legacy Mode</Text>
            <Text style={styles.presetButtonDesc}>Size-based only</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={exportSettings}>
          <Text style={styles.actionButtonText}>Export Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.actionButtonSecondary]} onPress={resetToDefaults}>
          <Text style={styles.actionButtonText}>Reset to Defaults</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
    lineHeight: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingLabel: {
    fontSize: 16,
    color: '#fff',
  },
  sliderContainer: {
    marginBottom: 16,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
  },
  sliderControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  sliderButton: {
    width: 36,
    height: 36,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  sliderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sliderValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    minWidth: 60,
    textAlign: 'center',
  },
  weightSummary: {
    backgroundColor: '#333',
    borderRadius: 6,
    padding: 12,
    marginTop: 16,
  },
  weightSummaryText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  weightWarning: {
    color: '#FF9500',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  thresholdGuide: {
    backgroundColor: '#333',
    borderRadius: 6,
    padding: 12,
    marginTop: 16,
  },
  thresholdGuideTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  thresholdGuideItem: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 4,
  },
  loggingNote: {
    color: '#999',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 8,
  },
  presetButtons: {
    gap: 12,
  },
  presetButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  presetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  presetButtonDesc: {
    color: '#999',
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonSecondary: {
    backgroundColor: '#333',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SettingsDebugger;