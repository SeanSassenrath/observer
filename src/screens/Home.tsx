import React, { useContext, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import { Card, Layout, Text } from '@ui-kitten/components'; 

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
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
          <HomeTopBar onVoidPress={onVoidPress}/>
          <HomeStreaks />
          <Layout>
            <MeditationList
              header='Recently Uploaded'
              meditationIds={recentMeditationIds}
              onMeditationPress={onMeditationClick}
            />
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
        </ScrollView>
      </SafeAreaView>
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
})

export default HomeScreen;