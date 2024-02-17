import {Button, Icon, Layout, Text} from '@ui-kitten/components';
import React, {useState} from 'react';
import {Image, SafeAreaView, StyleSheet, View} from 'react-native';

import {brightWhite} from '../constants/colors';
import {useNavigation} from '@react-navigation/native';

const lastPage = 2;

const imageList = [
  require('../assets/home.jpeg'),
  require('../assets/med-player.png'),
  require('../assets/insight.png'),
];

const headerList = [
  'All of your meditations in one place',
  'Enhanced Meditation Player',
  'Understand your practice like never before',
];

const descriptionList = [
  'Automatically organized library. Easily search and start meditations.',
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

  const onNextPress = () => {
    const nextIndex = currentIndex + 1;

    if (nextIndex > lastPage) {
      // navigation.navigate('Purchase');
      navigation.navigate('AddMeditations');
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  const currentImage = imageList[currentIndex];
  const currentHeader = headerList[currentIndex];
  const currentDescription = descriptionList[currentIndex];
  const progressStyle = (i: number, a: number) =>
    i === a ? styles.progressIndicatorActive : styles.progressIndicator;

  return (
    <Layout level="2" style={styles.rootContainer}>
      <SafeAreaView style={styles.rootContainer}>
        <View style={styles.topContainer}>
          <View style={styles.imgContainer}>
            <Image source={currentImage} style={styles.heroImg} />
          </View>
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
