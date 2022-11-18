import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import _ from 'lodash';
import { Icon, Layout, Text } from '@ui-kitten/components';

import _Button from '../components/Button';
import { MeditationPlayerScreenNavigationProp, MeditationPlayerStackScreenProps } from '../types';
import { meditationMap } from '../constants/meditation';
import RecentMeditationIdsContext from '../contexts/recentMeditationData';
import { setRecentMeditationIdsInAsyncStorage } from '../utils/meditation';

const brightWhite = '#fcfcfc';
const lightWhite = '#f3f3f3';
const lightestWhite = '#dcdcdc';

const CloseIcon = (props: any) => (
  <Icon {...props} style={styles.closeIcon} fill={brightWhite} name='close-outline' />
);

const PlayIcon = (props: any) => (
  <Icon {...props} style={styles.playerIcon} fill={lightWhite} name='play-circle' />
);

const PauseIcon = (props: any) => (
  <Icon {...props} style={styles.playerIcon} fill={lightWhite} name='pause-circle' />
);

const RestartIcon = (props: any) => (
  <Icon {...props} style={styles.restartIcon} fill={lightWhite} name='sync' />
);

const MeditationPlayer = ({ route }: MeditationPlayerStackScreenProps<'MeditationPlayer'>) => {
  const { recentMeditationIds, setRecentMeditationIds } = useContext(RecentMeditationIdsContext);
  const navigation = useNavigation<MeditationPlayerScreenNavigationProp>();
  const [ isPlaying, setIsPlaying ] = useState(false);
  const { position, duration } = useProgress()
  const [time, setTime] = React.useState(5);
  const timerRef = React.useRef(time);

  const { id } = route.params;
  const meditation = meditationMap[id]

  if (!meditation) return null;

  const addTracks = async () => {
    try {
      await TrackPlayer.add(meditation)
    } catch(e) {
      console.log(e);
    }
  }

  const removeTracks = async () => {
    await TrackPlayer.reset();
  }

  const updateRecentMeditationIds = () => {
    if (meditation) {
      const recentlyPlayedIds = [meditation.meditationId, ...recentMeditationIds];
      const dedupedRecentlyPlayedIds = _.uniq(recentlyPlayedIds);
      return dedupedRecentlyPlayedIds.slice(0, 8);
    }
  }

  useEffect(() => {
    addTracks();
    const recentMeditationIds = updateRecentMeditationIds();
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
      } else {
        setTime(timerRef.current);
      }
    }, 1000);

    return () => {
      removeTracks();
      clearInterval(timerId);
    }
  }, []);

  const onClosePress = () => {
    navigation.pop();
  }

  const onPlayPress = async () => {
    TrackPlayer.play();
    await TrackPlayer.getState();
    const playerPlay = await TrackPlayer.getState();
    setIsPlaying(true);
  }

  const onPausePress = async () => {
    TrackPlayer.pause();
    await TrackPlayer.getState();
    const playerPause = await TrackPlayer.getState();
    setIsPlaying(false);
  }

  const onRestartPress = async () => {
    TrackPlayer.seekTo(0);
  }

  const timePassed = new Date(position * 1000).toISOString().slice(14, 19);

  const timeLeft = new Date((duration - position) * 1000)
    .toISOString()
    .slice(14, 19);

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Layout style={styles.topBar}>
          <TouchableWithoutFeedback
            onPress={onClosePress}
          >
            <Layout style={styles.closeIconContainer}>
              <CloseIcon />
            </Layout>
          </TouchableWithoutFeedback>
        </Layout>
        <Layout style={styles.main}>
          <Layout style={styles.countdownTextContainer}>
            {time > 0
              ? <Text style={styles.countdownText}>{time}</Text>
              : null
            }
          </Layout>
          <Layout style={styles.meditationName}>
            <Text category='h6' style={styles.meditationNameText}>{meditation.name}</Text>
          </Layout>
        </Layout>
        <Layout style={styles.bottomBar}>
          <Layout style={styles.player}>
            <TouchableWithoutFeedback
              onPress={onRestartPress}
            >
              <Layout style={styles.restartContainer}>
                <RestartIcon />
              </Layout>
            </TouchableWithoutFeedback>
            <Slider
              style={styles.slider}
              value={position}
              minimumValue={0}
              maximumValue={duration}
              thumbTintColor={brightWhite}
              minimumTrackTintColor={brightWhite}
              maximumTrackTintColor={lightestWhite}
              onSlidingComplete={TrackPlayer.seekTo}
            />
            <Layout style={styles.timeTextContainer}>
              <Layout style={styles.testTime}>
                <Text category='s2' style={styles.timePassed}>{timePassed}</Text>
              </Layout>
              <Layout style={styles.testTime}>
                <Text category='s2' style={styles.timeLeft}>{`-${timeLeft}`}</Text>
              </Layout>
            </Layout>
            {isPlaying
              ? <TouchableWithoutFeedback
                onPress={onPausePress}
              >
                <PauseIcon />
              </TouchableWithoutFeedback>
              : <TouchableWithoutFeedback
                onPress={onPlayPress}
              >
                <PlayIcon />
              </TouchableWithoutFeedback>
            }
          </Layout>
          <Layout style={styles.finishButtonContainer}>
            <_Button size="large" style={styles.finishButton}>FINISH</_Button>
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
  playerIcon: {
    height: 70,
    width: 70,
  },
  restartIcon: {
    height: 30,
    width: 30,
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
  player: {
    alignItems: 'center',
  },
  restartContainer: {
    flexDirection: 'row',
    padding: 20,
  },
  timeTextContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  slider: {
    width: 350,
  },
  testTime: {
    flex: 1,
  },
  timePassed: {
    color: '#f3f3f3',
  },
  timeLeft: {
    textAlign: 'right',
    color: '#f3f3f3',
  }
})

export default MeditationPlayer;