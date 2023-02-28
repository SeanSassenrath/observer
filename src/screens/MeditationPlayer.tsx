import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TrackPlayer, { useProgress, useTrackPlayerEvents, Event, Track } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import _, { toNumber } from 'lodash';
import KeepAwake from 'react-native-keep-awake';
import { Icon, Layout, Text } from '@ui-kitten/components';

import _Button from '../components/Button';
import MeditationBaseDataContext from '../contexts/meditationBaseData';
import { MeditationPlayerScreenNavigationProp, MeditationPlayerStackScreenProps } from '../types';
import { convertMeditationToTrack } from '../utils/track';

const brightWhite = '#fcfcfc';
const lightWhite = '#f3f3f3';
const lightestWhite = '#dcdcdc';
const countDownInSeconds = 5;

const CloseIcon = (props: any) => (
  <Icon {...props} style={iconStyles.closeIcon} fill={brightWhite} name='close-outline' />
);

const PlayIcon = (props: any) => (
  <Icon {...props} style={iconStyles.playerIcon} fill={lightWhite} name='play-circle' />
);

const PauseIcon = (props: any) => (
  <Icon {...props} style={iconStyles.playerIcon} fill={lightWhite} name='pause-circle' />
);

const RestartIcon = (props: any) => (
  <Icon {...props} style={iconStyles.restartIcon} fill={lightWhite} name='sync' />
);

const MeditationPlayer = ({ route }: MeditationPlayerStackScreenProps<'MeditationPlayer'>) => {
  const { meditationBaseData } = useContext(MeditationBaseDataContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = React.useState(countDownInSeconds);
  const navigation = useNavigation<MeditationPlayerScreenNavigationProp>();
  const timerRef = React.useRef(time);
  const { position, duration } = useProgress();
  const [trackData, setTrackData] = useState({} as Track);
  const [tracks, setTracks] = useState([] as Track[]);

  const { id, meditationBreathId } = route.params;
  const meditation = meditationBaseData[id]

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    console.log('Track data', event);
    if (event.nextTrack !== undefined) {
      const track = tracks[event.nextTrack];
      setTrackData(track);
    } else if (event.nextTrack === undefined) {
      navigation.navigate('MeditationFinish');
    }
  });

  useEffect(() => {
    addTracks();
    const countDownTimer = setCountDownTimer();
    const interval = setTrackStateInterval();
    shouldKeepAwake(true);

    return () => {
      clearInterval(countDownTimer);
      clearInterval(interval);
      resetTrackPlayer();
    }
  }, []);

  const addTracks = async () => {
    const tracks = makeTrackList();
    setTracks(tracks);
    await TrackPlayer.add(tracks)
    console.log('MEDITATION PLAYER: ', tracks);
  }

  const makeTrackList = () => {
    const tracks = [];
    tracks.push(convertMeditationToTrack(meditation));

    if (!!meditationBreathId) {
      const meditationBreath = meditationBaseData[meditationBreathId];
      tracks.unshift(convertMeditationToTrack(meditationBreath))
    };

    return tracks;
  }

  const setCountDownTimer = () => {
    const countDownTimer = setInterval(() => {
      timerRef.current -= 1;
      if (timerRef.current < 0) {
        TrackPlayer.play();
        setIsPlaying(true);
        clearInterval(countDownTimer);
      } else {
        setTime(timerRef.current);
      }
    }, 1000);

    return countDownTimer;
  }

  const setTrackStateInterval = () => setInterval(() => {
    getTrackState();
  }, 5000);

  const getTrackState = async () => {
    const state = await TrackPlayer.getState();
    console.log('player state', state);
  }

  const shouldKeepAwake = (_shouldBeAwake: boolean) => {
    if (_shouldBeAwake) {
      KeepAwake.activate();
    } else {
      KeepAwake.deactivate();
    }
  }

  const resetTrackPlayer = async () => {
    TrackPlayer.reset();
  }

  const onClosePress = () => {
    resetTrackPlayer();
    navigation.pop();
  }

  const onFinishPress = () => {
    shouldKeepAwake(false);
    resetTrackPlayer();
    navigation.replace('MeditationFinish');
  }

  const onPlayPress = async () => {
    TrackPlayer.play();
    const test = await TrackPlayer.getState();
    console.log('player state', test);
    setIsPlaying(true);
  }

  const onPausePress = async () => {
    TrackPlayer.pause();
    await TrackPlayer.getState();
    setIsPlaying(false);
  }

  const onRestartPress = async () => {
    TrackPlayer.seekTo(0);
  }

  const isFinishButtonDisabled = time > 0;
  const timePassed = new Date(position * 1000)
    .toISOString()
    .slice(14, 19);
  const timeLeft = new Date((duration - position) * 1000)
    .toISOString()
    .slice(14, 19);
  const trackTitle = trackData && trackData.title;

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
            <Text category='h6' style={styles.meditationNameText}>{trackTitle}</Text>
          </Layout>
        </Layout>
        <Layout style={styles.bottomBar} level='4'>
          <Layout style={playerStyles.container} level='4'>
            <TouchableWithoutFeedback
              onPress={onRestartPress}
            >
              <Layout style={playerStyles.restartContainer} level='4'>
                <RestartIcon />
              </Layout>
            </TouchableWithoutFeedback>
            <Slider
              style={playerStyles.slider}
              value={position}
              minimumValue={0}
              maximumValue={duration}
              thumbTintColor={brightWhite}
              minimumTrackTintColor={brightWhite}
              maximumTrackTintColor={lightestWhite}
              onSlidingComplete={TrackPlayer.seekTo}
            />
            <Layout style={playerStyles.timeTextContainer} level='4'>
              <Layout style={playerStyles.timeContainer} level='4'>
                <Text category='s2' style={playerStyles.timePassed}>{timePassed}</Text>
              </Layout>
              <Layout style={playerStyles.timeContainer} level='4'>
                <Text category='s2' style={playerStyles.timeLeft}>{`-${timeLeft}`}</Text>
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

const iconStyles = StyleSheet.create({
  closeIcon: {
    height: 20,
    width: 20,
  },
  playerIcon: {
    height: 70,
    width: 70,
  },
  restartIcon: {
    height: 30,
    width: 30,
  },
});

const playerStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  playerIcon: {
    height: 70,
    width: 70,
  },
  restartContainer: {
    flexDirection: 'row',
    padding: 20,
  },
  restartIcon: {
    height: 30,
    width: 30,
  },
  slider: {
    width: 350,
  },
  timeContainer: {
    flex: 1,
  },
  timeTextContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  timePassed: {
    color: '#f3f3f3',
  },
  timeLeft: {
    textAlign: 'right',
    color: '#f3f3f3',
  }
})

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
  closeIconContainer: {
    padding: 20,
  },
})

export default MeditationPlayer;
