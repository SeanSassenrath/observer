import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _ from 'lodash';
import Toast from 'react-native-toast-message';
import {
  Modal,
  Layout,
  useStyleSheet,
  Avatar,
  Icon,
} from '@ui-kitten/components';
// import * as MediaLibrary from 'expo-media-library';
import auth from '@react-native-firebase/auth';

import _Button from '../components/Button';
import {MeditationId} from '../types';
import {HomeTopBar} from '../components/HomeTopBar';
import {MeditationList} from '../components/MeditationList';
import {Inspiration} from '../components/Inspiration';
import UserContext, {initialUserState} from '../contexts/userData';
import MeditationBaseDataContext from '../contexts/meditationBaseData';
import {Streaks} from '../components/Streaks';
import {getUserStreakData} from '../utils/streaks';
import {AddMeditationsPill} from '../components/AddMeditationsPill';
import {onAddMeditations} from '../utils/addMeditations';
import {EduPromptComponent} from '../components/EduPrompt/component';
import {fbUpdateUser} from '../fb/user';
import MeditationFilePathsContext from '../contexts/meditationFilePaths';
import UnsupportedFilesContext from '../contexts/unsupportedFiles';
import UnsupportedFilesModal from '../components/UnsupportedFilesModal';
import {
  checkMeditationBaseIds,
  getRecentMeditationBaseIds,
} from '../utils/meditation';

const brightWhite = '#fcfcfc';

const HomeIcon = (props: any) => <Icon {...props} name="home-outline" />;

const UserIcon = () => (
  <Icon style={themedStyles.userIcon} fill={brightWhite} name="person" />
);

const HomeScreen = () => {
  const {user, setUser} = useContext(UserContext);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {meditationBaseData, setMeditationBaseData} = useContext(
    MeditationBaseDataContext,
  );
  const {meditationFilePaths, setMeditationFilePaths} = useContext(
    MeditationFilePathsContext,
  );
  const {unsupportedFiles, setUnsupportedFiles} = useContext(
    UnsupportedFilesContext,
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();
  const styles = useStyleSheet(themedStyles);

  const streakData = getUserStreakData(user);

  const recentMeditationBaseIds = getRecentMeditationBaseIds(user);

  let favoriteMeditations = [] as MeditationId[];
  const meditationInstanceCounts =
    user && user.meditationUserData && user.meditationUserData.meditationCounts;

  if (meditationInstanceCounts) {
    const allMeditationIds = Object.keys(meditationInstanceCounts);
    const checkedMeditationBaseIds = checkMeditationBaseIds(allMeditationIds);
    favoriteMeditations = checkedMeditationBaseIds.slice(0, 5);
    console.log('favoriteMeditations', favoriteMeditations);
  }

  // const getMeditationFiles = async () => {
  //   const mediaFiles = await MediaLibrary.getAssetsAsync({
  //     mediaType: MediaLibrary.MediaType.audio,
  //   });

  //   // TODO: Scan for meditation files
  //   console.log('HOME - Media files', mediaFiles);
  // };

  // const getPermission = async () => {
  //   const permission = await MediaLibrary.getPermissionsAsync();

  //   if (!permission.granted && permission.canAskAgain) {
  //     const {status, canAskAgain} =
  //       await MediaLibrary.requestPermissionsAsync();

  //     if (status === 'granted') {
  //       getMeditationFiles();
  //     }

  //     if (status === 'denied' && canAskAgain) {
  //       // fire alert here
  //       console.log('permission denied');
  //     }

  //     if (status === 'denied' && !canAskAgain) {
  //       console.log('permission really denied');
  //       // fire alert
  //     }
  //   }
  // };

  useEffect(() => {
    // setExistingMeditationFilePathDataFromAsyncStorage();
    // if (Platform.OS === 'android') {
    //   getPermission();
    //   getMeditationFiles();
    // }
  }, []);

  // const setExistingMeditationFilePathDataFromAsyncStorage = async () => {
  //   const filePathData = await getMeditationFilePathDataInAsyncStorage()
  //   // console.log('HOME: Existing file path data from Async Storage', filePathData);
  //   if (filePathData) {
  //     const parsedFilePathData = JSON.parse(filePathData);
  //     setExistingMeditationFilePathData(parsedFilePathData);
  //   }
  // }

  const onSignOut = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
        setIsModalVisible(false);
        setUser(initialUserState);
        navigation.navigate('SignIn');
      });
  };

  const onAddMeditationsPress = async () => {
    const meditations = await onAddMeditations(
      meditationFilePaths,
      setMeditationFilePaths,
      setUnsupportedFiles,
      user,
    );
    if (meditations) {
      setMeditationBaseData(meditations);
      //@ts-ignore
      navigation.navigate('TabNavigation', {screen: 'Library'});
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
        navigation.navigate('Meditation', {
          id: meditationId,
        });
      }
    }
  };

  const onVoidPress = () => {
    navigation.navigate('Debug');
  };

  const onEduClosePress = async () => {
    await fbUpdateUser(user.uid, {'onboarding.hasSeenHomeOnboarding': true});
    setUser({
      ...user,
      onboarding: {
        ...user.onboarding,
        hasSeenHomeOnboarding: true,
      },
    });
  };

  // const hasMeditationBaseData = Object.keys(meditationBaseData).length > 0;

  return (
    <Layout style={styles.container} level="4">
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
          <HomeTopBar
            onAvatarPress={() => setIsModalVisible(true)}
            onVoidPress={onVoidPress}
          />
          <Inspiration />
          <Streaks current={streakData.current} longest={streakData.longest} />
          <Layout level="4" style={styles.listsContainer}>
            <MeditationList
              header="Recent Meditations"
              meditationBaseIds={recentMeditationBaseIds}
              onMeditationPress={onMeditationPress}
              existingMeditationFilePathData={meditationFilePaths}
            />
            <MeditationList
              header="Top Meditations"
              meditationBaseIds={favoriteMeditations}
              onMeditationPress={onMeditationPress}
              existingMeditationFilePathData={meditationFilePaths}
            />
          </Layout>
        </ScrollView>
        <AddMeditationsPill onAddMeditationsPress={onAddMeditationsPress} />
      </SafeAreaView>
      {!user.onboarding.hasSeenHomeOnboarding ? (
        <EduPromptComponent
          description="Welcome to your home! Easily access recent meditations, see your streaks, and more."
          onPress={onEduClosePress}
          renderIcon={(props: any) => <HomeIcon {...props} />}
          title="Your Home"
        />
      ) : null}
      <Modal
        visible={isModalVisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setIsModalVisible(false)}>
        <Layout level="3" style={styles.modalContainer}>
          {user.profile && user.profile.photoURL ? (
            <Avatar source={{uri: user.profile.photoURL}} />
          ) : (
            <Layout style={styles.userIconContainer}>
              <UserIcon />
            </Layout>
          )}
          <_Button onPress={onSignOut} style={styles.modalButton}>
            Sign Out
          </_Button>
          <_Button
            onPress={() => setIsModalVisible(false)}
            style={styles.modalButton}>
            Close
          </_Button>
        </Layout>
      </Modal>
      {unsupportedFiles.length > 0 ? <UnsupportedFilesModal /> : null}
    </Layout>
  );
};

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
  listsContainer: {
    paddingBottom: 60,
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
    flexDirection: 'column',
  },
  userIconContainer: {
    alignItems: 'center',
    borderRadius: 50,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  userIcon: {
    height: 25,
    width: 25,
  },
});

export default HomeScreen;
