import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, TouchableWithoutFeedback} from 'react-native';
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

const brightWhite = '#fcfcfc';
const EMPTY_STRING = '';
const oneSecond = 1000;

const CloseIcon = (props: any) => (
  <Icon
    {...props}
    style={themedStyles.closeIcon}
    fill={brightWhite}
    name="close-outline"
  />
);

const WarningIcon = (props: any) => (
  <Icon
    {...props}
    style={themedStyles.actionIcon}
    fill="#E28E69"
    name="bell-off-outline"
  />
);

const MeditationScreen = ({
  route,
}: MeditationStackScreenProps<'Meditation'>) => {
  const navigation = useNavigation<MeditationScreenNavigationProp>();
  const {meditationInstanceData, setMeditationInstanceData} = useContext(
    MeditationInstanceDataContext,
  );
  const {meditationBaseData} = useContext(MeditationBaseDataContext);
  const [inputValue, setInputValue] = useState(EMPTY_STRING);
  const [selectedBreathCardId, setSelectedBreathCardId] = useState('');
  const [meditationBreathId, setMeditationBreathId] = useState('');
  const {id} = route.params;
  const styles = useStyleSheet(themedStyles);

  const meditation = meditationBaseMap[id];

  console.log('TESTING >>>', meditation);

  useEffect(() => {
    setInitialMeditationInstanceData();
    //@ts-ignore
  }, []);

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

  if (!meditation) {
    return null;
  }

  const renderBreathGroupSection = () => {
    if (meditation.groupName === MeditationGroupName.BreathTracks) {
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
      return null;
    }

    const sortedMeditationList = sortBy(breathList, 'name');

    return (
      <_MeditationListSection
        key={MeditationGroupName.BreathTracks}
        header="Add breath work"
        meditationList={sortedMeditationList}
        onMeditationPress={onBreathMeditationPress}
        selectedCardId={selectedBreathCardId}
        isMini
      />
    );
  };

  return (
    <Layout style={styles.container} level="4">
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView>
          <Layout style={styles.topBar} level="4">
            <Text category="h6" style={styles.topBarText}>
              {meditation.name}
            </Text>
            <TouchableWithoutFeedback
              style={styles.topBarIcon}
              onPress={onBackPress}>
              <Layout style={styles.closeIconContainer}>
                <CloseIcon />
              </Layout>
            </TouchableWithoutFeedback>
          </Layout>
          <Layout style={styles.mainSection} level="4">
            <Text category="s1" style={styles.thinkBoxLabel}>
              Current Meditation Intention
            </Text>
            <MultiLineInput
              onChangeText={setInputValue}
              placeholder="Set an intention for your meditation"
              value={inputValue}
              style={styles.thinkBoxStyles}
              textStyle={styles.thinkBoxTextStyles}
            />
            {renderBreathGroupSection()}
          </Layout>
        </KeyboardAwareScrollView>
        <Layout style={styles.bottomBar} level="4">
          <Layout style={styles.meditationInfo} level="4">
            <WarningIcon />
            <Text category="s1" style={styles.meditationInfoText}>
              Don't forget to turn on Do Not Disturb!
            </Text>
          </Layout>
          <_Button onPress={onStartPress} size="large">
            Start
          </_Button>
        </Layout>
      </SafeAreaView>
    </Layout>
  );
};

const themedStyles = StyleSheet.create({
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
    padding: 20,
    justifyContent: 'flex-end',
  },
  closeIcon: {
    height: 32,
    width: 32,
  },
  closeIconContainer: {
    padding: 20,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
  },
  icon: {
    width: 20,
    height: 20,
  },
  thinkBoxStyles: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  thinkBoxTextStyles: {
    minHeight: 100,
  },
  thinkBoxLabel: {
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  layout: {
    flexDirection: 'row-reverse',
  },
  mainSection: {
    justifyContent: 'flex-end',
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
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 20,
    marginBottom: 40,
  },
  topBarText: {
    flex: 9,
  },
  topBarIcon: {
    flex: 1,
  },
  option1Container: {
    marginTop: 30,
  },
  option1ActionsContainer: {
    marginBottom: 40,
  },
  toggle: {
    justifyContent: 'flex-start',
    marginBottom: 30,
  },
});

export default MeditationScreen;
