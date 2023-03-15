import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Layout, Text } from '@ui-kitten/components';
import firestore from '@react-native-firebase/firestore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import _ from 'lodash';

import _Button from '../components/Button';
import { MultiLineInput } from '../components/MultiLineInput';
import MeditationInstanceDataContext from '../contexts/meditationInstanceData';
import UserContext, { User } from '../contexts/userData';
import {
  getLastMeditationFromMeditationHistory,
  makeUpdatedBreathMeditationCountData,
  makeUpdatedContextMeditationData,
  makeUpdatedFbUserMeditationData,
  makeUpdatedMeditationCountData,
  makeUpdatedRecentUserMeditationData,
} from '../utils/meditation';
import { makeUpdatedStreakData } from '../utils/streaks';
import MeditationHistoryContext from '../contexts/meditationHistory';
import { fbUpdateUser } from '../fb/user';
import { fbAddMeditationHistory } from '../fb/meditationHistory';
import { StreakUpdate } from '../components/StreakUpdate';

const EMPTY_INPUT = '';

const MeditationFinishScreen = () => {
  const navigation = useNavigation();
  const { meditationInstanceData } = useContext(MeditationInstanceDataContext);
  const { meditationHistory } = useContext(MeditationHistoryContext);
  const { user, setUser } = useContext(UserContext);
  const [firstInput, setFirstInput] = useState(EMPTY_INPUT)
  const [secondInput, setSecondInput] = useState(EMPTY_INPUT)

  const lastMeditation = getLastMeditationFromMeditationHistory(meditationHistory);
  const updatedStreakData = makeUpdatedStreakData(user, lastMeditation);

  useEffect(() => {
    updateUserMeditationData();
    fbAddMeditationHistory(user.uid, meditationInstanceData);
  }, [])

  const updateUserMeditationData = async () => {
    const updatedMeditationInstanceCount = makeUpdatedMeditationCountData(user, meditationInstanceData);
    const updatedBreathMeditationCountData = makeUpdatedBreathMeditationCountData(user, meditationInstanceData);
    const updatedRecentUserMeditationData = makeUpdatedRecentUserMeditationData(user, meditationInstanceData);
    const lastMeditation = getLastMeditationFromMeditationHistory(meditationHistory);
    const updatedStreaksData = makeUpdatedStreakData(user, lastMeditation);

    const updatedFbUserMeditationData = makeUpdatedFbUserMeditationData(
      updatedMeditationInstanceCount,
      updatedBreathMeditationCountData,
      updatedRecentUserMeditationData,
      updatedStreaksData,
      meditationInstanceData,
    );

    await fbUpdateUser(
      user.uid,
      updatedFbUserMeditationData,
    );

    const updatedContextMeditationData = makeUpdatedContextMeditationData(
      updatedMeditationInstanceCount,
      updatedBreathMeditationCountData,
      updatedRecentUserMeditationData,
      updatedStreaksData,
      meditationInstanceData,
      user,
    );

    setUser(updatedContextMeditationData);
  }

  const onDonePress = () => {
    const updatedMeditationInstanceData = {
      ...meditationInstanceData,
      notes: firstInput,
      feedback: secondInput,
      creationTime: firestore.FieldValue.serverTimestamp(),
    }

    fbAddMeditationHistory(user.uid, updatedMeditationInstanceData);
    //@ts-ignore
    navigation.navigate('TabNavigation', { screen: 'Insight' });
  }

  return (
    <KeyboardAwareScrollView style={styles.scrollContainer}>
      <Layout style={styles.rootContainer} level='4'>
        <Text category='h5' style={styles.text}>Welcome back</Text>
        {updatedStreakData.streakUpdated
          ? <StreakUpdate
              current={updatedStreakData.current}
              longest={updatedStreakData.longest}
              newLongestStreak={updatedStreakData.newLongestStreak}
            />
          : null
        }
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
    marginBottom: 40,
  },
  input: {
    marginBottom: 60,
  }
})

export default MeditationFinishScreen;
