import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import { Card, Icon, Layout, Text } from '@ui-kitten/components/ui';

import { makeMeditationGroups, MeditationGroupMap } from '../utils/meditation';
import UnlockedMeditationIdsContext from '../contexts/meditationData';
import { meditationMap } from '../constants/meditation';
import { MeditationScreenNavigationProp, MeditationId } from '../types';

const FaceIcon = (props: any) => (
  <Icon {...props} style={styles.faceIcon} fill='#b2b2b2' name='smiling-face' />
);

const LibraryScreen = () => {
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
      const firstMeditationId = _.head(meditationIds)
      if (!firstMeditationId) { return null; }
      const firstMeditation = meditationMap[firstMeditationId];

      return (
        <Layout key={firstMeditation.groupKey} style={styles.section}>
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
    <Layout style={styles.rootContainer}>
      <SafeAreaView style={styles.contentContainer}>
        <Layout style={styles.headerContainer}>
          <Layout>
            <FaceIcon />
          </Layout>
        </Layout>
        <Layout style={styles.contentContainer}>
          {renderMeditationGroupSections()}
        </Layout>
      </SafeAreaView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  card: {
    marginRight: 10,
    width: 200,
    height: 200,
    borderRadius: 10,
    justifyContent: 'flex-end'
  },
  contentContainer: {
    flex: 9,
  },
  faceIcon: {
    height: 35,
    width: 35,
  },
  headerContainer: {
    flex: 1,
    alignItems: 'flex-end',
    paddingVertical: 10,
  },
  headerText: {
    padding: 2,
  },
  horizontalContainer: {
    paddingVertical: 20,
  },
  section: {
    marginVertical: 12,
  },
  rootContainer: {
    flex: 1,
    padding: 20,
  },
})

export default LibraryScreen;