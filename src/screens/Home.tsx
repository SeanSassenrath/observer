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
import { TouchableWithoutFeedback } from '@ui-kitten/components/devsupport';

const SearchIcon = (props: any) => (
  <Icon {...props} style={styles.searchIcon} fill='#b2b2b2' name='search' />
);

const HomeScreen = () => {
  const { recentMeditationIds } = useContext(RecentMeditationIdsContext);
  const meditationNavigation = useNavigation<MeditationScreenNavigationProp>();
  const tabNavigation = useNavigation<LibraryScreenNavigationProp>();

  const onMeditationClick = (meditationId: MeditationId) => {
    if (meditationId) {
      meditationNavigation.navigate('Meditation', {
        id: meditationId,
      });
    }
  }

  const onStartClick = () => {
    tabNavigation.navigate('Library');
  }

  const renderRecentMeditations = () => (
    <Layout style={styles.section}>
      <Text category='h6' style={styles.meditationGroup}>Recent Meditations</Text>
      <ScrollView horizontal={true} style={styles.horizontalContainer}>
        {recentMeditationIds.map((meditationId, i) => {
          const meditation = meditationMap[meditationId];
          return (
            <CardV2
              formattedDuration={meditation.formattedDuration}
              name={meditation.name}
              id={meditation.meditationId}
              key={meditation.meditationId}
              isFirstCard
              level='2'
            />
          )
        })}
      </ScrollView>
    </Layout>
  );

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

  const renderEmptyCards = (categoryName: string) => (
    <Layout style={styles.section}>
      <Text category='h6' style={styles.meditationGroup}>{categoryName}</Text>
      <ScrollView horizontal={true} style={styles.horizontalContainer}>
        <EmptyCard />
        <EmptyCard />
        <EmptyCard />
        <EmptyCard />
        <EmptyCard />
      </ScrollView>
    </Layout>
  )

  const renderTopBar = () => (
    <Layout style={styles.topBarContainer}>
      <Layout level='4' style={styles.topBarVoidContainer}>
        <Text category='s2' style={styles.topBarVoidText}>2k in the void</Text>
      </Layout>
      <Layout style={styles.topBarActionItemsContainer}>
        <Layout level='2' style={styles.topBarSearchContainer}>
          <TouchableWithoutFeedback>
            <SearchIcon />
          </TouchableWithoutFeedback>
        </Layout>
        <Avatar source={require('../assets/avatar.jpeg')} />
      </Layout>
    </Layout>
  )

  const renderStreakCard = () => (
    <Layout>
      <Text category='h6' style={styles.meditationGroup}>Streaks</Text>
      <Layout level='2' style={styles.streakCardContainer}>
        <Layout level='2'>
          <Text category='s2' style={styles.streakCardHeader}>CURRENT</Text>
          <Layout level='2' style={styles.streakCardCountContainer}>
            <Text category='h5' style={styles.streakCardCount}>8</Text>
          </Layout>
          <Text category='s2' style={styles.streakCardHeader}>Days</Text>
        </Layout>
        <Layout style={styles.streakCardDivider} />
        <Layout level='2'>
          <Text category='s2' style={styles.streakCardHeader}>LONGEST</Text>
          <Layout level='2' style={styles.streakCardCountContainer}>
            <Text category='h5' style={styles.streakCardCount}>43</Text>
          </Layout>
          <Text category='s2' style={styles.streakCardHeader}>Days</Text>
        </Layout>
      </Layout>
    </Layout>
  )

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.test}>
          {renderTopBar()}
          {renderStreakCard()}
          <Layout>
            { recentMeditationIds.length
                ? renderRecentMeditations()
                : renderStartMeditation()
            }
            {renderEmptyCards('Favorites')}
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
  searchIcon: {
    height: 25,
    width: 25,
  },
  horizontalContainer: {
    paddingLeft: 20,
    paddingRight: 100,
  },
  manageMeditationButton: {
    width: 200,
    padding: 0,
    color: 'gray',
  },
  meditationGroup: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  meditationData: {
    marginVertical: 8,
  },
  meditationName: {
    lineHeight: 22,
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
  test: {
    flex: 1,
    flexDirection: 'column'
  },
  section: {
    marginBottom: 60,
  },
  streakCardContainer: {
    flexDirection: 'row',
    marginBottom: 60,
    justifyContent: 'space-around',
    marginHorizontal: 20,
    borderRadius: 10,
  },
  streakCardHeader: {
    opacity: 0.3,
    padding: 10,
    textAlign: 'center',
  },
  streakCardCountContainer: {
    textAlign: 'center',
  },
  streakCardCount: {
    textAlign: 'center',
  },
  streakCardDivider: {
    backgroundColor: '#ffffff',
    marginVertical: 20,
    width: 1,
    opacity: 0.3,
  },
  topBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginBottom: 20,
  },
  topBarActionItemsContainer: {
    flexDirection: 'row',
  },
  topBarSearchContainer: {
    alignItems: 'center',
    borderRadius: 50,
    justifyContent: 'center',
    marginHorizontal: 18,
    padding: 8,
  },
  topBarVoidContainer: {
    borderRadius: 25,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  topBarVoidText: {
    opacity: 0.7,
  }
})

export default HomeScreen;