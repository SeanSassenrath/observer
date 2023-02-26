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
import { LibraryScreenNavigationProp } from '../types';
import MeditationInstanceDataContext from '../contexts/meditationInstanceData';
import UserContext from '../contexts/userData';

const EMPTY_INPUT = '';

const MeditationFinishScreen = () => {
  const tabNavigation = useNavigation<LibraryScreenNavigationProp>();
  const { meditationInstanceData, setMeditationInstanceData } = useContext(MeditationInstanceDataContext);
  const { user, setUser } = useContext(UserContext);
  const [firstInput, setFirstInput] = useState(EMPTY_INPUT)
  const [secondInput, setSecondInput] = useState(EMPTY_INPUT)

  const updateUserMeditationData = () => {
    const recentMeditationBaseIds = user
      && user.meditationUserData
      && user.meditationUserData.recentMeditationBaseIds
      && user.meditationUserData.recentMeditationBaseIds.slice(0, 5)
      || [];

    const updatedRecentMeditationBaseIds = _.uniq([
      meditationInstanceData.meditationBaseId, ...recentMeditationBaseIds
    ])

    const meditationInstanceCount = user
      && user.meditationUserData
      && user.meditationUserData.meditationCounts
      && user.meditationUserData.meditationCounts[meditationInstanceData.meditationBaseId]
      && user.meditationUserData.meditationCounts[meditationInstanceData.meditationBaseId].count;

    const updatedMeditationInstanceCount = meditationInstanceCount ? meditationInstanceCount + 1 : 1;

    firestore()
      .collection('users')
      .doc(user.uid)
      .update({
        'meditationUserData.recentMeditationBaseIds': updatedRecentMeditationBaseIds,
        [`meditationUserData.meditationCounts.${meditationInstanceData.meditationBaseId}.count`]: updatedMeditationInstanceCount,
        [`meditationUserData.meditationCounts.${meditationInstanceData.meditationBaseId}.name`]: meditationInstanceData.name,
        [`meditationUserData.meditationCounts.${meditationInstanceData.meditationBaseId}.id`]: meditationInstanceData.meditationBaseId,
      })
      .then(() => {
        setUser({
          ...user,
          meditationUserData: {
            ...user.meditationUserData,
            recentMeditationBaseIds: updatedRecentMeditationBaseIds,
            meditationCounts: {
              ...user.meditationUserData?.meditationCounts,
              [meditationInstanceData.meditationBaseId]: {
                count: updatedMeditationInstanceCount,
                name: meditationInstanceData.name,
                id: meditationInstanceData.meditationBaseId,
              },
            }
          },
        })

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

    tabNavigation.navigate('Insight')
  }

  return (
    <KeyboardAwareScrollView style={styles.scrollContainer}>
      <Layout style={styles.rootContainer} level='4'>
        <Text category='h5' style={styles.text}>Welcome back</Text>
        <Layout level='4'>
          <Text category='s1' style={styles.smallText}>What feelings did you embody?</Text>
          <MultiLineInput
            onChangeText={setFirstInput}
            placeholder='Joy, I could feel it through my whole body...'
            value={firstInput}
            style={styles.input}
          />
        </Layout>
        <Layout level='4'>
          <Text category='s1' style={styles.smallText}>What do you want to focus on next time?</Text>
          <MultiLineInput
            onChangeText={setSecondInput}
            placeholder='Deeper connection, surrender...'
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
