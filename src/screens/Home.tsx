import React, {useContext, useEffect, useState} from 'react';
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
  Button,
} from '@ui-kitten/components';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';

import _Button from '../components/Button';
import {MeditationBase, MeditationBaseMap, MeditationId} from '../types';
import {
  MeditationList,
  _MeditationListSection,
} from '../components/MeditationList';
import UserContext, {initialUserState} from '../contexts/userData';
import MeditationBaseDataContext from '../contexts/meditationBaseData';
import {AddMeditationsPill} from '../components/AddMeditationsPill';
import {onAddMeditations} from '../utils/addMeditations';
import {EduPromptComponent} from '../components/EduPrompt/component';
import {fbUpdateUser} from '../fb/user';
import MeditationFilePathsContext from '../contexts/meditationFilePaths';
import UnknownFilesContext from '../contexts/unknownFiles';
import MeditationHistoryContext from '../contexts/meditationHistory';
import {getRecentMeditationBaseIds} from '../utils/meditation';
import {Inspiration} from '../components/Inspiration';
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
import {
  MeditationGroupName,
  botecMap,
  breakingHabitMap,
  breathMap,
  dailyMeditationsMap,
  foundationalMap,
  generatingMap,
  otherMap,
  synchronizeMap,
  unlockedMap,
  walkingMap,
} from '../constants/meditation-data';
import {SearchBar} from '../components/SearchBar';
import NotificationModal from '../components/NotificationModal';

const EMPTY_SEARCH = '';

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
  const {unknownFiles, setUnknownFiles} = useContext(UnknownFilesContext);
  const {meditationHistory} = useContext(MeditationHistoryContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNotesModalVisible, setIsNotesModalVisible] = useState(false);
  const [isNotifModalVisible, setIsNotifModalVisible] = useState(true);
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

  const [searchInput, setSearchInput] = useState(EMPTY_SEARCH);

  const requestUserPermission = async () => {
    const authorizationStatus = await messaging().requestPermission();

    if (authorizationStatus) {
      console.log('Permission status:', authorizationStatus);
    }
  };

  useEffect(() => {
    requestUserPermission();
  }, []);

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
    const {_meditations, _unknownFiles} = await onAddMeditations(
      meditationFilePaths,
      setMeditationFilePaths,
      setUnknownFiles,
      user,
    );

    navigation.navigate('AddMedsMatching', {
      medsSuccess: _meditations,
      medsFail: _unknownFiles,
    });
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

  const onClearSearchPress = () => setSearchInput(EMPTY_SEARCH);

  const renderMeditationGroupSection = (
    header: string,
    meditationGroupMap: MeditationBaseMap,
  ) => {
    const meditationList = [] as MeditationBase[];
    const meditationGroupKeys = Object.keys(meditationGroupMap);
    meditationGroupKeys.forEach(key => {
      if (meditationBaseData[key]) {
        if (searchInput.length > 0) {
          if (meditationBaseData[key].name.includes(searchInput)) {
            return meditationList.push(meditationBaseData[key]);
          }
        } else {
          meditationList.push(meditationBaseData[key]);
        }
      }
    });

    if (meditationList.length <= 0) {
      return null;
    }

    const sortedMeditationList = sortBy(meditationList, 'name');

    return (
      <_MeditationListSection
        key={header}
        header={header}
        meditationList={sortedMeditationList}
        onMeditationPress={onMeditationPress}
      />
    );
  };

  return (
    <Layout level="4" style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
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
        {hasLastMeditation ? null : <Inspiration />}
        <Layout style={styles.listsContainer}>
          <Layout style={styles.searchContainer}>
            <SearchBar
              input={searchInput}
              onChangeText={setSearchInput}
              onClearPress={onClearSearchPress}
            />
          </Layout>
          {recentMeditationBaseIds.length > 0 && searchInput.length === 0 ? (
            <MeditationList
              header="Recent Meditations"
              meditationBaseIds={recentMeditationBaseIds}
              onMeditationPress={onMeditationPress}
              existingMeditationFilePathData={meditationFilePaths}
            />
          ) : null}
          {topMeditations.length > 3 && searchInput.length === 0 ? (
            <MeditationList
              header="Top Meditations"
              meditationBaseIds={topMeditations}
              onMeditationPress={onMeditationPress}
              existingMeditationFilePathData={meditationFilePaths}
            />
          ) : null}
          {renderMeditationGroupSection(
            MeditationGroupName.BlessingEnergyCenter,
            botecMap,
          )}
          {renderMeditationGroupSection(
            MeditationGroupName.BreakingHabit,
            breakingHabitMap,
          )}
          {renderMeditationGroupSection(
            MeditationGroupName.BreathTracks,
            breathMap,
          )}
          {renderMeditationGroupSection(
            MeditationGroupName.Daily,
            dailyMeditationsMap,
          )}
          {renderMeditationGroupSection(
            MeditationGroupName.Foundational,
            foundationalMap,
          )}
          {renderMeditationGroupSection(
            MeditationGroupName.Generating,
            generatingMap,
          )}
          {renderMeditationGroupSection(MeditationGroupName.Other, otherMap)}
          {renderMeditationGroupSection(
            MeditationGroupName.Synchronize,
            synchronizeMap,
          )}
          {renderMeditationGroupSection(
            MeditationGroupName.Walking,
            walkingMap,
          )}
          {renderMeditationGroupSection(
            MeditationGroupName.Unlocked,
            unlockedMap,
          )}
        </Layout>
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
      <NotificationModal
        onClose={() => setIsNotifModalVisible(false)}
        isVisible={isNotifModalVisible}
      />
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
    height: 40,
    justifyContent: 'center',
    width: 40,
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
  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 40,
    backgroundColor: 'transparent',
  },
});

export default HomeScreen;
