import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Layout, Text} from '@ui-kitten/components';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import _ from 'lodash';

import _Button from '../components/Button';
import {MultiLineInput} from '../components/MultiLineInput';
import MeditationInstanceDataContext from '../contexts/meditationInstanceData';
import MeditationSessionContext from '../contexts/meditationSession';
import UserContext from '../contexts/userData';
import PlaylistContext from '../contexts/playlist';
import {
  getLastMeditationFromMeditationHistory,
  makeTotalMeditationTime,
  makeUpdatedBreathMeditationCountData,
  makeUpdatedContextMeditationData,
  makeUpdatedFbUserMeditationData,
  makeUpdatedMeditationCountData,
  makeUpdatedRecentUserMeditationData,
} from '../utils/meditation';
import {
  getUserStreakData,
  makeUpdatedStreakData,
  UpdatedStreakData,
} from '../utils/streaks';
import MeditationHistoryContext from '../contexts/meditationHistory';
import {fbUpdateUser} from '../fb/user';
import {
  fbAddMeditationHistory,
  fbUpdateMeditationHistory,
} from '../fb/meditationHistory';
import {StreakUpdate} from '../components/StreakUpdate';
import {Action, Noun, thinkboxSendEvent} from '../analytics';
import {MeditationInstance} from '../types';

const EMPTY_INPUT = '';

