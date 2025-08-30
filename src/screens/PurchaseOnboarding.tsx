import {Button, Icon, Layout, Text} from '@ui-kitten/components';
import React, {useState, useEffect} from 'react';
import {Image, SafeAreaView, StyleSheet, View} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

import {brightWhite} from '../constants/colors';
import {useNavigation} from '@react-navigation/native';
// import Purchases, {PurchasesOffering} from 'react-native-purchases';

const lastPage = 3;

const imageList = [
  require('../assets/app-icon.png'),
  require('../assets/home.jpeg'),
  require('../assets/med-player.png'),
  require('../assets/insight.png'),
];

const headerList = [
  'Welcome to the Unlimited Meditation Player',
  'All of your meditations in one place',
  'Enhanced Meditation Player',
  'Understand your practice like never before',
];

const descriptionList = [
  'A tool specifically made for your meditation journey.',
  'Easily find your meditation through an organized Library.',
  'Easily add breathwork before your meditation for a seamless experience.',
  'Get data on your meditation practice, streaks to stay motivated, and more.',
];

const ArrowIcon = () => (
  <Icon
    style={iconStyles.arrowIcon}
    fill={brightWhite}
    name="arrow-forward-outline"
  />
);

const PurchaseOnboarding = () => {
  const navigation = useNavigation();

  const [currentIndex, setCurrentIndex] = useState(0);
  // const [offering, setOffering] = useState({} as PurchasesOffering);

  // Animation for the glowing effect
  const glowAnimation = useSharedValue(0);

  useEffect(() => {
    if (currentIndex === 0) {
      glowAnimation.value = withRepeat(
        withTiming(1, {duration: 2000}),
        -1,
        true
      );
    }
  }, [currentIndex]);

  // useEffect(() => {
  //   fetchOfferings();
  // }, []);

  // const fetchOfferings = async () => {
  //   try {
  //     const offerings = await Purchases.getOfferings();
  //     if (offerings.current !== null) {
  //       console.log('Offerings', offerings.current);
  //       setOffering(offerings.current);
  //     }
  //   } catch (e) {
  //     console.log('error', e);
  //   }
  // };

  const onNextPress = () => {
    const nextIndex = currentIndex + 1;

    if (nextIndex > lastPage) {
      navigation.navigate('SignIn');
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  const currentImage = imageList[currentIndex];
  const currentHeader = headerList[currentIndex];
  const currentDescription = descriptionList[currentIndex];
  const progressStyle = (i: number, a: number) =>
    i === a ? styles.progressIndicatorActive : styles.progressIndicator;

  // Animated style for the glowing effect
  const animatedGlowStyle = useAnimatedStyle(() => {
    const shadowRadius = interpolate(glowAnimation.value, [0, 1], [10, 25]);
    const shadowOpacity = interpolate(glowAnimation.value, [0, 1], [0.4, 0.8]);
    
    return {
      shadowRadius,
      shadowOpacity,
    };
  });

  return (
    <Layout level="2" style={styles.rootContainer}>
      <SafeAreaView style={styles.rootContainer}>
        <View style={styles.topContainer}>
          {currentIndex === 0 ? (
            <Animated.View style={[styles.headerImageBackground, animatedGlowStyle]}>
              <Image source={currentImage} style={styles.heroImg} />
            </Animated.View>
          ) : (
            <View style={styles.imgContainer}>
              <Image source={currentImage} style={styles.heroImg} />
            </View>
          )}
        </View>
        <View style={styles.midContainer}>
          <Text category="h4" style={styles.headerText}>
            {currentHeader}
          </Text>
          <Text category="s1" style={styles.descriptionText}>
            {currentDescription}
          </Text>
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.progressContainer}>
            <View style={progressStyle(currentIndex, 0)} />
            <View style={progressStyle(currentIndex, 1)} />
            <View style={progressStyle(currentIndex, 2)} />
            <View style={progressStyle(currentIndex, 3)} />
          </View>
          <Button
            size="large"
            onPress={onNextPress}
            style={styles.buttonStyles}>
            <ArrowIcon />
          </Button>
        </View>
      </SafeAreaView>
    </Layout>
  );
};

const iconStyles = StyleSheet.create({
  arrowIcon: {
    height: 30,
    width: 30,
  },
});

const styles = StyleSheet.create({
  bottomContainer: {
    alignItems: 'center',
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  buttonStyles: {
    height: 70,
    width: 70,
    borderRadius: 100,
  },
  descriptionText: {},
  headerText: {
    marginBottom: 20,
  },
  heroImg: {
    borderRadius: 10,
    height: 350,
    width: 200,
    objectFit: 'contain',
  },
  headerImageBackground: {
    backgroundColor: 'transparent',
    shadowColor: 'rgba(160, 139, 247, 1)',
    shadowOpacity: 0.6,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 20,
  },
  imgContainer: {
    backgroundColor: 'black',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    height: 390,
    width: 180,
  },
  midContainer: {
    justifyContent: 'flex-end',
    flex: 2,
    paddingHorizontal: 20,
  },
  rootContainer: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
  },
  progressIndicator: {
    backgroundColor: brightWhite,
    borderRadius: 100,
    height: 15,
    marginRight: 10,
    opacity: 0.3,
    width: 15,
  },
  progressIndicatorActive: {
    backgroundColor: brightWhite,
    borderRadius: 100,
    height: 15,
    marginRight: 10,
    width: 15,
  },
  topContainer: {
    alignItems: 'center',
    flex: 6,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
});

export default PurchaseOnboarding;
