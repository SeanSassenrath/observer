import React, { Dispatch, SetStateAction, useContext, useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
  Icon,
  Input,
  Layout,
  Text,
  Toggle,
} from '@ui-kitten/components';

import _Button from '../components/Button';
import { MeditationInstance, MeditationScreenNavigationProp, MeditationStackScreenProps } from '../types';
import { meditationBaseMap } from '../constants/meditation';
import { MultiLineInput } from '../components/MultiLineInput';
import MeditationInstanceDataContext from '../contexts/meditationInstanceData';
import { MeditationList } from '../components/MeditationList';

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
  <Layout style={styles.option1Container} level='4'>
    <Layout style={styles.option1ActionsContainer} level='4'>
      { props.hasBreathMeditation
        ? <Toggle
            checked={props.toggledState}
            onChange={props.setToggledState}
            style={styles.toggle}
            status='primary'
          >
            Add breathwork to this meditation
          </Toggle>
        : null
      }
      <MultiLineInput
        onChangeText={props.onChangeText}
        placeholder='Set an intention for your meditation'
        value={props.value}
      />
    </Layout>
  </Layout>
)

const MeditationScreen = ({ route }: MeditationStackScreenProps<'Meditation'>) => {
  const navigation = useNavigation<MeditationScreenNavigationProp>();
  const {setMeditationInstanceData} = useContext(MeditationInstanceDataContext);
  const [toggledState, setToggledState] = useState(false);
  const [inputValue, setInputValue] = useState(EMPTY_INPUT);
  const { id } = route.params;

  const meditation = meditationBaseMap[id];

  const onBackPress = () => {
    navigation.pop();
  }

  const onStartPress = () => {
    let meditationInstanceData: MeditationInstance = {
      name: meditation.name,
      meditationBaseId: meditation.meditationBaseId,
      intention: inputValue,
      type: meditation.type,
    }

    // if (meditation.meditationBaseBreathId) {
    //   meditationInstanceData = {
    //     meditationBaseBreathId: meditation.meditationBaseBreathId,
    //     ...meditationInstanceData,
    //   }
    // }

    setMeditationInstanceData({
      name: meditation.name,
      meditationBaseId: meditation.meditationBaseId,
      type: meditation.type,
      intention: inputValue,
    })

    // if (meditation.meditationBaseBreathId) {

    // }

    navigation.navigate('MeditationPlayer', {
      id,
      // meditationBreathId: meditationBreathId
      // heartId: meditationBreathId
    });
  }
  
  const onTogglePress = () => {
    setToggledState(!toggledState);
  }

  if (!meditation) return null;

  return (
    <Layout style={styles.container} level='4'>
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView>
          <Layout style={styles.topBar} level='4'>
            <TouchableWithoutFeedback onPress={onBackPress}>
              <Layout style={styles.closeIconContainer}>
                <BackIcon />
              </Layout>
            </TouchableWithoutFeedback>
          </Layout>
          <Layout style={styles.mainSection} level='4'>
            <Text category='h6'>{meditation.name}</Text>
            <LayoutOption1
              hasBreathMeditation={false}
              onChangeText={setInputValue}
              setToggledState={onTogglePress}
              toggledState={toggledState}
              value={inputValue}
            />  
          </Layout>  
          <MeditationList
            header='Add syncing the heart'
            meditationBaseIds={[]}
            onMeditationPress={() => { }}
            isMini
          />
          <MeditationList
            header='Add breath work'
            meditationBaseIds={[]}
            onMeditationPress={() => { }}
            isMini
          />   
        </KeyboardAwareScrollView>
        <Layout style={styles.bottomBar} level='4'>
          <Layout style={styles.meditationInfo} level='4'>
            <WarningIcon />
            <Text
              category='s1'
              style={styles.meditationInfoText}
            >
              Don't forget to turn on "Do Not Disturb"
            </Text>
          </Layout>
           <_Button onPress={onStartPress} size='large'>Start</_Button>
        </Layout>
      </SafeAreaView>
    </Layout>
  )
}

const styles = StyleSheet.create({
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
    justifyContent: 'flex-end'
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
    justifyContent: 'flex-end',
  },
  meditationInfo: {
    marginBottom: 24,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
  },
  meditationInfoText: {
    color: '#b2b2b2',
    marginLeft: 10,
  },
  topBar: {
    flexDirection: 'row',
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
    marginBottom: 40,
  },
  toggle: {
    justifyContent: 'flex-start',
    marginBottom: 30,
  },
})

export default MeditationScreen;