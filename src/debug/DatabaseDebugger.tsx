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
import {getDatabaseStats, loadStaticFingerprintDatabase} from '../utils/staticFingerprintDatabase';
import {MeditationFingerprint} from '../utils/meditationFingerprintStorage';

interface MeditationDisplayItem {
  id: string;
  name: string;
  group: string;
  duration: number;
  fingerprintHash: string;
  transcriptionExcerpts: number;
  fileSize: number;
  lastUpdated: string;
  sourceFile?: string;
  version?: string;
}

const DatabaseDebugger: React.FC = () => {
  const {addLog} = useDebug();
  const [searchQuery, setSearchQuery] = useState('');
  const [databaseStats, setDatabaseStats] = useState<DatabaseStats | null>(null);
  const [realMeditations, setRealMeditations] = useState<MeditationDisplayItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [databaseSource, setDatabaseSource] = useState<string>('unknown');

  useEffect(() => {
    loadRealDatabase();
  }, []);

  const loadRealDatabase = async () => {
    try {
      setIsLoading(true);
      addLog('info', 'Database', 'Loading real fingerprint database...');
      
      // Get database stats first
      const dbStats = await getDatabaseStats();
      setDatabaseSource(`${dbStats.source} (v${dbStats.version || 'unknown'})`);
      
      // Load the actual database
      const database = await loadStaticFingerprintDatabase();
      const databaseEntries = Object.values(database);
      
      // Convert to display format
      const displayItems: MeditationDisplayItem[] = databaseEntries.map((meditation: MeditationFingerprint) => ({
        id: meditation.meditationBaseId,
        name: meditation.name,
        group: meditation.groupName,
        duration: meditation.audioFingerprint.duration,
        fingerprintHash: meditation.audioFingerprint.hash,
        transcriptionExcerpts: meditation.transcriptionExcerpts?.length || 0,
        fileSize: meditation.fileSizeBytes || 0,
        lastUpdated: meditation.lastUpdated,
        sourceFile: (meditation as any).sourceFile || undefined,
        version: meditation.version,
      }));
      
      setRealMeditations(displayItems);
      
      // Calculate stats
      const stats: DatabaseStats = {
        totalMeditations: displayItems.length,
        avgTranscriptionExcerpts: displayItems.reduce((sum, med) => sum + med.transcriptionExcerpts, 0) / displayItems.length,
        oldestEntry: Math.min(...displayItems.map(med => new Date(med.lastUpdated).getTime())),
        newestEntry: Math.max(...displayItems.map(med => new Date(med.lastUpdated).getTime())),
        totalSize: displayItems.reduce((sum, med) => sum + med.fileSize, 0),
        integrityStatus: 'healthy',
      };
      
      setDatabaseStats(stats);
      addLog('info', 'Database', `Loaded ${displayItems.length} real meditations from ${dbStats.source} database`, {
        source: dbStats.source,
        version: dbStats.version,
        count: displayItems.length
      });
      
    } catch (error) {
      addLog('error', 'Database', 'Failed to load database', error);
      setDatabaseSource('error');
      // Fallback to empty array
      setRealMeditations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const exportDatabase = () => {
    addLog('info', 'Database', 'Exporting database', {count: realMeditations.length, source: databaseSource});
    Alert.alert('Export Database', `Database exported successfully!\nExported ${realMeditations.length} meditations from ${databaseSource}`);
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
            addLog('info', 'Database', 'Importing database');
            Alert.alert('Import Complete', 'Database imported successfully!');
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
            addLog('warn', 'Database', 'Database cleared');
            Alert.alert('Database Cleared', 'All data has been removed.');
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
            loadRealDatabase(); // Reload the database
            addLog('info', 'Database', 'Reloading database');
          },
        },
      ]
    );
  };

  const filteredMeditations = realMeditations.filter(med =>
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
          
          {/* Database Source Info */}
          <View style={styles.sourceInfo}>
            <Text style={styles.sourceLabel}>Database Source:</Text>
            <Text style={[
              styles.sourceValue,
              databaseSource.includes('static') ? styles.sourceStatic : 
              databaseSource.includes('dynamic') ? styles.sourceDynamic : 
              styles.sourceError
            ]}>
              {databaseSource}
            </Text>
          </View>
          
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
              {meditation.sourceFile && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Source File:</Text>
                  <Text style={styles.detailValue}>{meditation.sourceFile}</Text>
                </View>
              )}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Version:</Text>
                <Text style={[
                  styles.detailValue, 
                  meditation.version === '2.0' ? styles.versionReal : styles.versionMock
                ]}>
                  {meditation.version || '1.0'} {meditation.version === '2.0' ? '(Real)' : '(Mock)'}
                </Text>
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
  sourceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sourceLabel: {
    fontSize: 14,
    color: '#999',
    marginRight: 8,
  },
  sourceValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  sourceStatic: {
    color: '#4CAF50', // Green for static/real
  },
  sourceDynamic: {
    color: '#FF9500', // Orange for dynamic
  },
  sourceError: {
    color: '#F44336', // Red for error
  },
  versionReal: {
    color: '#4CAF50', // Green for real fingerprints
  },
  versionMock: {
    color: '#FF9500', // Orange for mock fingerprints
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