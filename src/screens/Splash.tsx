import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, { Easing, FadeInUp, FadeOutUp, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

const Splash = () => {
  const corpoTransformScale = useSharedValue(0.8);

  useEffect(() => {
    corpoTransformScale.value = withRepeat(withTiming(0.9, { duration: 1000, easing: Easing.inOut(Easing.ease) }), -1, true)
  }, []);

  const corpoReanimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: corpoTransformScale.value }]
    }
  })

  return (
    <Animated.View style={styles.container} entering={FadeInUp.duration(300)} exiting={FadeOutUp.duration(300)}>
      <View style={styles.orbContainer}>
        <Animated.View
          style={[styles.orb, corpoReanimatedStyle]}
        />
      </View>
      <Image
        source={require('../assets/app-icon.png')}
        style={styles.image}
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'rgb(16, 20, 38)',
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    height: 80,
    width: 80,
  },
  orbContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orb: {
    height: 120,
    width: 120,
    borderRadius: 100,
    backgroundColor: '#D5EDF5',
    shadowColor: 'rgba(160, 139, 247, 0.9)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    opacity: .15,
  },
});

export default Splash;
