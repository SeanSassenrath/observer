import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import { Button, Card, Layout, Text } from '@ui-kitten/components'; 

import UnlockedMeditationIdsContext, { getUnlockedMeditationIdsFromAsyncStorage } from '../contexts/meditationData';
import { MeditationScreenNavigationProp, MeditationId } from '../types';
import { meditationMap } from '../constants/meditation';
import { removeUnlockedMeditationIdsFromAsyncStorage } from '../utils/filePicker';
import { makeMeditationGroups, MeditationGroupMap } from '../utils/meditation';

const HomeScreen = () => {
  const { unlockedMeditationIds } = useContext(UnlockedMeditationIdsContext);
  const [meditationGroups, setMeditationGroups] = useState({} as MeditationGroupMap)
  const navigation = useNavigation<MeditationScreenNavigationProp>();

  useEffect(() => {
    const meditationGroups = makeMeditationGroups(unlockedMeditationIds);
    setMeditationGroups(meditationGroups);
  }, []);

  const onMeditationClick = (meditationId: MeditationId) => {
    if (meditationId) {
      navigation.navigate('Meditation', {
        id: meditationId,
      });
    }
  }

  const renderMeditationGroupSections = () => {
    const meditationGroupsList = Object.entries(meditationGroups)
    return meditationGroupsList.map(([key, meditationIds]) => {
      console.log('key', key)
      console.log('value', meditationIds)
      const firstMeditationId = _.head(meditationIds)
      if (!firstMeditationId) { return null; }
      const firstMeditation = meditationMap[firstMeditationId];

      return (
        <Layout key={firstMeditation.groupKey}>
          <Text category='h6'>{firstMeditation.groupName}</Text>
          <ScrollView horizontal={true} style={styles.horizontalContainer}>
            {meditationIds.map(meditationId => (
              <Card
                key={meditationMap[meditationId].meditationId}
                onPress={() => onMeditationClick(meditationMap[meditationId].meditationId)}
                style={styles.card}
              >
                <Text category='s1'>{meditationMap[meditationId].name}</Text>
              </Card>
            ))}
          </ScrollView>
        </Layout>
      )
    })
  }

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Layout style={styles.header}>
          <Text category='h4' style={styles.headerText}>Good Morning, Sean</Text>
          <Text category='s1' style={styles.headerText}>Current Streak: 5 days</Text>
        </Layout>
        <Layout style={styles.section}>
          {renderMeditationGroupSections() }
        </Layout>
        <Button
          size='small'
          appearance='ghost'
          onPress={removeUnlockedMeditationIdsFromAsyncStorage}
        >
          Remove Meditation Ids
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
    paddingVertical: 10,
    width: 200,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  headerText: {
    padding: 2,
  },
  horizontalContainer: {
    paddingVertical: 20,
  },
  section: {
   padding: 20,
  },
  manageMeditationButton: {
    width: 200,
    padding: 0,
    color: 'gray',
  },
})

export default HomeScreen;