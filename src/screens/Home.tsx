import React, { useContext, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import { Avatar, Button, Card, Icon, Layout, Text } from '@ui-kitten/components'; 

import _Button from '../components/Button';
import { MeditationScreenNavigationProp, MeditationId, LibraryScreenNavigationProp } from '../types';
import { meditationMap } from '../constants/meditation';
import { removeUnlockedMeditationIdsFromAsyncStorage } from '../utils/filePicker';
import RecentMeditationIdsContext, { removeRecentMeditationIdsFromAsyncStorage } from '../contexts/recentMeditationData';
import { removeFtuxStateFromAsyncStorage } from '../utils/ftux';
import { CardV2, EmptyCard } from '../components/Card';
import { HomeTopBar } from '../components/HomeTopBar';
import { MeditationList } from '../components/MeditationList';
import { HomeStreaks } from '../components/HomeStreaks';

const SearchIcon = (props: any) => (
  <Icon {...props} style={styles.searchIcon} fill='#b2b2b2' name='search' />
);

const HomeScreen = () => {
  const { recentMeditationIds } = useContext(RecentMeditationIdsContext);
  const meditationNavigation = useNavigation<MeditationScreenNavigationProp>();
  const tabNavigation = useNavigation<LibraryScreenNavigationProp>();

  const onMeditationClick = (meditationId: MeditationId) => {
    console.log('Testing >>>')
    if (meditationId) {
      meditationNavigation.navigate('Meditation', {
        id: meditationId,
      });
    }
  }

  const onStartClick = () => {
    tabNavigation.navigate('Library');
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
          <HomeTopBar />
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
            <Button
              size='small'
              appearance='ghost'
              onPress={removeUnlockedMeditationIdsFromAsyncStorage}
            >
              Remove Meditation Ids
            </Button>
            <Button
              size='small'
              appearance='ghost'
              onPress={removeRecentMeditationIdsFromAsyncStorage}
            >
              Remove Recent Ids
            </Button>
            <Button
              size='small'
              appearance='ghost'
              onPress={removeFtuxStateFromAsyncStorage}
            >
              Remove FTUX state
            </Button>
          </Layout>
        </ScrollView>
      </SafeAreaView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  bannerText: {
    paddingBottom: 10,
  },
  container: {
    flex: 1,
  },
  manageMeditationButton: {
    width: 200,
    padding: 0,
    color: 'gray',
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