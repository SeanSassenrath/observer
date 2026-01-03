import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native';
import {useDebug} from './DebugContext';
import {DebugTab} from './types';
import FileAnalysisDebugger from './FileAnalysisDebugger';
import PerformanceMonitor from './PerformanceMonitor';
import SettingsDebugger from './SettingsDebugger';
import LogViewer from './LogViewer';

const {height: screenHeight} = Dimensions.get('window');

const DebugPanel: React.FC = () => {
  const {debugState, setDebugState} = useDebug();

  // Only show in development mode
  if (!__DEV__ || !debugState.isVisible) {
    return null;
  }

  const closePanel = () => {
    setDebugState(prev => ({
      ...prev,
      isVisible: false,
    }));
  };

  const setActiveTab = (tab: DebugTab) => {
    setDebugState(prev => ({
      ...prev,
      activeTab: tab,
    }));
  };

  const renderTabContent = () => {
    switch (debugState.activeTab) {
      case DebugTab.FILE_ANALYSIS:
        return <FileAnalysisDebugger />;
      case DebugTab.DATABASE:
        return <DatabaseDebugger />;
      case DebugTab.PERFORMANCE:
        return <PerformanceMonitor />;
      case DebugTab.SETTINGS:
        return <SettingsDebugger />;
      case DebugTab.LOGS:
        return <LogViewer />;
      case DebugTab.AUDIO_TEST:
        return <AudioAnalysisTest />;
      default:
        return <FileAnalysisDebugger />;
    }
  };

  const tabs = [
    {key: DebugTab.FILE_ANALYSIS, label: 'File Analysis', icon: '📁'},
    {key: DebugTab.DATABASE, label: 'Database', icon: '🗄️'},
    {key: DebugTab.PERFORMANCE, label: 'Performance', icon: '⚡'},
    {key: DebugTab.SETTINGS, label: 'Settings', icon: '⚙️'},
    {key: DebugTab.LOGS, label: 'Logs', icon: '📝'},
    {key: DebugTab.AUDIO_TEST, label: 'Audio Test', icon: '🎵'},
  ];

  return (
    <Modal
      visible={debugState.isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={closePanel}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🐛 Debug Panel</Text>
          <TouchableOpacity onPress={closePanel} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabScrollContent}
            style={styles.tabScrollView}>
            {tabs.map(tab => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tab,
                  debugState.activeTab === tab.key && styles.tabActive
                ]}
                onPress={() => setActiveTab(tab.key)}>
                <Text style={styles.tabIcon}>{tab.icon}</Text>
                <Text style={[
                  styles.tabText,
                  debugState.activeTab === tab.key && styles.tabTextActive
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {renderTabContent()}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    maxHeight: 80,
  },
  tabScrollView: {
    flexGrow: 0,
  },
  tabScrollContent: {
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
    alignItems: 'center',
    minWidth: 80,
  },
  tabActive: {
    backgroundColor: '#333',
  },
  tabIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
});

export default DebugPanel;