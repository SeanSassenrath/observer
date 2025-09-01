import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Animated, View} from 'react-native';
import {useDebug} from './DebugContext';

const DebugButton: React.FC = () => {
  const {debugState, setDebugState} = useDebug();

  const toggleDebugPanel = () => {
    setDebugState(prev => ({
      ...prev,
      isVisible: !prev.isVisible,
    }));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          debugState.isVisible && styles.buttonActive
        ]}
        onPress={toggleDebugPanel}
        activeOpacity={0.8}>
        <Text style={styles.buttonText}>🐛</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 9999,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  buttonActive: {
    backgroundColor: 'rgba(255, 165, 0, 0.8)',
  },
  buttonText: {
    fontSize: 24,
  },
});

export default DebugButton;