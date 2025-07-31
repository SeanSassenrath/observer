import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Share,
} from 'react-native';
import {useDebug} from './DebugContext';
import {DebugLog} from './types';

const LogViewer: React.FC = () => {
  const {debugState, clearLogs, addLog} = useDebug();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<DebugLog['level'] | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredLogs = useMemo(() => {
    return debugState.logs.filter(log => {
      const matchesSearch = searchQuery === '' || 
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLevel = selectedLevel === 'all' || log.level === selectedLevel;
      
      const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory;
      
      return matchesSearch && matchesLevel && matchesCategory;
    });
  }, [debugState.logs, searchQuery, selectedLevel, selectedCategory]);

  const categories = useMemo(() => {
    const cats = ['all', ...new Set(debugState.logs.map(log => log.category))];
    return cats;
  }, [debugState.logs]);

  const levels: Array<DebugLog['level'] | 'all'> = ['all', 'debug', 'info', 'warn', 'error'];

  const getLevelColor = (level: DebugLog['level']) => {
    switch (level) {
      case 'debug': return '#666';
      case 'info': return '#007AFF';
      case 'warn': return '#FF9500';
      case 'error': return '#F44336';
      default: return '#999';
    }
  };

  const getLevelIcon = (level: DebugLog['level']) => {
    switch (level) {
      case 'debug': return '🔍';
      case 'info': return 'ℹ️';
      case 'warn': return '⚠️';
      case 'error': return '❌';
      default: return '📝';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  const generateTestLogs = () => {
    const testLogs = [
      { level: 'info' as const, category: 'FileAnalysis', message: 'Starting file upload analysis', data: { fileName: 'test.mp3' } },
      { level: 'debug' as const, category: 'AudioFingerprint', message: 'Extracting audio peaks', data: { peaks: 247 } },
      { level: 'warn' as const, category: 'Transcription', message: 'Low confidence in transcription', data: { confidence: 0.45 } },
      { level: 'info' as const, category: 'Database', message: 'Found 3 candidate matches', data: { matches: ['m-botec-1', 'm-botec-2'] } },
      { level: 'error' as const, category: 'AudioFingerprint', message: 'Failed to extract fingerprint', data: { error: 'Invalid audio format' } },
    ];

    testLogs.forEach(log => {
      addLog(log.level, log.category, log.message, log.data);
    });
  };

  const exportLogs = async () => {
    const logsText = filteredLogs.map(log => {
      const timestamp = formatTimestamp(log.timestamp);
      const data = log.data ? `\nData: ${JSON.stringify(log.data, null, 2)}` : '';
      return `[${timestamp}] ${log.level.toUpperCase()} ${log.category}: ${log.message}${data}`;
    }).join('\n\n');

    try {
      await Share.share({
        message: `Debug Logs Export (${filteredLogs.length} entries)\n\n${logsText}`,
        title: 'Debug Logs Export',
      });
    } catch (error) {
      addLog('error', 'LogViewer', 'Failed to export logs', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.controlRow}>
          <TouchableOpacity style={styles.controlButton} onPress={generateTestLogs}>
            <Text style={styles.controlButtonText}>Generate Test Logs</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={exportLogs}>
            <Text style={styles.controlButtonText}>Export</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.controlButton, styles.dangerButton]} onPress={clearLogs}>
            <Text style={styles.controlButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search logs..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Filters */}
        <View style={styles.filterRow}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.filterScroll}
            contentContainerStyle={styles.filterScrollContent}>
            {/* Level Filter */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Level:</Text>
              {levels.map(level => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.filterChip,
                    selectedLevel === level && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedLevel(level)}>
                  <Text style={[
                    styles.filterChipText,
                    selectedLevel === level && styles.filterChipTextActive
                  ]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Category Filter */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Category:</Text>
              {categories.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterChip,
                    selectedCategory === category && styles.filterChipActive
                  ]}
                  onPress={() => setSelectedCategory(category)}>
                  <Text style={[
                    styles.filterChipText,
                    selectedCategory === category && styles.filterChipTextActive
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <Text style={styles.statsText}>
            Showing {filteredLogs.length} of {debugState.logs.length} logs
          </Text>
        </View>
      </View>

      {/* Logs */}
      <ScrollView 
        style={styles.logsContainer} 
        contentContainerStyle={styles.logsContent}
        showsVerticalScrollIndicator={true}
        bounces={true}>
        {filteredLogs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No logs to display</Text>
            <Text style={styles.emptyStateSubtext}>
              {debugState.logs.length === 0 ? 
                'Generate test logs or use the app to see logs here' : 
                'Try adjusting your search or filter criteria'
              }
            </Text>
          </View>
        ) : (
          filteredLogs.map((log, index) => (
            <View key={log.id} style={styles.logEntry}>
              <View style={styles.logHeader}>
                <View style={styles.logHeaderLeft}>
                  <Text style={styles.logIcon}>{getLevelIcon(log.level)}</Text>
                  <Text style={[styles.logLevel, {color: getLevelColor(log.level)}]}>
                    {log.level.toUpperCase()}
                  </Text>
                  <Text style={styles.logCategory}>{log.category}</Text>
                </View>
                <Text style={styles.logTimestamp}>{formatTimestamp(log.timestamp)}</Text>
              </View>
              
              <Text style={styles.logMessage}>{log.message}</Text>
              
              {log.data && (
                <View style={styles.logData}>
                  <Text style={styles.logDataTitle}>Data:</Text>
                  <Text style={styles.logDataContent}>
                    {JSON.stringify(log.data, null, 2)}
                  </Text>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controls: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  controlRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  controlButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  dangerButton: {
    backgroundColor: '#F44336',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  searchInput: {
    backgroundColor: '#333',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#fff',
    fontSize: 14,
    marginBottom: 12,
  },
  filterRow: {
    marginBottom: 8,
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  filterLabel: {
    color: '#999',
    fontSize: 12,
    marginRight: 8,
  },
  filterChip: {
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 4,
  },
  filterChipActive: {
    backgroundColor: '#007AFF',
  },
  filterChipText: {
    color: '#999',
    fontSize: 10,
    textTransform: 'capitalize',
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  stats: {
    alignItems: 'center',
  },
  statsText: {
    color: '#666',
    fontSize: 12,
  },
  logsContainer: {
    flex: 1,
  },
  logsContent: {
    padding: 16,
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
  logEntry: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  logLevel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 8,
    minWidth: 40,
  },
  logCategory: {
    fontSize: 12,
    color: '#FF9500',
    fontWeight: '600',
  },
  logTimestamp: {
    fontSize: 10,
    color: '#666',
    fontFamily: 'monospace',
  },
  logMessage: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  logData: {
    backgroundColor: '#1a1a1a',
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
  },
  logDataTitle: {
    color: '#999',
    fontSize: 12,
    marginBottom: 4,
  },
  logDataContent: {
    color: '#ccc',
    fontSize: 11,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
});

export default LogViewer;