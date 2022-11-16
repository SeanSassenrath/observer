import React, { useContext, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import _, { reduce } from 'lodash';
import { Button, Card, Icon, Layout, Text } from '@ui-kitten/components'; 

import { MeditationScreenNavigationProp, MeditationId } from '../types';
import { meditationMap } from '../constants/meditation';
import { removeUnlockedMeditationIdsFromAsyncStorage } from '../utils/filePicker';
import RecentMeditationIdsContext, { getRecentMeditationIdsFromAsyncStorage, removeRecentMeditationIdsFromAsyncStorage } from '../contexts/recentMeditationData';

const FaceIcon = (props: any) => (
  <Icon {...props} style={styles.faceIcon} fill='#b2b2b2' name='smiling-face' />
);

const HomeScreen = () => {
  const { recentMeditationIds, setRecentMeditationIds } = useContext(RecentMeditationIdsContext);
  const navigation = useNavigation<MeditationScreenNavigationProp>();

  useEffect(() => {
    const syncAsyncStorageToContext = async () => {
      const recentMeditationIdsFromStorage = await getRecentMeditationIdsFromAsyncStorage();
      if (recentMeditationIdsFromStorage) {
        setRecentMeditationIds(recentMeditationIdsFromStorage);
      }
    }

    syncAsyncStorageToContext();
  }, []);

  const onMeditationClick = (meditationId: MeditationId) => {
    if (meditationId) {
      navigation.navigate('Meditation', {
        id: meditationId,
      });
    }
  }

  const renderRecentMeditations = () => (
    <Layout>
      <Text category='h6' style={styles.meditationGroup}>Recent Meditations</Text>
      <ScrollView horizontal={true} style={styles.horizontalContainer}>
        {recentMeditationIds.map((meditationId, i) => (
          <Card
            appearance='filled'
            key={meditationMap[meditationId].meditationId}
            onPress={() => onMeditationClick(meditationMap[meditationId].meditationId)}
            style={i === 0 ? styles.firstCard : styles.card}
          >
            <Text category='s1'>{meditationMap[meditationId].name}</Text>
          </Card>
        ))}
      </ScrollView>
    </Layout>
  );

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Layout style={styles.headerContainer}>
          <Layout>
            <Text category='h4' style={styles.headerText}>Good Morning, Sean</Text>
            <Text category='s1' style={styles.headerText}>Current Streak: 5 days</Text>
          </Layout>
          <Layout>
            <FaceIcon />
          </Layout>
        </Layout>
        <Layout style={styles.contentContainer}>
          {renderRecentMeditations()}
        </Layout>
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
      </SafeAreaView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  bannerText: {
    paddingBottom: 10,
  },
  card: {
    marginRight: 10,
    width: 200,
    height: 200,
    borderRadius: 10,
    justifyContent: 'flex-end',
    backgroundColor: '#31384b',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 8,
  },
  faceIcon: {
    height: 35,
    width: 35,
  },
  firstCard: {
    marginRight: 10,
    width: 200,
    height: 200,
    borderRadius: 10,
    justifyContent: 'flex-end',
    backgroundColor: '#31384b',
    marginLeft: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 2,
    paddingHorizontal: 20,
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
})

export default HomeScreen;