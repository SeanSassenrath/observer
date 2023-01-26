import React, { useContext, useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import _, { isEmpty } from 'lodash';
import { Layout, Text, useStyleSheet } from '@ui-kitten/components'; 

import _Button from '../components/Button';
import { MeditationScreenNavigationProp, MeditationId, LibraryScreenNavigationProp } from '../types';
import { HomeTopBar } from '../components/HomeTopBar';
import { MeditationList } from '../components/MeditationList';
import { Inspiration } from '../components/Inspiration';
import UserContext from '../contexts/userData';
import { pickFiles } from '../utils/filePicker';
import { getMeditationFilePathDataInAsyncStorage, MeditationFilePathData, setMeditationFilePathDataInAsyncStorage } from '../utils/asyncStorageMeditation';
import { setMeditationBaseDataToContext } from '../utils/meditation';
import MeditationBaseDataContext from '../contexts/meditationBaseData';

const HomeScreen = () => {
  const { user } = useContext(UserContext);
  const stackNavigation = useNavigation<MeditationScreenNavigationProp>();
  const { setMeditationBaseData } = useContext(MeditationBaseDataContext);
  const [existingMediationFilePathData, setExistingMeditationFilePathData] = useState({} as MeditationFilePathData);
  const styles = useStyleSheet(themedStyles);

  const recentMeditationBaseIds = user && user.meditationUserData && user.meditationUserData.recentMeditationBaseIds || [];

  let favoriteMeditations = [] as MeditationId[];
  const meditationInstanceCounts = user
    && user.meditationUserData
    && user.meditationUserData.meditationCounts;

  if (meditationInstanceCounts) {
    const allMeditationIds = Object.keys(meditationInstanceCounts);
    favoriteMeditations = allMeditationIds.slice(0, 5);
  }

  useEffect(() => {
    setExistingMeditationFilePathDataFromAsyncStorage();
  }, [])

  const setExistingMeditationFilePathDataFromAsyncStorage = async () => {
    const filePathData = await getMeditationFilePathDataInAsyncStorage()
    console.log('HOME: Existing file path data from Async Storage', filePathData);
    if (filePathData) {
      const parsedFilePathData = JSON.parse(filePathData);
      setExistingMeditationFilePathData(parsedFilePathData);
    }
  }

  const onAddMeditationsPress = async () => {
    const pickedFileData = await pickFiles(existingMediationFilePathData);
    console.log('HOME: Picked file data', pickedFileData)
    if (!pickedFileData) { return null; }
    console.log('HOME: Picked file data', pickedFileData)

    if (!isEmpty(pickedFileData)) {
      setMeditationFilePathDataInAsyncStorage(pickedFileData);
      setExistingMeditationFilePathData(pickedFileData);
      setMeditationBaseDataToContext(setMeditationBaseData);
    }
  };

  const onMeditationPress = (meditationId: MeditationId) => {
    if (meditationId) {
      stackNavigation.navigate('Meditation', {
        id: meditationId,
      });
    }
  }

  const onVoidPress = () => {
    stackNavigation.navigate('Debug');
  }

  return (
    <Layout style={styles.container} level='4'>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
          <HomeTopBar onVoidPress={onVoidPress} />
          <Inspiration />
          <Layout level='4' style={styles.addMeditationsContainer}>
            <Pressable onPress={onAddMeditationsPress}>
              <Layout style={styles.addMeditationsButton}>
                <Text category='s1' style={styles.addMeditationsText}>Add Meditations</Text>
              </Layout>
            </Pressable>
          </Layout>
          <Layout level='4'>
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
        </ScrollView>
      </SafeAreaView>
    </Layout>
  )
}

const themedStyles = StyleSheet.create({
  addMeditationsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  addMeditationsButton: {
    backgroundColor: 'color-primary-600',
    borderColor: 'color-primary-800',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMeditationsText: {
    opacity: 0.8,
  },
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
