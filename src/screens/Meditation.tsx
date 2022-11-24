import React, { Dispatch, SetStateAction, useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Icon,
  Input,
  Layout,
  Text,
  Toggle,
} from '@ui-kitten/components';

import _Button from '../components/Button';
import { MeditationScreenNavigationProp, MeditationStackScreenProps } from '../types';
import { meditationMap } from '../constants/meditation';
import { MultiLineInput } from '../components/MultiLineInput';

const brightWhite = '#fcfcfc';
const EMPTY_INPUT = '';

const BackIcon = (props: any) => (
  <Icon {...props} style={styles.closeIcon} fill={brightWhite} name='arrow-back-outline' />
);

const WarningIcon = (props: any) => (
  <Icon {...props} style={styles.actionIcon} fill='#b2b2b2' name='bell-off-outline' />
);

interface Option1Props {
  hasBreathMeditation: boolean;
  onChangeText(newVal: string): void;
  setToggledState(): void;
  toggledState: boolean;
  value: string;
}

const LayoutOption1 = (props: Option1Props) => (
  <Layout style={styles.option1Container}>
    <Layout style={styles.option1ActionsContainer}>
      { props.hasBreathMeditation
        ? <Toggle
            checked={props.toggledState}
            onChange={props.setToggledState}
            style={styles.toggle}
          >
            Add breath work to this meditation
          </Toggle>
        : null
      }
      <MultiLineInput
        onChangeText={props.onChangeText}
        placeholder='Set an intention for your meditation'
        value={props.value}
      />
    </Layout>
    <Layout style={styles.meditationInfo}>
      <WarningIcon />
      <Text
        category='s1'
        style={styles.meditationInfoText}
      >
        Don't forget to turn on "Do Not Disturb"
      </Text>
    </Layout>
  </Layout>
)

const MeditationScreen = ({ route }: MeditationStackScreenProps<'Meditation'>) => {
  const navigation = useNavigation<MeditationScreenNavigationProp>();
  const [toggledState, setToggledState] = useState(false);
  const [inputValue, setInputValue] = useState(EMPTY_INPUT);
  const { id } = route.params;

  const meditation = meditationMap[id];
  const meditationBreathId = toggledState ? meditation.meditationBreathId : '';

  const onBackPress = () => {
    navigation.pop();
  }

  const onStartPress = () => {

    navigation.navigate('MeditationPlayer', {
      id,
      meditationBreathId: meditationBreathId
    });
  }
  
  const onTogglePress = () => {
    setToggledState(!toggledState);
  }

  if (!meditation) return null;

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Layout style={styles.topBar}>
          <TouchableWithoutFeedback
            onPress={onBackPress}
          >
            <Layout style={styles.closeIconContainer}>
              <BackIcon />
            </Layout>
          </TouchableWithoutFeedback>
        </Layout>
        <Layout style={styles.mainSection}>
          <Text category='h6'>{meditation.name}</Text>
          <LayoutOption1
            hasBreathMeditation={!!meditation.meditationBreathId}
            onChangeText={setInputValue}
            setToggledState={onTogglePress}
            toggledState={toggledState}
            value={inputValue}
          />          
          {/* <Layout style={styles.meditationInfoContainer}>
            <Layout style={styles.meditationInfo}>
              <WarningIcon />
              <Text
                category='s1'
                style={styles.meditationInfoText}
              >
                Turn on "Do Not Disturb"
              </Text>
            </Layout>
          </Layout> */}
        </Layout>
        <Layout style={styles.bottomBar}>
          <_Button onPress={onStartPress} size='large'>Start</_Button>
        </Layout>
      </SafeAreaView>
    </Layout>
  )
}

const styles = StyleSheet.create({
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
    padding: 20,
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
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  layout: {
    flexDirection: 'row-reverse',
  },
  mainSection: {
    padding: 20,
    flex: 6,
    justifyContent: 'flex-end',
  },
  meditationInfoContainer: {
    marginTop: 12,
  },
  meditationInfo: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meditationInfoText: {
    color: '#b2b2b2',
    marginLeft: 10,
  },
  topBar: {
    flexDirection: 'row',
    paddingTop: 20,
    flex: 1,
  },
  topBarText: {
    flex: 9,
  },
  topBarIcon: {
    flex: 1
  },
  option1Container: {
    marginTop: 30,
  },
  option1ActionsContainer: {
    marginBottom: 60,
  },
  toggle: {
    justifyContent: 'flex-start',
    marginBottom: 30,
  },
})

export default MeditationScreen;