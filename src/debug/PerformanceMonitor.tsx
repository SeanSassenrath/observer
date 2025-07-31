import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useDebug} from './DebugContext';

const PerformanceMonitor: React.FC = () => {
  const {debugState, updatePerformanceMetrics, addLog} = useDebug();
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [recentProcessingTimes, setRecentProcessingTimes] = useState<number[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isMonitoring) {
      interval = setInterval(() => {
        // Simulate performance data collection
        const mockMetrics = {
          audioProcessingTime: Math.random() * 2000 + 500,
          transcriptionTime: Math.random() * 8000 + 2000,
          matchingTime: Math.random() * 500 + 100,
          memoryUsage: Math.random() * 100 + 50,
        };
        
        const totalTime = mockMetrics.audioProcessingTime + mockMetrics.transcriptionTime + mockMetrics.matchingTime;
        
        updatePerformanceMetrics({
          ...mockMetrics,
          totalProcessingTime: totalTime,
          totalProcessed: debugState.performanceMetrics.totalProcessed + 1,
          successRate: Math.random() * 0.2 + 0.8, // 80-100% success rate
        });

        setRecentProcessingTimes(prev => [...prev.slice(-9), totalTime]);
      }, 3000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isMonitoring, updatePerformanceMetrics, debugState.performanceMetrics.totalProcessed]);

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    addLog('info', 'Performance', `Performance monitoring ${!isMonitoring ? 'started' : 'stopped'}`);
  };

  const clearMetrics = () => {
    updatePerformanceMetrics({
      audioProcessingTime: 0,
      transcriptionTime: 0,
      matchingTime: 0,
      totalProcessingTime: 0,
      memoryUsage: 0,
      successRate: 0,
      totalProcessed: 0,
    });
    setRecentProcessingTimes([]);
    addLog('info', 'Performance', 'Performance metrics cleared');
  };

  const getPerformanceStatus = (value: number, thresholds: {good: number, warning: number}) => {
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.warning) return 'warning';
    return 'error';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return '#4CAF50';
      case 'warning': return '#FF9500';
      case 'error': return '#F44336';
      default: return '#999';
    }
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatMemory = (mb: number) => {
    return `${mb.toFixed(1)} MB`;
  };

  const metrics = debugState.performanceMetrics;

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={true}
      bounces={true}>
      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.button, isMonitoring ? styles.buttonStop : styles.buttonStart]} 
          onPress={toggleMonitoring}>
          <Text style={styles.buttonText}>
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={clearMetrics}>
          <Text style={styles.buttonText}>Clear Metrics</Text>
        </TouchableOpacity>
      </View>

      {/* Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Overview</Text>
        <View style={styles.overviewGrid}>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewValue}>{metrics.totalProcessed}</Text>
            <Text style={styles.overviewLabel}>Total Processed</Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={[styles.overviewValue, {color: getStatusColor('good')}]}>
              {(metrics.successRate * 100).toFixed(1)}%
            </Text>
            <Text style={styles.overviewLabel}>Success Rate</Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewValue}>{formatTime(metrics.totalProcessingTime)}</Text>
            <Text style={styles.overviewLabel}>Avg Total Time</Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewValue}>{formatMemory(metrics.memoryUsage)}</Text>
            <Text style={styles.overviewLabel}>Memory Usage</Text>
          </View>
        </View>
      </View>

      {/* Processing Times */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Processing Times</Text>
        
        <View style={styles.metricItem}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricName}>Audio Processing</Text>
            <Text style={[
              styles.metricValue,
              {color: getStatusColor(getPerformanceStatus(metrics.audioProcessingTime, {good: 1000, warning: 2000}))}
            ]}>
              {formatTime(metrics.audioProcessingTime)}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                {
                  width: `${Math.min((metrics.audioProcessingTime / 3000) * 100, 100)}%`,
                  backgroundColor: getStatusColor(getPerformanceStatus(metrics.audioProcessingTime, {good: 1000, warning: 2000}))
                }
              ]} 
            />
          </View>
        </View>

        <View style={styles.metricItem}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricName}>Transcription</Text>
            <Text style={[
              styles.metricValue,
              {color: getStatusColor(getPerformanceStatus(metrics.transcriptionTime, {good: 5000, warning: 10000}))}
            ]}>
              {formatTime(metrics.transcriptionTime)}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                {
                  width: `${Math.min((metrics.transcriptionTime / 15000) * 100, 100)}%`,
                  backgroundColor: getStatusColor(getPerformanceStatus(metrics.transcriptionTime, {good: 5000, warning: 10000}))
                }
              ]} 
            />
          </View>
        </View>

        <View style={styles.metricItem}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricName}>Matching</Text>
            <Text style={[
              styles.metricValue,
              {color: getStatusColor(getPerformanceStatus(metrics.matchingTime, {good: 200, warning: 500}))}
            ]}>
              {formatTime(metrics.matchingTime)}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                {
                  width: `${Math.min((metrics.matchingTime / 1000) * 100, 100)}%`,
                  backgroundColor: getStatusColor(getPerformanceStatus(metrics.matchingTime, {good: 200, warning: 500}))
                }
              ]} 
            />
          </View>
        </View>
      </View>

      {/* Recent Processing Times Chart */}
      {recentProcessingTimes.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Processing Times</Text>
          <View style={styles.chartContainer}>
            <View style={styles.chart}>
              {recentProcessingTimes.map((time, index) => {
                const maxTime = Math.max(...recentProcessingTimes);
                const height = (time / maxTime) * 100;
                const status = getPerformanceStatus(time, {good: 8000, warning: 15000});
                
                return (
                  <View key={index} style={styles.chartBar}>
                    <View 
                      style={[
                        styles.chartBarFill,
                        {
                          height: `${height}%`,
                          backgroundColor: getStatusColor(status),
                        }
                      ]} 
                    />
                    <Text style={styles.chartBarLabel}>{index + 1}</Text>
                  </View>
                );
              })}
            </View>
            <Text style={styles.chartNote}>
              Max: {formatTime(Math.max(...recentProcessingTimes))} | 
              Avg: {formatTime(recentProcessingTimes.reduce((a, b) => a + b, 0) / recentProcessingTimes.length)}
            </Text>
          </View>
        </View>
      )}

      {/* Performance Recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommendations</Text>
        <View style={styles.recommendations}>
          {metrics.audioProcessingTime > 2000 && (
            <Text style={styles.recommendation}>
              ⚠️ Audio processing is slow. Consider optimizing fingerprint extraction.
            </Text>
          )}
          {metrics.transcriptionTime > 10000 && (
            <Text style={styles.recommendation}>
              ⚠️ Transcription is taking too long. Check speech recognition configuration.
            </Text>
          )}
          {metrics.memoryUsage > 150 && (
            <Text style={styles.recommendation}>
              ⚠️ High memory usage detected. Consider clearing audio buffers more frequently.
            </Text>
          )}
          {metrics.successRate < 0.8 && (
            <Text style={styles.recommendation}>
              ❌ Low success rate. Review matching algorithm parameters.
            </Text>
          )}
          {metrics.audioProcessingTime <= 1000 && metrics.transcriptionTime <= 5000 && metrics.memoryUsage <= 100 && metrics.successRate >= 0.9 && (
            <Text style={[styles.recommendation, styles.recommendationGood]}>
              ✅ Performance is optimal. All metrics are within acceptable ranges.
            </Text>
          )}
        </View>
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
  controls: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonStart: {
    backgroundColor: '#4CAF50',
  },
  buttonStop: {
    backgroundColor: '#F44336',
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
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  overviewItem: {
    flex: 1,
    minWidth: '22%',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
  },
  overviewValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  metricItem: {
    marginBottom: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricName: {
    fontSize: 14,
    color: '#fff',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    gap: 4,
    marginBottom: 8,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 2,
    minHeight: 4,
  },
  chartBarLabel: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
  chartNote: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  recommendations: {
    gap: 8,
  },
  recommendation: {
    fontSize: 14,
    color: '#FF9500',
    lineHeight: 20,
  },
  recommendationGood: {
    color: '#4CAF50',
  },
});

export default PerformanceMonitor;