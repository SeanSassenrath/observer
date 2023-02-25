import React, { useContext, useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import _, { isEmpty } from 'lodash';
import Toast from 'react-native-toast-message';
import { Layout, Text, useStyleSheet } from '@ui-kitten/components'; 
// import * as MediaLibrary from 'expo-media-library';

import _Button from '../components/Button';
import { MeditationScreenNavigationProp, MeditationId, LibraryScreenNavigationProp, HomeScreenNavigationProp, MeditationBaseMap } from '../types';
import { HomeTopBar } from '../components/HomeTopBar';
import { MeditationList } from '../components/MeditationList';
import { Inspiration } from '../components/Inspiration';
import UserContext from '../contexts/userData';
import { pickFiles } from '../utils/filePicker';
import { getMeditationFilePathDataInAsyncStorage, MeditationFilePathData, setMeditationFilePathDataInAsyncStorage } from '../utils/asyncStorageMeditation';
import { makeMeditationBaseData } from '../utils/meditation';
import MeditationBaseDataContext from '../contexts/meditationBaseData';
// import TrackPlayer from 'react-native-track-player';
import { convertMeditationToTrack } from '../utils/track';

const HomeScreen = () => {
  const { user } = useContext(UserContext);
  const stackNavigation = useNavigation<MeditationScreenNavigationProp>();
  const tabNavigation = useNavigation<LibraryScreenNavigationProp>();
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

  // const getMeditationFiles = async () => {
  //   const mediaFiles = await MediaLibrary.getAssetsAsync({
  //     // mediaType: MediaLibrary.MediaType.audio,
  //   })

  //   console.log('HOME - Media files', mediaFiles);
  // }

  // const getPermission = async () => {
  //   const permission = await MediaLibrary.getPermissionsAsync();
  //   console.log('HERE 2 ', permission);

  //   if (!permission.granted && permission.canAskAgain) {
  //     const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();

  //     if (status === 'granted') {
  //       getMeditationFiles();
  //     }

  //     if (status === 'denied' && canAskAgain) {
  //       // fire alert here
  //       console.log('permission denied')
  //     }

  //     if (status === 'denied' && !canAskAgain) {
  //       console.log('permission really denied')
  //       // fire alert
  //     }
  //   }
  // }

  useEffect(() => {
    setExistingMeditationFilePathDataFromAsyncStorage();
    // getPermission();
    // getMeditationFiles();
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
    if (!pickedFileData) { return null; }
    const numberOfMeditations = Object.keys(pickedFileData).length;

    if (
      !pickedFileData ||
      numberOfMeditations <= 0
    ) {
      Toast.show({
        type: 'error',
        text1: 'Error adding meditations',
        text2: 'Tap to re-try',
        position: 'bottom',
        bottomOffset: 100,
        onPress: () => onAddMeditationsPress(),
        visibilityTime: 5000,
      });
    } else {
      Toast.show({
        type: 'success',
        text1: 'Meditations added',
        text2: `New meditations were added to your library`,
        position: 'bottom',
        bottomOffset: 100,
        onPress: () => onAddMeditationsPress(),
        visibilityTime: 5000,
      });
    }

    if (!isEmpty(pickedFileData)) {
      setMeditationFilePathDataInAsyncStorage(pickedFileData);
      setExistingMeditationFilePathData(pickedFileData);
      const meditationBaseData = await makeMeditationBaseData();
      if (meditationBaseData) {
        setMeditationBaseData(meditationBaseData);
        addTracksToQueue(meditationBaseData);
        tabNavigation.navigate('Library');
      }
    }
  };

  const addTracksToQueue = (meditationBaseData: MeditationBaseMap) => {
    const tracks = [];
    for (const key in meditationBaseData) {
      const meditation = meditationBaseData[key];
      const track = convertMeditationToTrack(meditation);
      tracks.push(track);
    }
    // TrackPlayer.add(tracks);
  }

  const onMeditationPress = (
    meditationId: MeditationId,
    isDisabled: boolean,
  ) => {
    if (meditationId) {
      if (isDisabled) {
        Toast.show({
          type: 'error',
          text1: 'Meditation not found',
          text2: 'Tap to re-add the meditation',
          position: 'bottom',
          bottomOffset: 100,
          onPress: () => onAddMeditationsPress(),
        });
      } else {
        stackNavigation.navigate('Meditation', {
          id: meditationId,
        });
      }
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
              existingMediationFilePathData={existingMediationFilePathData}
            />
            <MeditationList
              header='Favorites'
              meditationBaseIds={favoriteMeditations}
              onMeditationPress={onMeditationPress}
              existingMediationFilePathData={existingMediationFilePathData}
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
