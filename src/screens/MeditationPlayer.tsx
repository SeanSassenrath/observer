import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import { Icon, Layout, Text } from '@ui-kitten/components';

import MeditationDataContext from '../contexts/meditationData';
import { MeditationPlayerScreenNavigationProp, MeditationPlayerStackScreenProps } from '../types';
import { getMeditation, getTrackURL } from '../utils/meditation';

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
  const { meditations } = useContext(MeditationDataContext);
  const navigation = useNavigation<MeditationPlayerScreenNavigationProp>();
  const [ isPlaying, setIsPlaying ] = useState(false);
  const { position, duration } = useProgress()
  const [time, setTime] = React.useState(5);
  const timerRef = React.useRef(time);

  const { id } = route.params;
  const meditation = getMeditation(id, meditations);

  if (!meditation) return null;

  const trackURL = getTrackURL(meditation.id);
  const track = {
    ...trackURL,
    ...meditation,
  }

  const addTracks = async () => {
    try {
      await TrackPlayer.add(track)
    } catch(e) {
      console.log(e);
    }
  }

  const removeTracks = async () => {
    await TrackPlayer.reset();
    const queue = await TrackPlayer.getQueue();
    console.log('Track queue - reset', queue);
  }

  useEffect(() => {
    addTracks();
    const timerId = setInterval(() => {
      timerRef.current -= 1;
      if (timerRef.current < 0) {
        TrackPlayer.play();
        setIsPlaying(true);
        clearInterval(timerId);
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
    console.log('Player state - Pushed Play', playerPlay);
    setIsPlaying(true);
    console.log('is playing state - Pushed Play', isPlaying)
  }

  const onPausePress = async () => {
    TrackPlayer.pause();
    await TrackPlayer.getState();
    const playerPause = await TrackPlayer.getState();
    console.log('Player state - Pushed Pause', playerPause);
    setIsPlaying(false);
    console.log('is playing state - Pushed Pause', isPlaying)
  }

  const onRestartPress = async () => {
    TrackPlayer.seekTo(0);
    console.log('Track seek - 0');
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
          { isPlaying
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
      </SafeAreaView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  bottomBar: {
    flex: 3,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    backgroundColor: '#b2b2b2',
  },
  main: {
    flex: 6,
    backgroundColor: '#transparent',
    paddingHorizontal: 20,
  },
  countdownTextContainer: {
    flex: 7,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  meditationName: {
    flex: 3,
    backgroundColor: 'transparent',
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
    backgroundColor: 'transparent',
    flex: 1,
  },
  closeIcon: {
    height: 20,
    width: 20,
  },
  closeIconContainer: {
    padding: 20,
    backgroundColor: 'transparent',
  },
  restartContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'transparent',
  },
  timeTextContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: 'transparent',
  },
  slider: {
    width: 350,
    backgroundColor: 'transparent',
  },
  testTime: {
    flex: 1,
    backgroundColor: 'transparent',
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