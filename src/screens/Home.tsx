import React, { useContext, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import { Card, Layout, Text, withStyles } from '@ui-kitten/components'; 
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import _Button from '../components/Button';
import { MeditationScreenNavigationProp, MeditationId, LibraryScreenNavigationProp } from '../types';
import RecentMeditationIdsContext from '../contexts/recentMeditationData';
import { HomeTopBar } from '../components/HomeTopBar';
import { MeditationList } from '../components/MeditationList';
import { HomeStreaks } from '../components/HomeStreaks';

const HomeScreen = () => {
  const { recentMeditationIds } = useContext(RecentMeditationIdsContext);
  const stackNavigation = useNavigation<MeditationScreenNavigationProp>();
  const tabNavigation = useNavigation<LibraryScreenNavigationProp>();
  const naviTransformY = useSharedValue(0);

  useEffect(() => {
    naviTransformY.value = withRepeat(withTiming(-45, { duration: 5000, easing: Easing.inOut(Easing.ease)}), -1, true)
  }, []);

  const naviReanimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: naviTransformY.value }]
    }
  })

  const onMeditationClick = (meditationId: MeditationId) => {
    if (meditationId) {
      stackNavigation.navigate('Meditation', {
        id: meditationId,
      });
    }
  }

  const onStartClick = () => {
    tabNavigation.navigate('Library');
  }

  const onVoidPress = () => {
    stackNavigation.navigate('Debug');
  }

  const renderStartMeditation = () => (
    <Card
      appearance='filled'
      style={styles.startCard}
    >
      <Text
        category='h6'
        style={styles.startCardHeader}
      >
        Welcome to your home!
      </Text>
      <Text
        category='s1'
        style={styles.startCardDescription}
      >
        Select a meditation from the library to get started
      </Text>
      <_Button onPress={onStartClick}>SELECT MEDITATION</_Button>
    </Card>
  )

  return (
    <Layout style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <SafeAreaView style={styles.container}>
          <HomeTopBar onVoidPress={onVoidPress} />
          <Layout style={styles.orbContainer}>
            <Animated.View
              style={[styles.navi, naviReanimatedStyle]}
            >
              <Layout style={[styles.orb2]} />
              <Animated.View
                style={[styles.orb]}
              />
            </Animated.View>
          </Layout>
          <HomeStreaks />
          <Layout>
            {/* <MeditationList
              header='Recently Uploaded'
              meditationIds={recentMeditationIds}
              onMeditationPress={onMeditationClick}
            /> */}
            <MeditationList
              header='Recent Meditations'
              meditationIds={recentMeditationIds}
              onMeditationPress={onMeditationClick}
            />
            <MeditationList
              header='Favorites'
              meditationIds={[]}
              onMeditationPress={_.noop}
            />
          </Layout>
        </SafeAreaView>
      </ScrollView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  startCard: {
    backgroundColor: '#31384b',
    margin: 20,
    padding: 6,
  },
  startCardHeader: {
    marginBottom: 8,
  },
  startCardDescription: {
    marginBottom: 20,
  },
  scrollContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  orbContainer: {
    height: 200,
    backgroundColor: 'black',
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
    opacity: .9,
    marginTop: -70,
  },
  orb2: {
    height: 70,
    width: 70,
    // backgroundColor: '#D5EDF5',
    borderRadius: 45,
    shadowColor: 'rgba(250, 232, 130, 0.8)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 40,
  }
})

export default HomeScreen;