import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TrackPlayer from 'react-native-track-player';
import _ from 'lodash';
import KeepAwake from 'react-native-keep-awake';
import { Icon, Layout, Text } from '@ui-kitten/components';

import _Button from '../components/Button';
import { MeditationPlayerScreenNavigationProp, MeditationPlayerStackScreenProps } from '../types';
import MeditationBaseDataContext from '../contexts/meditationBaseData';
import RecentMeditationIdsContext from '../contexts/recentMeditationData';
import { setRecentMeditationIdsInAsyncStorage } from '../utils/meditation';
import { Player } from '../components/Player';
import MeditationInstanceDataContext from '../contexts/meditationInstanceData';

const brightWhite = '#fcfcfc';
const lightestWhite = '#dcdcdc';
const countDownInSeconds = 5;
const EMPTY_STRING = '';

const CloseIcon = (props: any) => (
  <Icon {...props} style={styles.closeIcon} fill={brightWhite} name='close-outline' />
);

const MeditationPlayer = () => {
  const { recentMeditationIds, setRecentMeditationIds } = useContext(RecentMeditationIdsContext);
  const { meditationBaseData } = useContext(MeditationBaseDataContext);
  const { meditationInstanceData, setMeditationInstanceData } = useContext(MeditationInstanceDataContext);
  const navigation = useNavigation<MeditationPlayerScreenNavigationProp>();
  const [ isPlaying, setIsPlaying ] = useState(false);
  const [time, setTime] = React.useState(countDownInSeconds);
  const [currentTrackName, setCurrentTrackName] = React.useState<string>();
  const timerRef = React.useRef(time);
  const [trackState, setTrackState] = useState() as any;

  const meditationBaseId = meditationInstanceData.meditationBaseId;
  const meditationBreathId = meditationInstanceData.meditationBaseBreathId;
  const meditation = meditationBaseData[meditationBaseId]
  const tracks = [meditation]

  
  if (meditationBreathId && meditationBreathId?.length > 0) {
    tracks.unshift(meditationBaseData[meditationBreathId])
  };

  console.log('MEDITATION PLAYER: Tracks', tracks);

  if (!meditation) return null;

  const tester2 = async () => {
    const state = await TrackPlayer.getState();
    setTrackState(state);
    console.log('player state', state);
  }

  const updateKeepAwake = (shouldBeAwake: boolean) => {
    if (shouldBeAwake) {
      KeepAwake.activate();
    } else {
      KeepAwake.deactivate();
    }
  }

  useEffect(() => {
    const timerId = setInterval(() => {
      timerRef.current -= 1;
      if (timerRef.current < 0) {
        TrackPlayer.play();
        setIsPlaying(true);
        clearInterval(timerId);
        if (recentMeditationIds) {
          setRecentMeditationIdsInAsyncStorage(recentMeditationIds)
          setRecentMeditationIds(recentMeditationIds)
        }
        tester2();
      } else {
        setTime(timerRef.current);
      }
    }, 1000);

    const testInterval = setInterval(() => {
      tester2();
    }, 5000)

    updateKeepAwake(true);

    return () => {
      clearInterval(timerId);
      clearInterval(testInterval);
    }
  }, []);

  const onClosePress = () => {
    navigation.pop();
  }

  const onFinishPress = () => {
    updateKeepAwake(false);
    navigation.replace('MeditationFinish');
  }

  const isFinishButtonDisabled = time > 0;

  return (
    <Layout style={styles.container} level='4'>
      <SafeAreaView style={styles.container}>
        <Layout style={styles.topBar} level='4'>
          <TouchableWithoutFeedback
            onPress={onClosePress}
          >
            <Layout style={styles.closeIconContainer} level='4'>
              <CloseIcon />
            </Layout>
          </TouchableWithoutFeedback>
        </Layout>
        <Layout style={styles.main} level='4'>
          <Layout style={styles.countdownTextContainer} level='4'>
            {time > 0
              ? <Text style={styles.countdownText}>{time}</Text>
              : null
            }
          </Layout>
          <Layout style={styles.meditationName} level='4'>
            <Text category='h6' style={styles.meditationNameText}>{currentTrackName}</Text>
          </Layout>
        </Layout>
        <Layout style={styles.bottomBar} level='4'>
          <Player
            setCurrentTrackName={setCurrentTrackName}
            tracks={tracks}
            trackState={trackState}
          />
          <Layout style={styles.finishButtonContainer} level='4'>
            <_Button
              disabled={isFinishButtonDisabled}
              onPress={onFinishPress}
              size="large"
              style={styles.finishButton}
            >
              FINISH
            </_Button>
          </Layout>
        </Layout>
      </SafeAreaView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  bottomBar: {
    flex: 4,
    padding: 20
  },
  finishButton: {
    paddingVertical: 20,
  },
  finishButtonContainer: {
    marginVertical: 20,
  },
  container: {
    flex: 1,
  },
  main: {
    flex: 6,
    paddingHorizontal: 20,
  },
  countdownTextContainer: {
    flex: 6,
    justifyContent: 'flex-end',
  },
  meditationName: {
    flex: 3,
    flexDirection: 'column-reverse',
    paddingBottom: 16,
    color: 'red',
  },
  meditationNameText: {
    color: '#fcfcfc'
  },
  countdownText: {
    textAlign: 'center',
    fontSize: 80,
    color: lightestWhite,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row-reverse',
    flex: 1,
  },
  closeIcon: {
    height: 20,
    width: 20,
  },
  closeIconContainer: {
    padding: 20,
  },
})

export default MeditationPlayer;