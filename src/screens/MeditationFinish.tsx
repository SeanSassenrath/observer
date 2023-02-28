import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { Layout, Text } from '@ui-kitten/components';
import firestore from '@react-native-firebase/firestore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import _ from 'lodash';

import _Button from '../components/Button';
import { MultiLineInput } from '../components/MultiLineInput';
import { LibraryScreenNavigationProp, MeditationInstance } from '../types';
import MeditationInstanceDataContext from '../contexts/meditationInstanceData';
import UserContext, { User } from '../contexts/userData';
import { getMeditationBreathCountFromUserData, getMeditationCountFromUserData } from '../utils/meditation';
import { meditationBaseMap } from '../constants/meditation';

const EMPTY_INPUT = '';

const makeUpdatedRecentUserMeditationData = (
  user: User,
  meditationInstanceData: MeditationInstance
) => {
  const recentMeditationBaseIds = user
    && user.meditationUserData
    && user.meditationUserData.recentMeditationBaseIds
    && user.meditationUserData.recentMeditationBaseIds.slice(0, 5)
    || [];

  return _.uniq([
    meditationInstanceData.meditationBaseId, ...recentMeditationBaseIds
  ])
}

const makeUpdatedBaseUserMeditationData = (
  user: User,
  meditationInstanceData: MeditationInstance
) => {
  const updatedRecentMeditationBaseIds = makeUpdatedRecentUserMeditationData(user, meditationInstanceData);
  const meditationInstanceCount = getMeditationCountFromUserData(user, meditationInstanceData);
  const updatedMeditationInstanceCount = meditationInstanceCount ? meditationInstanceCount + 1 : 1;

  return ({
    'meditationUserData.recentMeditationBaseIds': updatedRecentMeditationBaseIds,
    [`meditationUserData.meditationCounts.${meditationInstanceData.meditationBaseId}.count`]: updatedMeditationInstanceCount,
    [`meditationUserData.meditationCounts.${meditationInstanceData.meditationBaseId}.name`]: meditationInstanceData.name,
    [`meditationUserData.meditationCounts.${meditationInstanceData.meditationBaseId}.id`]: meditationInstanceData.meditationBaseId,
  })
}

const makeUpdatedBreathMeditationData = (
  user: User,
  meditationInstanceData: MeditationInstance
) => {
  const meditationBreathCount = getMeditationBreathCountFromUserData(user, meditationInstanceData);
  const updatedMeditationBreathCount = meditationBreathCount ? meditationBreathCount + 1 : 1;
  const meditationBreathId = meditationInstanceData.meditationBaseBreathId;
  const meditationBreathData = meditationBreathId && meditationBaseMap[meditationBreathId]

  if (meditationBreathData) {
    return ({
      [`meditationUserData.meditationCounts.${meditationInstanceData.meditationBaseBreathId}.count`]: updatedMeditationBreathCount,
      [`meditationUserData.meditationCounts.${meditationInstanceData.meditationBaseBreathId}.name`]: meditationBreathData.name,
      [`meditationUserData.meditationCounts.${meditationInstanceData.meditationBaseBreathId}.id`]: meditationInstanceData.meditationBaseBreathId,
    })
  }
}

const makeUpdatedUserMeditationData = (
  user: User,
  meditationInstanceData: MeditationInstance
) => {
  let updatedUserMeditationData = makeUpdatedBaseUserMeditationData(user, meditationInstanceData);

  if (meditationInstanceData.meditationBaseBreathId) {
    const updatedUserBreathMeditationData = makeUpdatedBreathMeditationData(user, meditationInstanceData);
    if (updatedUserBreathMeditationData) {
      updatedUserMeditationData = Object.assign(updatedUserMeditationData, updatedUserBreathMeditationData)
    }
  }

  return updatedUserMeditationData;
}

