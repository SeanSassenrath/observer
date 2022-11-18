import React, { useContext, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import _, { reduce } from 'lodash';
import { Avatar, Button, Card, Icon, Layout, Text } from '@ui-kitten/components'; 

import _Button from '../components/Button';
import { MeditationScreenNavigationProp, MeditationId, LibraryScreenNavigationProp } from '../types';
import { meditationMap } from '../constants/meditation';
import { removeUnlockedMeditationIdsFromAsyncStorage } from '../utils/filePicker';
import RecentMeditationIdsContext, { removeRecentMeditationIdsFromAsyncStorage } from '../contexts/recentMeditationData';
import { removeFtuxStateFromAsyncStorage } from '../utils/ftux';

const FaceIcon = (props: any) => (
  <Icon {...props} style={styles.faceIcon} fill='#b2b2b2' name='smiling-face' />
);

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

  const renderRecentMeditations = () => (
    <Layout>
      <Text category='h6' style={styles.meditationGroup}>Recent Meditations</Text>
      <ScrollView horizontal={true} style={styles.horizontalContainer}>
        {recentMeditationIds.map((meditationId, i) => (
          <Layout
            key={meditationMap[meditationId].meditationId}
            style={i === 0 ? styles.firstCardContainer : styles.cardContainer}
          >
            <Card
              appearance='filled'
              key={meditationMap[meditationId].meditationId}
              onPress={() => onMeditationClick(meditationMap[meditationId].meditationId)}
              style={styles.card}
            >
              <Text category='s2' style={styles.meditationName}>
                {`${meditationMap[meditationId].formattedDuration}m`}
              </Text>
            </Card>
            <Layout style={styles.meditationData}>
              <Text category='s1' style={styles.meditationName}>
                {meditationMap[meditationId].name}
              </Text>
            </Layout>
          </Layout>
        ))}
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

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.test}>
        <Layout style={styles.headerContainer}>
          <Layout>
            <Text category='h4' style={styles.headerText}>Good Morning, Sean</Text>
            <Text category='s1' style={styles.headerText}>Current Streak: 5 days</Text>
          </Layout>
          <Layout>
            <Avatar source={require('../assets/avatar.jpeg')} />
          </Layout>
        </Layout>
          <Layout>
            { recentMeditationIds.length
                ? renderRecentMeditations()
                : renderStartMeditation()
            }
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
  card: {
    backgroundColor: '#31384b',
    width: 200,
    height: 150,
    borderRadius: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  container: {
    flex: 1,
  },
  cardContainer: {
    marginRight: 20,
    width: 200,
  },
  firstCardContainer: {
    marginRight: 20,
    marginLeft: 20,
    width: 200,
  },
  faceIcon: {
    height: 35,
    width: 35,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 30,
  },
  headerText: {
    padding: 2,
  },
  horizontalContainer: {
    paddingVertical: 20,
  },
  manageMeditationButton: {
    width: 200,
    padding: 0,
    color: 'gray',
  },
  meditationGroup: {
    paddingHorizontal: 20,
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
  }
})

export default HomeScreen;