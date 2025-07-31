import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {useDebug} from './DebugContext';
import {DatabaseStats} from './types';

const DatabaseDebugger: React.FC = () => {
  const {addLog} = useDebug();
  const [searchQuery, setSearchQuery] = useState('');
  const [databaseStats, setDatabaseStats] = useState<DatabaseStats | null>(null);
  const [mockMeditations] = useState([
    {
      id: 'm-botec-1',
      name: 'Blessing of the Energy Centers 01',
      group: 'Blessing of the Energy Centers',
      duration: 2520,
      fingerprintHash: 'abc123def456',
      transcriptionExcerpts: 3,
      fileSize: 61719924,
      lastUpdated: '2024-01-15T10:30:00Z',
    },
    {
      id: 'm-botec-2',
      name: 'Blessing of the Energy Centers 02',
      group: 'Blessing of the Energy Centers',
      duration: 2640,
      fingerprintHash: 'def456ghi789',
      transcriptionExcerpts: 3,
      fileSize: 69705557,
      lastUpdated: '2024-01-16T14:20:00Z',
    },
    {
      id: 'm-breath-new-potentials',
      name: 'Breath Work - New Potentials',
      group: 'Breathwork',
      duration: 1800,
      fingerprintHash: 'ghi789jkl012',
      transcriptionExcerpts: 2,
      fileSize: 47856321,
      lastUpdated: '2024-01-17T09:15:00Z',
    },
    {
      id: 'm-daily-morning',
      name: 'Daily Morning Meditation',
      group: 'Daily Meditations',
      duration: 1260,
      fingerprintHash: 'jkl012mno345',
      transcriptionExcerpts: 2,
      fileSize: 33524789,
      lastUpdated: '2024-01-18T07:45:00Z',
    },
  ]);

  useEffect(() => {
    loadDatabaseStats();
  }, []);

  const loadDatabaseStats = () => {
    // Simulate loading database stats
    const stats: DatabaseStats = {
      totalMeditations: mockMeditations.length,
      avgTranscriptionExcerpts: mockMeditations.reduce((sum, med) => sum + med.transcriptionExcerpts, 0) / mockMeditations.length,
      oldestEntry: Math.min(...mockMeditations.map(med => new Date(med.lastUpdated).getTime())),
      newestEntry: Math.max(...mockMeditations.map(med => new Date(med.lastUpdated).getTime())),
      totalSize: mockMeditations.reduce((sum, med) => sum + med.fileSize, 0),
      integrityStatus: 'healthy',
    };
    
    setDatabaseStats(stats);
    addLog('info', 'Database', 'Loaded database statistics', stats);
  };

  const exportDatabase = () => {
    addLog('info', 'Database', 'Exporting database (mock)', {count: mockMeditations.length});
    Alert.alert('Export Database', 'Database exported successfully!\n(This is a mock implementation)');
  };

  const importDatabase = () => {
    Alert.alert(
      'Import Database',
      'Are you sure you want to import a database? This will replace the current database.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Import',
          style: 'destructive',
          onPress: () => {
            addLog('info', 'Database', 'Importing database (mock)');
            Alert.alert('Import Complete', 'Database imported successfully!\n(This is a mock implementation)');
          },
        },
      ]
    );
  };

  const clearDatabase = () => {
    Alert.alert(
      'Clear Database',
      'Are you sure you want to clear the entire database? This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            addLog('warn', 'Database', 'Database cleared (mock)');
            Alert.alert('Database Cleared', 'All data has been removed.\n(This is a mock implementation)');
          },
        },
      ]
    );
  };

  const rebuildDatabase = () => {
    Alert.alert(
      'Rebuild Database',
      'This will rebuild all fingerprints and transcriptions. This may take several minutes.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Rebuild',
          onPress: () => {
            addLog('info', 'Database', 'Starting database rebuild (mock)');
            Alert.alert('Database Rebuild', 'Rebuild started in background.\n(This is a mock implementation)');
          },
        },
      ]
    );
  };

  const filteredMeditations = mockMeditations.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.group.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatFileSize = (bytes: number) => {
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={true}
      bounces={true}>
      {/* Database Stats */}
      {databaseStats && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Database Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{databaseStats.totalMeditations}</Text>
              <Text style={styles.statLabel}>Total Meditations</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{databaseStats.avgTranscriptionExcerpts.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Avg Excerpts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatFileSize(databaseStats.totalSize)}</Text>
              <Text style={styles.statLabel}>Total Size</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, styles.statusHealthy]}>
                {databaseStats.integrityStatus.toUpperCase()}
              </Text>
              <Text style={styles.statLabel}>Status</Text>
            </View>
          </View>
        </View>
      )}

      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.controlRow}>
          <TouchableOpacity style={styles.controlButton} onPress={exportDatabase}>
            <Text style={styles.controlButtonText}>Export</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={importDatabase}>
            <Text style={styles.controlButtonText}>Import</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={rebuildDatabase}>
            <Text style={styles.controlButtonText}>Rebuild</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.controlButton, styles.dangerButton]} onPress={clearDatabase}>
          <Text style={styles.controlButtonText}>Clear Database</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Meditation Database ({filteredMeditations.length})</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search meditations..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Meditation List */}
      <View style={styles.meditationList}>
        {filteredMeditations.map((meditation, index) => (
          <View key={meditation.id} style={styles.meditationItem}>
            <View style={styles.meditationHeader}>
              <Text style={styles.meditationName}>{meditation.name}</Text>
              <Text style={styles.meditationDuration}>{formatDuration(meditation.duration)}</Text>
            </View>
            
            <Text style={styles.meditationGroup}>{meditation.group}</Text>
            
            <View style={styles.meditationDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>ID:</Text>
                <Text style={styles.detailValue}>{meditation.id}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>File Size:</Text>
                <Text style={styles.detailValue}>{formatFileSize(meditation.fileSize)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Fingerprint:</Text>
                <Text style={styles.detailValue}>{meditation.fingerprintHash}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Excerpts:</Text>
                <Text style={styles.detailValue}>{meditation.transcriptionExcerpts}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Updated:</Text>
                <Text style={styles.detailValue}>{formatDate(meditation.lastUpdated)}</Text>
              </View>
            </View>

            <View style={styles.meditationActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => addLog('info', 'Database', `Viewing details for ${meditation.name}`, meditation)}>
                <Text style={styles.actionButtonText}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.actionButtonSecondary]}
                onPress={() => addLog('info', 'Database', `Regenerating fingerprint for ${meditation.name}`)}>
                <Text style={styles.actionButtonText}>Regenerate</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    flex: 1,
    minWidth: '22%',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  statusHealthy: {
    color: '#4CAF50',
  },
  controls: {
    marginBottom: 16,
  },
  controlRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  controlButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  dangerButton: {
    backgroundColor: '#F44336',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  searchInput: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
  },
  meditationList: {
    gap: 12,
  },
  meditationItem: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 16,
  },
  meditationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  meditationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  meditationDuration: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  meditationGroup: {
    fontSize: 14,
    color: '#FF9500',
    marginBottom: 12,
  },
  meditationDetails: {
    backgroundColor: '#333',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    color: '#999',
    fontSize: 12,
    minWidth: 80,
  },
  detailValue: {
    color: '#fff',
    fontSize: 12,
    flex: 1,
    fontFamily: 'monospace',
  },
  meditationActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonSecondary: {
    backgroundColor: '#333',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default DatabaseDebugger;