const makeUpdatedUserMeditationContextData = (
  user: User,
  meditationInstanceData: MeditationInstance
) => {
  const updatedRecentMeditationBaseIds = makeUpdatedRecentUserMeditationData(user, meditationInstanceData);
  const meditationInstanceCount = getMeditationCountFromUserData(user, meditationInstanceData);
  const updatedMeditationInstanceCount = meditationInstanceCount ? meditationInstanceCount + 1 : 1;

  let meditationCounts = {
    [meditationInstanceData.meditationBaseId]: {
      count: updatedMeditationInstanceCount,
      name: meditationInstanceData.name,
      id: meditationInstanceData.meditationBaseId,
    },
  }

  if (meditationInstanceData.meditationBaseBreathId) {
    const meditationBreathCount = getMeditationBreathCountFromUserData(user, meditationInstanceData);
    const updatedMeditationBreathCount = meditationBreathCount ? meditationBreathCount + 1 : 1;
    const meditationBreathData = meditationBaseMap[meditationInstanceData.meditationBaseBreathId]

    meditationCounts = {
      [meditationInstanceData.meditationBaseBreathId]: {
        count: updatedMeditationBreathCount,
        name: meditationBreathData.name,
        id: meditationInstanceData.meditationBaseBreathId,
      },
      ...meditationCounts,
    }
  }

  return (
    {
      ...user,
      meditationUserData: {
        ...user.meditationUserData,
        recentMeditationBaseIds: updatedRecentMeditationBaseIds,
        meditationCounts: {
          ...user.meditationUserData?.meditationCounts,
          ...meditationCounts,
        }
      },
    }
  )
}

const MeditationFinishScreen = () => {
  const tabNavigation = useNavigation<LibraryScreenNavigationProp>();
  const { meditationInstanceData } = useContext(MeditationInstanceDataContext);
  const { user, setUser } = useContext(UserContext);
  const [firstInput, setFirstInput] = useState(EMPTY_INPUT)
  const [secondInput, setSecondInput] = useState(EMPTY_INPUT)

  const updateUserMeditationData = () => {
    const updatedUserMeditationData = makeUpdatedUserMeditationData(user, meditationInstanceData);
    const updatedUserMeditationContextData = makeUpdatedUserMeditationContextData(user, meditationInstanceData);

    console.log('!! updatedUserMeditationData', updatedUserMeditationData)
    console.log('!! updatedUserMeditationContextData', updatedUserMeditationContextData);

    firestore()
      .collection('users')
      .doc(user.uid)
      .update(updatedUserMeditationData)
      .then(() => {
        setUser(updatedUserMeditationContextData)
        tabNavigation.navigate('Insight')
        console.log('MEDITATION FINISH: Added recent meditation base id to firebase');
      })
  }

  const onDonePress = () => {
    const meditationInstanceForFirebase = {
      ...meditationInstanceData,
      notes: firstInput,
      feedback: secondInput,
      creationTime: firestore.FieldValue.serverTimestamp(),
    }

    console.log('MEDITATION FINISH: full meditation instance', meditationInstanceForFirebase)
    firestore()
      .collection('users')
      .doc(user.uid)
      .collection('meditationHistory')
      .add(meditationInstanceForFirebase)
      .then(() => {
        console.log('MEDITATION FINISH: Added meditation instance to firebase');
      })

    updateUserMeditationData();
  }

  return (
    <KeyboardAwareScrollView style={styles.scrollContainer}>
      <Layout style={styles.rootContainer} level='4'>
        <Text category='h5' style={styles.text}>Welcome back</Text>
        <Layout level='4'>
          <Text category='s1' style={styles.smallText}>What did you do well during your meditation?</Text>
          <MultiLineInput
            onChangeText={setFirstInput}
            placeholder='Add your feedback here'
            value={firstInput}
            style={styles.input}
          />
        </Layout>
        <Layout level='4'>
          <Text category='s1' style={styles.smallText}>What do you want to improve on next time?</Text>
          <MultiLineInput
            onChangeText={setSecondInput}
            placeholder='Add your feedback here'
            value={secondInput}
            style={styles.input}
          />
        </Layout>
        <_Button
          onPress={onDonePress}
          style={styles.doneButton}
        >
          DONE
        </_Button>
      </Layout>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  bottomBarContainer: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  rootContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  buttonContainer: {
    flex: 2,
    backgroundColor: 'red',
  },
  doneButton: {
    marginTop: 20,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: 'rgba(16, 20, 38, 1)',
  },
  smallText: {
    marginBottom: 20,
  },
  text: {
    marginTop: 20,
    marginBottom: 80,
  },
  input: {
    marginBottom: 60,
  }
})

export default MeditationFinishScreen;
