import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Icon, Layout, Text, useStyleSheet} from '@ui-kitten/components';

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
  meditationBaseMap,
} from '../constants/meditation-data';
import {MultiLineInput} from '../components/MultiLineInput';
import MeditationInstanceDataContext from '../contexts/meditationInstanceData';
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
import {getIsSubscribed, getUserSawBreathOnboarding} from '../utils/user/user';
import SubscribeModal from '../components/SubscribeModal';

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

const MeditationScreen = ({
  route,
}: MeditationStackScreenProps<'Meditation'>) => {
  const {user, setUser} = useContext(UserContext);
  const navigation = useNavigation<MeditationScreenNavigationProp>();
  const {meditationInstanceData, setMeditationInstanceData} = useContext(
    MeditationInstanceDataContext,
  );
  const {meditationBaseData} = useContext(MeditationBaseDataContext);
  const {meditationHistory} = useContext(MeditationHistoryContext);
  const [inputValue, setInputValue] = useState(EMPTY_STRING);
  const [selectedBreathCardId, setSelectedBreathCardId] = useState('');
  const [meditationBreathId, setMeditationBreathId] = useState('');
  const [isNotesModalVisible, setIsNotesModalVisible] = useState(false);
  const [isSubscribeModalVisible, setIsSubscribeModalVisible] = useState(false);
  const {id} = route.params;
  const styles = useStyleSheet(themedStyles);

  const isSubscribed = getIsSubscribed(user);

  const meditation = meditationBaseMap[id];

  const lastMeditationInstance =
    meditationHistory &&
    meditationHistory.meditationInstances &&
    meditationHistory.meditationInstances[0];
  const lastMeditation =
    lastMeditationInstance &&
    meditationBaseMap[lastMeditationInstance.meditationBaseId];

  useEffect(() => {
    setInitialMeditationInstanceData();
    //@ts-ignore
  }, []);

  const onPressIn = () => {
    if (!isSubscribed) {
      setIsSubscribeModalVisible(true);
    }
  };

  const setInitialMeditationInstanceData = () => {
    const now = new Date();
    const meditationStartTime = now.getTime() / oneSecond;
    setMeditationInstanceData({
      ...meditationInstanceData,
      meditationStartTime,
    });
  };

  const onBackPress = () => {
    navigation.goBack();
  };

  const onStartPress = () => {
    setMeditationInstanceData({
      ...meditationInstanceData,
      name: meditation.name,
      meditationBaseId: meditation.meditationBaseId,
      intention: inputValue,
      type: meditation.type,
    });

    navigation.navigate('MeditationPlayer', {
      id,
      meditationBreathId,
    });
  };

  const onBreathMeditationPress = (
    meditationBaseBreathId: MeditationBaseId,
  ) => {
    const shouldUnselect = selectedBreathCardId === meditationBaseBreathId;
    const _meditationBaseBreathId = shouldUnselect
      ? EMPTY_STRING
      : meditationBaseBreathId;
    setMeditationBreathId(_meditationBaseBreathId);
    const selectedCardId = shouldUnselect
      ? EMPTY_STRING
      : meditationBaseBreathId;

    setMeditationInstanceData({
      ...meditationInstanceData,
      meditationBaseBreathId: _meditationBaseBreathId,
    });

    setSelectedBreathCardId(selectedCardId);
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
            onPressIn={onPressIn}
            isDisabled={!isSubscribed}
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
        description="Set an intention for your meditation by starting your 7 day free trial."
        isVisible={isSubscribeModalVisible}
        onClose={() => setIsSubscribeModalVisible(false)}
      />
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
  emptyBreathworkContainer: {
    paddingHorizontal: 20,
  },
  icon: {
    width: 20,
    height: 20,
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
