import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Layout, Text } from '@ui-kitten/components';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
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
import { getUserStreakData, makeUpdatedStreakData, UpdatedStreakData } from '../utils/streaks';
import MeditationHistoryContext from '../contexts/meditationHistory';
import { fbUpdateUser } from '../fb/user';
import { fbAddMeditationHistory, fbUpdateMeditationHistory } from '../fb/meditationHistory';
import { StreakUpdate } from '../components/StreakUpdate';
import { Action, Noun, thinkboxSendEvent } from '../analytics';

const EMPTY_INPUT = '';

const MeditationFinishScreen = () => {
  const navigation = useNavigation();
  const { meditationInstanceData } = useContext(MeditationInstanceDataContext);
  const { meditationHistory, setMeditationHistory } = useContext(MeditationHistoryContext);
  const { user, setUser } = useContext(UserContext);
  const [firstInput, setFirstInput] = useState(EMPTY_INPUT)
  const [secondInput, setSecondInput] = useState(EMPTY_INPUT)
  const [meditationInstanceDoc, setMeditationInstanceDoc] = useState({} as FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>);
  const [updatedStreaksData, setUpdatedStreaksData] = useState({} as UpdatedStreakData);

  useEffect(() => {
    thinkboxSendEvent(
      Action.VIEW,
      Noun.ON_MOUNT,
      {
        meditationName: meditationInstanceData.name,
        meditationBaseId: meditationInstanceData.meditationBaseId,
      },
    );
    updateUserMeditationData();
    addFbMeditationInstance();
  }, [])

  const updateUserMeditationData = async () => {
    const updatedMeditationInstanceCount = makeUpdatedMeditationCountData(user, meditationInstanceData);
    const updatedBreathMeditationCountData = makeUpdatedBreathMeditationCountData(user, meditationInstanceData);
    const updatedRecentUserMeditationData = makeUpdatedRecentUserMeditationData(user, meditationInstanceData);
    const lastMeditation = getLastMeditationFromMeditationHistory(meditationHistory);
    const updatedStreaksData = makeUpdatedStreakData(user, lastMeditation);
    setUpdatedStreaksData(updatedStreaksData);

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

  const addFbMeditationInstance = async () => {
    const doc = await fbAddMeditationHistory(user.uid, {
      ...meditationInstanceData,
      creationTime: firestore.FieldValue.serverTimestamp(),
    });
    if (doc && !Object.keys(meditationInstanceDoc).length) {
      setMeditationInstanceDoc(doc);
    }
  }

  const updateFbMeditationInstance = async () => {
    const updatedMeditationInstanceData = {
      ...meditationInstanceData,
      notes: firstInput,
      feedback: secondInput,
    }
    const meditationInstanceId = meditationInstanceDoc.id;

    if (meditationInstanceId) {
      await fbUpdateMeditationHistory(
        user.uid,
        meditationInstanceId,
        updatedMeditationInstanceData
      );
    }
    // TODO: Add error toast here
  }

  const updateMeditationHistoryContext = () => {
    const currentMeditationHistory = meditationHistory.meditationInstances || [];
    const updatedMeditationHistory = [meditationInstanceData].concat(currentMeditationHistory);
    setMeditationHistory({ meditationInstances: updatedMeditationHistory })
  }

  const onDonePress = () => {
    updateFbMeditationInstance();
    updateMeditationHistoryContext();
    //@ts-ignore
    navigation.navigate('TabNavigation', { screen: 'Insight' });
  }

  const streaks = getUserStreakData(user);

  return (
    <KeyboardAwareScrollView style={styles.scrollContainer}>
      <Layout style={styles.rootContainer} level='4'>
        <Text category='h5' style={styles.text}>Thinkbox</Text>
        {updatedStreaksData.streakUpdated
          ? <StreakUpdate
              current={streaks.current}
              longest={streaks.longest}
            />
          : null
        }
        <Layout level='4' style={styles.inputContainer}>
          <Text category='s1' style={styles.smallText}>What did you do really well in your last meditation?</Text>
          <MultiLineInput
            onChangeText={setFirstInput}
            placeholder='Add what you did well here'
            value={firstInput}
          />
        </Layout>
        <Layout level='4' style={styles.inputContainer}>
          <Text category='s1' style={styles.smallText}>If you had another opportunity, what would you do differently?</Text>
          <MultiLineInput
            onChangeText={setSecondInput}
            placeholder='Add what you would do differently here'
            value={secondInput}
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
    marginTop: 60,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: 'rgba(16, 20, 38, 1)',
  },
  smallText: {
    lineHeight: 26,
    marginBottom: 20,
  },
  text: {
    marginVertical: 20,
  },
  inputContainer: {
    marginTop: 60,
  },
  description: {
    marginBottom: 20,
  }
})

export default MeditationFinishScreen;
