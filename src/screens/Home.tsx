import React, {useContext, useState} from 'react';
import {Pressable, ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _, {values, sortBy, takeRight} from 'lodash';
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
import auth from '@react-native-firebase/auth';

import _Button from '../components/Button';
import {MeditationId} from '../types';
import {MeditationList} from '../components/MeditationList';
import UserContext, {initialUserState} from '../contexts/userData';
import MeditationBaseDataContext from '../contexts/meditationBaseData';
import {AddMeditationsPill} from '../components/AddMeditationsPill';
import {onAddMeditations} from '../utils/addMeditations';
import {EduPromptComponent} from '../components/EduPrompt/component';
import {fbUpdateUser} from '../fb/user';
import MeditationFilePathsContext from '../contexts/meditationFilePaths';
import UnsupportedFilesContext from '../contexts/unsupportedFiles';
import {getRecentMeditationBaseIds} from '../utils/meditation';
import MedNotesPreview from '../components/MedNotesPreview';
import MeditationHistoryContext from '../contexts/meditationHistory';
import {Inspiration} from '../components/Inspiration';
import LinearGradient from 'react-native-linear-gradient';
import MeditationNotesDrawer from '../components/MeditationNotesDrawer';
import {brightWhite} from '../constants/colors';
import {getUserMeditationInstanceCounts} from '../utils/user/user';
import {
  getLastMeditationInstance,
  getMeditationFromId,
  getTopFiveMeditationIds,
} from '../utils/meditations/meditations';
import StreakPill from '../components/StreakPill';
import {getUserStreakData} from '../utils/streaks';

const HomeIcon = (props: any) => <Icon {...props} name="home-outline" />;

const UserIcon = () => (
  <Icon style={themedStyles.userIcon} fill={brightWhite} name="person" />
);

const PlusIcon = () => (
  <Icon style={themedStyles.plusIcon} fill={brightWhite} name="plus-outline" />
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
  const meditationInstanceCounts = getUserMeditationInstanceCounts(user);

  const topMeditations = meditationInstanceCounts
    ? getTopFiveMeditationIds(meditationInstanceCounts)
    : [];

  const lastMeditationInstance = getLastMeditationInstance(meditationHistory);
  const lastMeditation =
    lastMeditationInstance &&
    getMeditationFromId(lastMeditationInstance.meditationBaseId);
  const hasLastMeditation = lastMeditationInstance && lastMeditation;

  const streakData = getUserStreakData(user);

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

  const onAvatarPress = () => {
    navigation.navigate('Profile', {userId: user.uid});
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

  return (
    <Layout style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <LinearGradient colors={['#020306', '#1B0444']}>
          <Layout style={styles.topBarContainer}>
            <Layout style={styles.rowContainer}>
              <Pressable onPress={onStreaksPress}>
                <StreakPill streaks={streakData} />
              </Pressable>
              <Layout style={styles.topBarActionItemsContainer}>
                <Pressable onPress={onAddMeditationsPress}>
                  <Layout style={styles.plusIconContainer}>
                    <PlusIcon />
                  </Layout>
                </Pressable>
                <Pressable onPress={onAvatarPress}>
                  {user.profile && user.profile.photoURL ? (
                    <Avatar source={{uri: user.profile.photoURL}} />
                  ) : (
                    <Layout style={styles.userIconContainer}>
                      <UserIcon />
                    </Layout>
                  )}
                </Pressable>
              </Layout>
            </Layout>
          </Layout>
          {hasLastMeditation ? (
            <Layout style={styles.lastMedNotesSectionContainer}>
              <Text category="h6" style={styles.thinkBoxLabel}>
                Last Meditation
              </Text>
              <Layout style={styles.lastMedNotesContainer}>
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
          <Layout style={styles.listsContainer}>
            <MeditationList
              header="Recent Meditations"
              meditationBaseIds={recentMeditationBaseIds}
              onMeditationPress={onMeditationPress}
              existingMeditationFilePathData={meditationFilePaths}
            />
            <MeditationList
              header="Top Meditations"
              meditationBaseIds={topMeditations}
              onMeditationPress={onMeditationPress}
              existingMeditationFilePathData={meditationFilePaths}
            />
          </Layout>
        </LinearGradient>
      </ScrollView>
      {meditationFilePaths ? null : (
        <AddMeditationsPill onAddMeditationsPress={onAddMeditationsPress} />
      )}
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
      <MeditationNotesDrawer
        visible={isNotesModalVisible}
        onClosePress={() => setIsNotesModalVisible(false)}
        meditation={lastMeditation}
        meditationInstance={lastMeditationInstance}
      />
    </Layout>
  );
};

const themedStyles = StyleSheet.create({
  topBarContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 60,
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  rowContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topBarActionItemsContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  plusIconContainer: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 20,
    width: 40,
    height: 40,
  },
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
    backgroundColor: '#020306',
    flex: 1,
  },
  lastMedNotesSectionContainer: {
    backgroundColor: 'transparent',
    marginBottom: 60,
  },
  lastMedNotesContainer: {
    backgroundColor: 'rgba(48,55,75,0.6)',
    borderRadius: 10,
    marginHorizontal: 20,
  },
  listsContainer: {
    backgroundColor: 'transparent',
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
  plusIcon: {
    height: 30,
    width: 30,
  },
  thinkBoxLabel: {
    paddingHorizontal: 20,
    marginBottom: 14,
    opacity: 0.9,
  },
});

export default HomeScreen;
