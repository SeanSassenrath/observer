import React, { useContext, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import _, { sortBy } from 'lodash';
import { Card, Layout, Text } from '@ui-kitten/components'; 

import _Button from '../components/Button';
import { MeditationScreenNavigationProp, MeditationId, LibraryScreenNavigationProp } from '../types';
import RecentMeditationIdsContext from '../contexts/recentMeditationData';
import { HomeTopBar } from '../components/HomeTopBar';
import { MeditationList } from '../components/MeditationList';
import { HomeStreaks } from '../components/HomeStreaks';
import { Inspiration } from '../components/Inspiration';
import UserContext from '../contexts/userData';

const HomeScreen = () => {
  const { user } = useContext(UserContext);
  const stackNavigation = useNavigation<MeditationScreenNavigationProp>();
  const tabNavigation = useNavigation<LibraryScreenNavigationProp>();

  const recentMeditationBaseIds = user && user.meditationUserData && user.meditationUserData.recentMeditationBaseIds || [];

  let favoriteMeditations = [] as MeditationId[];
  const meditationInstanceCounts = user
    && user.meditationUserData
    && user.meditationUserData.meditationCounts;

  if (meditationInstanceCounts) {
    const allMeditationIds = Object.keys(meditationInstanceCounts);
    favoriteMeditations = allMeditationIds.slice(0, 5);
  }

  const sortedMeditationInstanceCounts = sortBy(meditationInstanceCounts);

  const onMeditationPress = (meditationId: MeditationId) => {
    if (meditationId) {
      stackNavigation.navigate('Meditation', {
        id: meditationId,
      });
    }
  }
  // const onStartClick = () => {
  //   tabNavigation.navigate('Library');
  // }

  const onVoidPress = () => {
    stackNavigation.navigate('Debug');
  }

  // const renderStartMeditation = () => (
  //   <Card
  //     appearance='filled'
  //     style={styles.startCard}
  //   >
  //     <Text
  //       category='h6'
  //       style={styles.startCardHeader}
  //     >
  //       Welcome to your home!
  //     </Text>
  //     <Text
  //       category='s1'
  //       style={styles.startCardDescription}
  //     >
  //       Select a meditation from the library to get started
  //     </Text>
  //     <_Button onPress={onStartClick}>SELECT MEDITATION</_Button>
  //   </Card>
  // )

  return (
    <Layout style={styles.container} level='4'>
      <ScrollView style={styles.scrollContainer}>
        <SafeAreaView style={styles.container}>
          <HomeTopBar onVoidPress={onVoidPress} />
          <Inspiration />
          <HomeStreaks />
          <Layout level='4'>
            {/* <MeditationList
              header='Recently Uploaded'
              meditationIds={recentMeditationIds}
              onMeditationPress={onMeditationClick}
            /> */}
            <MeditationList
              header='Recent Meditations'
              meditationBaseIds={recentMeditationBaseIds}
              onMeditationPress={onMeditationPress}
            />
            <MeditationList
              header='Favorites'
              meditationBaseIds={favoriteMeditations}
              onMeditationPress={onMeditationPress}
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
})

export default HomeScreen;