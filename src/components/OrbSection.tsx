import React, { useEffect } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { Layout } from '@ui-kitten/components';

export const OrbSection = () => {
  const naviTransformY = useSharedValue(60);
  const corpoTransformScale = useSharedValue(0.8);

  useEffect(() => {
    naviTransformY.value = withRepeat(withTiming(10, { duration: 6000, easing: Easing.inOut(Easing.ease) }), -1, true)
    corpoTransformScale.value = withRepeat(withTiming(1.01, { duration: 3000 }), -1, true)
  }, []);

  const naviReanimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: naviTransformY.value }]
    }
  })

  const corpoReanimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: corpoTransformScale.value }]
    }
  })

  return (
    <ImageBackground source={require('../assets/stars.png')} style={styles.container}>
      <LinearGradient colors={['rgba(16, 20, 38, 1)', 'rgba(16, 20, 38, 0)', 'rgba(16, 20, 38, 1)']}>
        <Layout style={styles.orbContainer}>
          <Animated.View
            style={[styles.navi, naviReanimatedStyle]}
          >
            <Layout style={[styles.orb2]} />
            <Animated.View
              style={[styles.orb, corpoReanimatedStyle]}
            />
          </Animated.View>
        </Layout>
      </LinearGradient>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  orbContainer: {
    height: 250,
    backgroundColor: 'transparent',
    marginBottom: 40,
  },
  navi: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orb: {
    height: 70,
    width: 70,
    backgroundColor: '#D5EDF5',
    borderRadius: 45,
    borderColor: 'rgba(160, 139, 247, 0.7)',
    borderWidth: 3,
    shadowColor: 'rgba(160, 139, 247, 1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    opacity: .95,
    marginTop: -70,
  },
  orb2: {
    height: 70,
    width: 70,
    backgroundColor: 'transparent',
    borderRadius: 45,
    shadowColor: 'rgba(250, 232, 130, 0.8)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 40,
  }
})
