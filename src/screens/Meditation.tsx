import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Icon, Layout, Modal, Text, useStyleSheet} from '@ui-kitten/components';

import _Button from '../components/Button';
import {
  MeditationBase,
  MeditationBaseId,
  MeditationScreenNavigationProp,
  MeditationStackScreenProps,
} from '../types';
import {
  MeditationGroupName,
  breathMap,
} from '../constants/meditation-data';
import {getFullMeditationCatalogSync} from '../services/meditationCatalog';
import {MultiLineInput} from '../components/MultiLineInput';
import MeditationInstanceDataContext from '../contexts/meditationInstanceData';
import MeditationSessionContext from '../contexts/meditationSession';
import {_MeditationListSection} from '../components/MeditationList';
import MeditationBaseDataContext from '../contexts/meditationBaseData';
import {sortBy} from 'lodash';
import MeditationHistoryContext from '../contexts/meditationHistory';
import LinearGradient from 'react-native-linear-gradient';
import MeditationNotesDrawer from '../components/MeditationNotesDrawer';
import {brightWhite} from '../constants/colors';
import {EduPromptComponent} from '../components/EduPrompt/component';
import UserContext from '../contexts/userData';
import {fbUpdateUser} from '../fb/user';
import {isBreathwork} from '../utils/meditations/meditations';
import {getUserSawBreathOnboarding} from '../utils/user/user';
import SubscribeModal from '../components/SubscribeModal';
import Toast from 'react-native-toast-message';
import {setMeditationFilePathDataInAsyncStorage} from '../utils/asyncStorageMeditation';
import MeditationFilePathsContext from '../contexts/meditationFilePaths';
import PlaylistContext from '../contexts/playlist';
import {usePostHog} from 'posthog-react-native';
import {capturePlayFlowEvent} from '../analytics/posthog';

const EMPTY_STRING = '';
const oneSecond = 1000;

const BackIcon = (props: any) => (
  <Icon
    {...props}
    style={themedStyles.backIcon}
    fill={brightWhite}
    name="arrow-back-outline"
  />
);

const TrashIcon = (props: any) => (
  <Icon
    {...props}
    style={themedStyles.trashIcon}
    fill={brightWhite}
    name="trash-outline"
  />
);

