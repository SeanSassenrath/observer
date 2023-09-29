import React, {useContext, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _, {uniq} from 'lodash';
import Toast from 'react-native-toast-message';
import {
  Modal,
  Layout,
  useStyleSheet,
  Avatar,
  Icon,
  Text,
  Button,
} from '@ui-kitten/components';
// import * as MediaLibrary from 'expo-media-library';
import auth from '@react-native-firebase/auth';

import _Button from '../components/Button';
import {MeditationId} from '../types';
import {HomeTopBar} from '../components/HomeTopBar';
import {MeditationList} from '../components/MeditationList';
import UserContext, {initialUserState} from '../contexts/userData';
import MeditationBaseDataContext from '../contexts/meditationBaseData';
import {AddMeditationsPill} from '../components/AddMeditationsPill';
import {onAddMeditations} from '../utils/addMeditations';
import {EduPromptComponent} from '../components/EduPrompt/component';
import {fbUpdateUser} from '../fb/user';
import MeditationFilePathsContext from '../contexts/meditationFilePaths';
import UnsupportedFilesContext from '../contexts/unsupportedFiles';
import {
  checkMeditationBaseIds,
  getRecentMeditationBaseIds,
} from '../utils/meditation';
import MedNotesPreview from '../components/MedNotesPreview';
import MeditationNotesModal from '../components/MeditationNotesModal';
import MeditationHistoryContext from '../contexts/meditationHistory';
import {meditationBaseMap} from '../constants/meditation-data';
import {Inspiration} from '../components/Inspiration';

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {unsupportedFiles, setUnsupportedFiles} = useContext(
    UnsupportedFilesContext,
  );
  const {meditationHistory} = useContext(MeditationHistoryContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNotesModalVisible, setIsNotesModalVisible] = useState(false);
  const navigation = useNavigation();
  const styles = useStyleSheet(themedStyles);

  const recentMeditationBaseIds = getRecentMeditationBaseIds(user);

  let favoriteMeditations = [] as MeditationId[];
  const meditationInstanceCounts =
    user && user.meditationUserData && user.meditationUserData.meditationCounts;

  if (meditationInstanceCounts) {
    const meditationInstanceCountIds = Object.keys(meditationInstanceCounts);

    const checkedMeditationBaseIds = uniq(
      checkMeditationBaseIds(meditationInstanceCountIds),
    );

    favoriteMeditations = checkedMeditationBaseIds.slice(0, 5);
  }

  const lastMeditationInstance =
    meditationHistory &&
    meditationHistory.meditationInstances &&
    meditationHistory.meditationInstances[0];
  const lastMeditation =
    lastMeditationInstance &&
    meditationBaseMap[lastMeditationInstance.meditationBaseId];

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
    const {_meditations, _unsupportedFiles} = await onAddMeditations(
      meditationFilePaths,
      setMeditationFilePaths,
      setUnsupportedFiles,
      user,
    );

    if (_unsupportedFiles.length) {
      navigation.navigate('FixMeditation');
    } else if (_meditations) {
      setMeditationBaseData(_meditations);
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

  const onStreaksPress = () => {
    //@ts-ignore
    navigation.navigate('TabNavigation', {screen: 'Insight'});
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
            onStreaksPress={onStreaksPress}
            onAddMeditationsPress={onAddMeditationsPress}
          />
          {lastMeditation && lastMeditationInstance ? (
            <Layout level="4" style={styles.lastMedNotesSectionContainer}>
              <Text category="h6" style={styles.thinkBoxLabel}>
                Last Meditation
              </Text>
              <Layout level="2" style={styles.lastMedNotesContainer}>
                <MedNotesPreview
                  meditation={lastMeditation}
                  meditationInstance={lastMeditationInstance}
                  onPress={() => setIsNotesModalVisible(true)}
                />
              </Layout>
            </Layout>
          ) : (
            <Inspiration />
          )}
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
        {meditationFilePaths ? null : (
          <AddMeditationsPill onAddMeditationsPress={onAddMeditationsPress} />
        )}
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
          <Button
            appearance="ghost"
            size="large"
            status="basic"
            onPress={() => setIsModalVisible(false)}
            style={styles.modalButton}>
            Close
          </Button>
        </Layout>
      </Modal>
      <MeditationNotesModal
        visible={isNotesModalVisible}
        onBackdropPress={() => setIsNotesModalVisible(false)}
        meditation={lastMeditation}
        meditationInstance={lastMeditationInstance}
        showStartMeditation
      />
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
  lastMedNotesSectionContainer: {
    marginBottom: 60,
  },
  lastMedNotesContainer: {
    borderRadius: 10,
    marginHorizontal: 20,
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
  thinkBoxLabel: {
    paddingHorizontal: 20,
    marginBottom: 14,
    opacity: 0.9,
  },
});

export default HomeScreen;