const MeditationFinishScreen = () => {
  const navigation = useNavigation();
  const {meditationSession} = useContext(MeditationSessionContext);
  const {meditationHistory, setMeditationHistory} = useContext(
    MeditationHistoryContext,
  );
  const {user, setUser} = useContext(UserContext);
  const {playlists} = useContext(PlaylistContext);
  const [firstInput, setFirstInput] = useState(EMPTY_INPUT);
  const [secondInput, setSecondInput] = useState(EMPTY_INPUT);
  const [meditationInstanceDoc, setMeditationInstanceDoc] = useState(
    {} as FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
  );
  const [meditationInstanceDocs, setMeditationInstanceDocs] = useState(
    [] as FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>[],
  );
  const [updatedStreaksData, setUpdatedStreaksData] = useState(
    {} as UpdatedStreakData,
  );

  useEffect(() => {
    updateUserMeditationData().catch(e =>
      console.error('Failed to update user meditation data:', e),
    );
    addFbMeditationInstance().catch(e =>
      console.error('Failed to save meditation history:', e),
    );
  }, []);

  const updateUserMeditationData = async () => {
    // Update stats for each meditation in the session
    for (const instance of meditationSession.instances) {
      const tempInstance: MeditationInstance = {
        meditationBaseId: instance.meditationBaseId,
        name: instance.name,
        timeMeditated: instance.timeMeditated,
        type: instance.type,
      };

      const updatedCount = makeUpdatedMeditationCountData(user, tempInstance);
      const totalTime = meditationSession.timeMeditated || 0;

      await fbUpdateUser(user.uid, {
        [`meditationUserData.meditationCounts.${instance.meditationBaseId}.count`]: updatedCount,
        [`meditationUserData.meditationCounts.${instance.meditationBaseId}.name`]: instance.name,
        [`meditationUserData.meditationCounts.${instance.meditationBaseId}.id`]: instance.meditationBaseId,
        'meditationUserData.totalMeditationTime': totalTime,
      });

      // Update local context
      if (user.meditationUserData.meditationCounts) {
        user.meditationUserData.meditationCounts[instance.meditationBaseId] = {
          count: updatedCount,
          name: instance.name,
          id: instance.meditationBaseId,
        };
      }
      if (totalTime) {
        user.meditationUserData.totalMeditationTime = totalTime;
      }
    }

    // Update streaks once for the session
    const lastMed = getLastMeditationFromMeditationHistory(meditationHistory);
    const streakData = makeUpdatedStreakData(user, lastMed);
    setUpdatedStreaksData(streakData);

    if (streakData.current || streakData.longest) {
      const streakUpdate: any = {};
      if (streakData.current) streakUpdate['meditationUserData.streaks.current'] = streakData.current;
      if (streakData.longest) streakUpdate['meditationUserData.streaks.longest'] = streakData.longest;

      await fbUpdateUser(user.uid, streakUpdate);
      user.meditationUserData.streaks = {
        current: streakData.current || user.meditationUserData.streaks.current,
        longest: streakData.longest || user.meditationUserData.streaks.longest,
      };
    }

    // Update recent meditations - add all meditations from this session
    const currentRecentMeditationBaseIds =
      user?.meditationUserData?.recentMeditationBaseIds?.slice(0, 5) || [];

    // Collect all meditation IDs from the session
    const sessionMeditationIds = meditationSession.instances.map(
      instance => instance.meditationBaseId
    );

    // Prepend session meditations to recent list, keep unique, limit to 6
    const updatedRecentMeditationBaseIds = _.uniq([
      ...sessionMeditationIds,
      ...currentRecentMeditationBaseIds,
    ]).slice(0, 6);

    await fbUpdateUser(user.uid, {
      'meditationUserData.recentMeditationBaseIds': updatedRecentMeditationBaseIds,
    });

    user.meditationUserData.recentMeditationBaseIds = updatedRecentMeditationBaseIds;

    setUser({...user});
  };

  const addFbMeditationInstance = async () => {
    if (meditationSession.instances.length === 0) {
      console.warn('No meditation instances in session');
      return;
    }

    // Save all instances in the session
    const savePromises = meditationSession.instances.map(async (instance) => {
      return fbAddMeditationHistory(user.uid, {
        creationTime: firestore.FieldValue.serverTimestamp(),
        meditationBaseId: instance.meditationBaseId,
        meditationStartTime: meditationSession.sessionStartTime,
        name: instance.name,
        timeMeditated: instance.timeMeditated || 0,
        type: instance.type,
        intention: meditationSession.intention,
        notes: '', // Will be updated when user adds notes
        feedback: '', // Will be updated when user adds feedback
        playlistId: meditationSession.playlistId,
        playlistName: meditationSession.playlistName,
      });
    });

    const docs = await Promise.all(savePromises);

    // Store doc references for later updates
    if (meditationSession.instances.length === 1) {
      // Single meditation: use existing single doc state
      if (docs[0]) {
        setMeditationInstanceDoc(docs[0]);
      }
    } else {
      // Multiple meditations: use array state
      setMeditationInstanceDocs(docs.filter(doc => doc !== undefined));
    }
  };

  const updateFbMeditationInstance = async () => {
    const updateData = {
      notes: firstInput,
      feedback: secondInput,
    } as MeditationInstance;

    if (meditationSession.instances.length === 1) {
      // SINGLE MEDITATION: Use existing single doc flow
      const instanceId = meditationInstanceDoc.id;
      if (instanceId) {
        await fbUpdateMeditationHistory(user.uid, instanceId, updateData);
      }
    } else {
      // MULTIPLE MEDITATIONS: Update all with same notes/feedback
      const updatePromises = meditationInstanceDocs.map(async (doc) => {
        return fbUpdateMeditationHistory(user.uid, doc.id, updateData);
      });
      await Promise.all(updatePromises);
    }
    // TODO: Add error toast here
  };

  const updateMeditationHistoryContext = () => {
    const currentHistory = meditationHistory.meditationInstances || [];

    // Create full MeditationInstance objects from session
    const completedInstances: MeditationInstance[] = meditationSession.instances.map(
      (instance) => ({
        meditationBaseId: instance.meditationBaseId,
        meditationStartTime: meditationSession.sessionStartTime,
        name: instance.name,
        timeMeditated: instance.timeMeditated,
        type: instance.type,
        intention: meditationSession.intention,
        notes: firstInput,
        feedback: secondInput,
        playlistId: meditationSession.playlistId,
        playlistName: meditationSession.playlistName,
      })
    );

    setMeditationHistory({
      meditationInstances: completedInstances.concat(currentHistory)
    });
  };

  const onDonePress = () => {
    updateFbMeditationInstance();
    updateMeditationHistoryContext();
    //@ts-ignore
    navigation.navigate('TabNavigation', {screen: 'Insights'});
  };

  const streaks = getUserStreakData(user);
  const isPlaylist = !!meditationSession.playlistId;
  const playlist = isPlaylist
    ? playlists[meditationSession.playlistId!]
    : null;

  return (
    <Layout level="4" style={styles.rootContainer}>
      <KeyboardAwareScrollView style={styles.scrollContainer}>
        <Text category="h5" style={styles.text}>
          'Thinkbox'
        </Text>
        {isPlaylist && playlist && (
          <Text category="s1" style={styles.playlistStats}>
            {playlist.meditationIds.length} meditations completed •{' '}
            {Math.round(meditationSession.timeMeditated! / 60)} minutes
          </Text>
        )}
        {updatedStreaksData.streakUpdated ? (
          <StreakUpdate current={streaks.current} longest={streaks.longest} />
        ) : null}
        <View style={styles.inputContainer}>
          <Text category="s1" style={styles.smallText}>
            What did you do well in your last meditation?
          </Text>
          <MultiLineInput
            onChangeText={setFirstInput}
            placeholder="Add what you did well here"
            value={firstInput}
            style={styles.inputStyles}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text category="s1" style={styles.smallText}>
            If you had another opportunity, what would you do differently?
          </Text>
          <MultiLineInput
            onChangeText={setSecondInput}
            placeholder="Add what you would do differently here"
            value={secondInput}
            style={styles.inputStyles}
          />
        </View>
        <_Button onPress={onDonePress} style={styles.doneButton}>
          DONE
        </_Button>
      </KeyboardAwareScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  bottomBarContainer: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  rootContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 60,
    flex: 1,
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
  },
  smallText: {
    lineHeight: 26,
    marginBottom: 20,
  },
  text: {
    marginVertical: 20,
  },
  playlistStats: {
    color: '#9CA3AF',
    marginBottom: 20,
  },
  inputContainer: {
    marginTop: 60,
  },
  description: {
    marginBottom: 20,
  },
  inputStyles: {
    backgroundColor: 'rgba(48,55,75,0.6)',
  },
});

export default MeditationFinishScreen;
