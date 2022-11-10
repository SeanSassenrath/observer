import React, { useContext, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, Layout, Text } from '@ui-kitten/components'; 

import MeditationDataContext, { getMeditationData } from '../contexts/meditationData';
import { MeditationScreenNavigationProp, PickedFile } from '../types';

interface Meditation {
  name: string,
}

const meditations = [{
  name: 'Blessing of the energy centers'
}, {
  name: 'Tuning into new potentials'
}, {
  name: 'Breaking the habit of being yourself'
}, {
  name: 'Walking Meditation'
}]

const HomeScreen = () => {
  const { meditationFiles, setMeditationFiles } = useContext(MeditationDataContext);
  const navigation = useNavigation<MeditationScreenNavigationProp>();

  useEffect(() => {
    getMeditationData(setMeditationFiles);
  }, []);

  const onMeditationClick = (meditation: PickedFile) => {
    if (meditation && meditation.normalizedName) {
      navigation.navigate('Meditation', {
        name: meditation.normalizedName,
      });
    }
  }

  const onMeditationSyncClick = () => {
    navigation.navigate('MeditationSync');
  }

  const hasMeditationFiles = meditationFiles && meditationFiles.length;

  const renderMeditations = () => (
    meditationFiles.map(meditation => (
      <Card
        key={meditation.name}
        onPress={() => onMeditationClick(meditation)}
        style={styles.card}
      >
        <Text category='s1'>{meditation.normalizedName}</Text>
      </Card>
    ))
  )

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Layout style={styles.header}>
          <Text category='h4' style={styles.headerText}>Good Morning, Sean</Text>
          <Text category='s1' style={styles.headerText}>Current Streak: 5 days</Text>
        </Layout>
        { !hasMeditationFiles
          ? <Layout style={styles.section} level='3'>
              <Text category='h6' style={styles.bannerText}>Add Meditations</Text>
              <Text category='s1' style={styles.bannerText}>Add meditation files from your phone</Text>
              <Button onPress={onMeditationSyncClick}>
                Get Started
              </Button>
            </Layout>
          : null
        }
        <Layout style={styles.section}>
          <Text category='h6'>Meditations</Text>
          <ScrollView horizontal={true} style={styles.horizontalContainer}>
            {meditationFiles ? renderMeditations() : null}
            {/* {meditations.map(meditation =>
              <Card
                key={meditation.name}
                onPress={() => onMeditationClick(meditation)}
                style={styles.card}
              >
                <Text category='s1'>{meditation.name}</Text>
              </Card>
            )} */}
          </ScrollView>
          <Text onPress={onMeditationSyncClick} style={styles.manageMeditationButton}>Manage Meditations</Text>
        </Layout>
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