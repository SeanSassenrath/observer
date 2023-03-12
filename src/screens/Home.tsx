import React, { useContext, useEffect, useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import _, { isEmpty } from 'lodash';
import Toast from 'react-native-toast-message';
import { Modal, Layout, useStyleSheet, Avatar } from '@ui-kitten/components';
import * as MediaLibrary from 'expo-media-library';
import auth from '@react-native-firebase/auth';


import _Button from '../components/Button';
import { MeditationScreenNavigationProp, MeditationId, LibraryScreenNavigationProp, HomeScreenNavigationProp, MeditationBaseMap } from '../types';
import { HomeTopBar } from '../components/HomeTopBar';
import { MeditationList } from '../components/MeditationList';
import { Inspiration } from '../components/Inspiration';
import UserContext, { initialUserState } from '../contexts/userData';
import { pickFiles } from '../utils/filePicker';
import { getMeditationFilePathDataInAsyncStorage, MeditationFilePathData, setMeditationFilePathDataInAsyncStorage } from '../utils/asyncStorageMeditation';
import { makeMeditationBaseData } from '../utils/meditation';
import MeditationBaseDataContext from '../contexts/meditationBaseData';

const HomeScreen = () => {
  const { user, setUser } = useContext(UserContext);
  const stackNavigation = useNavigation<MeditationScreenNavigationProp>();
  const tabNavigation = useNavigation<LibraryScreenNavigationProp>();
  const { setMeditationBaseData } = useContext(MeditationBaseDataContext);
  const [existingMediationFilePathData, setExistingMeditationFilePathData] = useState({} as MeditationFilePathData);
  const [isModalVisible, setIsModalVisible] = useState(false);
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

  const getMeditationFiles = async () => {
    const mediaFiles = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.audio,
    })

    // TODO: Scan for meditation files
    console.log('HOME - Media files', mediaFiles);
  }

  const getPermission = async () => {
    const permission = await MediaLibrary.getPermissionsAsync();

    if (!permission.granted && permission.canAskAgain) {
      const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();

      if (status === 'granted') {
        getMeditationFiles();
      }

      if (status === 'denied' && canAskAgain) {
        // fire alert here
        console.log('permission denied')
      }

      if (status === 'denied' && !canAskAgain) {
        console.log('permission really denied')
        // fire alert
      }
    }
  }

  useEffect(() => {
    setExistingMeditationFilePathDataFromAsyncStorage();

    if (Platform.OS === 'android') {
      getPermission();
      getMeditationFiles();
    }
  }, [])

  const setExistingMeditationFilePathDataFromAsyncStorage = async () => {
    const filePathData = await getMeditationFilePathDataInAsyncStorage()
    // console.log('HOME: Existing file path data from Async Storage', filePathData);
    if (filePathData) {
      const parsedFilePathData = JSON.parse(filePathData);
      setExistingMeditationFilePathData(parsedFilePathData);
    }
  }

  const onSignOut = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!')
        setIsModalVisible(false)
        setUser(initialUserState)
        stackNavigation.navigate('SignIn');
      });
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
        tabNavigation.navigate('Library');
      }
    }
  };

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
          <HomeTopBar
            onAvatarPress={() => setIsModalVisible(true)}
            onVoidPress={onVoidPress}
          />
          <Inspiration />
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
      <Modal
        visible={isModalVisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setIsModalVisible(false)}
      >
        <Layout level='3' style={styles.modalContainer}>
          <Avatar size='large' source={{ uri: user.profile.photoURL }} />
          <_Button
            onPress={onSignOut}
            style={styles.modalButton}
          >
            Sign Out
          </_Button>
          <_Button
            onPress={() => setIsModalVisible(false)}
            style={styles.modalButton}
          >
            Close
          </_Button>
        </Layout>
      </Modal>
    </Layout>
  )
}

const themedStyles = StyleSheet.create({
  modalContainer: {
    height: 300,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  modalButton: {
    marginTop: 40,
    width: 200,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