const MeditationScreen = ({
  route,
}: MeditationStackScreenProps<'Meditation'>) => {
  const posthog = usePostHog();
  const {user, setUser} = useContext(UserContext);
  const navigation = useNavigation<MeditationScreenNavigationProp>();
  const {meditationInstanceData, setMeditationInstanceData} = useContext(
    MeditationInstanceDataContext,
  );
  const {meditationSession, setMeditationSession} = useContext(MeditationSessionContext);
  const {setMeditationBaseData, meditationBaseData} = useContext(MeditationBaseDataContext);
  const {meditationHistory} = useContext(MeditationHistoryContext);
  const {setMeditationFilePaths, meditationFilePaths} = useContext(MeditationFilePathsContext);
  const {playlists} = useContext(PlaylistContext);
  const [inputValue, setInputValue] = useState(EMPTY_STRING);
  const [selectedBreathCardId, setSelectedBreathCardId] = useState('');
  const [meditationBreathId, setMeditationBreathId] = useState('');
  const [isNotesModalVisible, setIsNotesModalVisible] = useState(false);
  const [isSubscribeModalVisible, setIsSubscribeModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const {id, playlistId} = route.params;
  const styles = useStyleSheet(themedStyles);

  const meditationBaseMap = getFullMeditationCatalogSync();
  const meditation = meditationBaseMap[id];

  const affectedPlaylists = Object.values(playlists).filter(p =>
    p.meditationIds.includes(id),
  );


  const lastMeditationInstance =
    meditationHistory &&
    meditationHistory.meditationInstances &&
    meditationHistory.meditationInstances[0];
  const lastMeditation =
    lastMeditationInstance &&
    meditationBaseMap[lastMeditationInstance.meditationBaseId];

  useEffect(() => {
    setInitialMeditationSession();
    capturePlayFlowEvent(posthog, 'play_meditation_intention_viewed', {
      meditation_id: id,
      meditation_name: meditation.name,
      source: playlistId ? 'playlist' : 'library',
    });
    //@ts-ignore
  }, []);

  const setInitialMeditationSession = () => {
    const now = new Date();
    const sessionStartTime = now.getTime() / oneSecond;

    const initialInstance = {
      meditationBaseId: meditation.meditationBaseId,
      name: meditation.name,
      type: meditation.type,
    }

    setMeditationSession({
      instances: [initialInstance],
      sessionStartTime,
    })
  }

  const onBackPress = () => {
    navigation.goBack();
  };

  const onStartPress = () => {
    // Initialize MeditationSession for single meditation
    setMeditationSession({
      ...meditationSession,
      intention: inputValue,
    });

    navigation.navigate('MeditationPlayer', {
      id,
      meditationBreathId,
    });
  };

  const onBreathMeditationPress = (
    meditationBaseBreathId: MeditationBaseId,
  ) => {
    const isSelected = selectedBreathCardId === meditationBaseBreathId;

    const shouldUnselect = selectedBreathCardId === meditationBaseBreathId;

    if (isSelected) {
      setMeditationBreathId(EMPTY_STRING);
      setSelectedBreathCardId(EMPTY_STRING);

      const initialInstance = {
        meditationBaseId: meditation.meditationBaseId,
        name: meditation.name,
        type: meditation.type,
      }

      setMeditationSession({
        ...meditationSession,
        instances: [initialInstance],
      })
    } else {
      setMeditationBreathId(meditationBaseBreathId);
      setSelectedBreathCardId(meditationBaseBreathId);

      const breathwork = meditationBaseMap[meditationBaseBreathId]

      setMeditationSession({
        ...meditationSession,
        instances: [{
          meditationBaseId: meditationBaseBreathId,
          name: breathwork.name,
          type: breathwork.type,
        }, ...meditationSession.instances],
      })
    }
  };

  const onEduClosePress = async () => {
    await fbUpdateUser(user.uid, {
      'onboarding.hasSeenBreathworkOnboarding': true,
    });
    setUser({
      ...user,
      onboarding: {
        ...user.onboarding,
        hasSeenBreathworkOnboarding: true,
      },
    });
  };

  const onDeletePress = async () => {
    let updatedMedBaseDataContext = {};
    for (const key in meditationBaseData) {
      if (key !== id) {
        updatedMedBaseDataContext = {
          ...updatedMedBaseDataContext,
          [key]: meditationBaseData[key]
        }
      }
    }

    let updatedFilePathContext = {}
    for (const key in meditationFilePaths) {
      if (key !== id) {
        updatedFilePathContext = {
          ...updatedFilePathContext,
          [key]: meditationFilePaths[key]
        }
      }
    }

    setMeditationBaseData(updatedMedBaseDataContext);
    setMeditationFilePaths(updatedFilePathContext);
    await setMeditationFilePathDataInAsyncStorage(updatedFilePathContext)

    Toast.show({
      type: 'success',
      text1: 'Meditation Deleted',
      position: 'bottom',
      bottomOffset: 100,
    });

    navigation.goBack();
  }

  const hasUserSeenBreathOnboarding = getUserSawBreathOnboarding(user);
  const showBreathworkEdu =
    !isBreathwork(meditation.meditationBaseId) && !hasUserSeenBreathOnboarding;

  if (!meditation) {
    return null;
  }

  const renderBreathGroupSection = () => {
    if (isBreathwork(meditation.meditationBaseId)) {
      return null;
    }

    const breathList = [] as MeditationBase[];
    const meditationGroupKeys = Object.keys(breathMap);
    meditationGroupKeys.forEach(key => {
      if (meditationBaseData[key]) {
        breathList.push(meditationBaseData[key]);
      }
    });

    if (breathList.length <= 0) {
      return (
        <View style={styles.emptyBreathworkContainer}>
          <Text category="h6">Add breathwork</Text>
          <Text category="s1" style={styles.breathworkDescription}>
            Add breathwork to the app to include it before your meditation.
          </Text>
        </View>
      );
    }

    const sortedMeditationList = sortBy(breathList, 'name');

    return (
      <_MeditationListSection
        key={MeditationGroupName.BreathTracks}
        header="Add breathwork"
        meditationList={sortedMeditationList}
        onMeditationPress={onBreathMeditationPress}
        selectedCardId={selectedBreathCardId}
        isMini
      />
    );
  };

  return (
    <Layout level="4" style={styles.container}>
      <KeyboardAwareScrollView>
        <View style={styles.topBar}>
          <View style={styles.topLineContainer}>
            <TouchableWithoutFeedback
              style={styles.topBarIcon}
              onPress={onBackPress}>
              <View style={styles.backIconContainer}>
                <BackIcon />
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              style={styles.topBarIcon}
              onPress={() => setIsDeleteModalVisible(true)}>
              <View style={styles.trashIconContainer}>
                <TrashIcon />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <Text category="h5" style={styles.topBarText}>
            {meditation.name}
          </Text>
        </View>
        <View style={styles.mainSection}>
          {lastMeditation && lastMeditationInstance ? (
            <TouchableWithoutFeedback
              onPress={() => setIsNotesModalVisible(true)}>
              <Text category="s1" style={styles.prevMedNotes}>
                See previous meditation notes
              </Text>
            </TouchableWithoutFeedback>
          ) : null}
          <Text category="h6" style={styles.thinkBoxLabel}>
            Set an Intention
          </Text>
          <MultiLineInput
            onChangeText={setInputValue}
            placeholder="Set an intention for your meditation"
            value={inputValue}
            style={styles.thinkBoxStyles}
            textStyle={styles.thinkBoxTextStyles}
          />
          {renderBreathGroupSection()}
        </View>
      </KeyboardAwareScrollView>
      <Layout style={styles.bottomBar}>
        <LinearGradient
          colors={['transparent', '#0B0E18', '#0B0E18']}
          style={styles.bottomBarGradient}>
          <_Button
            onPress={onStartPress}
            size="large"
            style={styles.startButton}>
            START
          </_Button>
        </LinearGradient>
      </Layout>
      {showBreathworkEdu ? (
        <EduPromptComponent
          description="Did you know you can include breathwork before any meditation? It will appear below the Intention section."
          onPress={onEduClosePress}
          title="Add Breathwork"
          top
        />
      ) : null}
      <MeditationNotesDrawer
        visible={isNotesModalVisible}
        onClosePress={() => setIsNotesModalVisible(false)}
        meditation={lastMeditation}
        meditationInstance={lastMeditationInstance}
      />
      <SubscribeModal
        description="Set an intention for your meditation by starting your free trial."
        isVisible={isSubscribeModalVisible}
        onClose={() => setIsSubscribeModalVisible(false)}
      />
    <Modal
      visible={isDeleteModalVisible}
      backdropStyle={styles.backdrop}>
      <Layout level="2" style={styles.modalRootContainer}>
        <Layout level="2">
          <Text category="h5" style={styles.modalTitle}>Delete Meditation</Text>
          <Text category="s1" style={styles.modalDescription}>Are you sure you want to delete this meditation?</Text>
          {affectedPlaylists.length > 0 && (
            <Text category="c1" style={styles.playlistWarning}>
              This meditation is used in: {affectedPlaylists.map(p => p.name).join(', ')}. It will be automatically removed from {affectedPlaylists.length === 1 ? 'this playlist' : 'these playlists'}.
            </Text>
          )}
          <_Button style={styles.deleteButton} onPress={onDeletePress}>Delete</_Button>
          <_Button status='basic' appearance='outline' onPress={() => setIsDeleteModalVisible(false)}>Cancel</_Button>
        </Layout>
      </Layout>
    </Modal>
    </Layout>
  );
};

const themedStyles = StyleSheet.create({
  topLineContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingRight: 20,
  },
  additionalWork: {
    paddingVertical: 40,
  },
  actionSection: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    textAlign: 'center',
    paddingTop: 20,
  },
  actionIcon: {
    height: 30,
    width: 30,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomBar: {
    flex: 1,
    backgroundColor: 'transparent',
    // padding: 20,
    justifyContent: 'flex-end',
  },
  breathworkDescription: {
    opacity: 0.7,
    paddingTop: 10,
  },
  backIcon: {
    height: 36,
    width: 36,
  },
  backIconContainer: {
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
    marginTop: 10,
  },
  container: {
    flex: 1,
  },
  deleteButton: {
    marginBottom: 20,
  },
  emptyBreathworkContainer: {
    paddingHorizontal: 20,
  },
  icon: {
    width: 20,
    height: 20,
  },
  modalDescription: {
    marginBottom: 16,
  },
  playlistWarning: {
    color: '#E28E69',
    marginBottom: 24,
  },
  modalRootContainer: {
    borderRadius: 10,
    height: 300,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    width: 350,
  },
  modalTitle: {
    marginBottom: 10,
  },
  thinkBoxStyles: {
    backgroundColor: 'rgba(48,55,75,0.6)',
    paddingHorizontal: 20,
    marginBottom: 60,
  },
  thinkBoxTextStyles: {
    minHeight: 100,
  },
  thinkBoxLabel: {
    paddingHorizontal: 20,
    marginBottom: 14,
    opacity: 0.9,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  layout: {
    flexDirection: 'row-reverse',
  },
  lastMedNotesSectionContainer: {
    marginBottom: 60,
  },
  lastMedNotesContainer: {
    backgroundColor: 'rgba(48,55,75,0.6)',
    borderRadius: 10,
    marginHorizontal: 20,
  },
  mainSection: {
    flex: 6,
    justifyContent: 'flex-end',
    paddingBottom: 240,
  },
  meditationInfo: {
    marginBottom: 24,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meditationInfoText: {
    color: 'color-danger-300',
    marginLeft: 10,
  },
  option1Container: {
    marginTop: 30,
  },
  option1ActionsContainer: {
    marginBottom: 40,
  },
  topBar: {
    justifyContent: 'space-between',
    paddingBottom: 20,
    paddingTop: 50,
    marginBottom: 10,
  },
  topBarText: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  topBarIcon: {
    flex: 1,
  },
  toggle: {
    justifyContent: 'flex-start',
    marginBottom: 30,
  },
  trashIcon: {
    height: 30,
    width: 30,
  },
  trashIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // marginLeft: 20,
    marginTop: 10,
  },
  bottomBarGradient: {
    height: 220,
    paddingBottom: 20,
    justifyContent: 'flex-end',
  },
  startButton: {
    marginBottom: 40,
    marginHorizontal: 20,
  },
  prevMedNotes: {
    color: '#BB6FDD',
    marginHorizontal: 20,
    marginBottom: 30,
    paddingVertical: 10,
  },
});

export default MeditationScreen;
