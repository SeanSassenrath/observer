import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Slider from '@react-native-community/slider';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import { Icon, Layout, Text } from '@ui-kitten/components';

import { Meditation } from '../types';

const brightWhite = '#fcfcfc';
const lightWhite = '#f3f3f3';
const lightestWhite = '#dcdcdc';

const PlayIcon = (props: any) => (
  <Icon {...props} style={styles.playerIcon} fill={lightWhite} name='play-circle' />
);

const PauseIcon = (props: any) => (
  <Icon {...props} style={styles.playerIcon} fill={lightWhite} name='pause-circle' />
);

const RestartIcon = (props: any) => (
  <Icon {...props} style={styles.restartIcon} fill={lightWhite} name='sync' />
);

interface PlayerProps {
  tracks: Meditation[];
}

export const Player = (props: PlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { position, duration } = useProgress()

  useEffect(() => {
    addTracks();
    const timeout = setTimeout(() => {
      TrackPlayer.play();
      setIsPlaying(true);
    }, 5000)

    return () => {
      removeTracks();
      clearTimeout(timeout);
    }
  }, []);

  const addTracks = async () => {
    try {
      await TrackPlayer.add(props.tracks)
    } catch (e) {
      console.log(e);
    }
  }

  const removeTracks = async () => {
    await TrackPlayer.reset();
  }

  const onPlayPress = async () => {
    TrackPlayer.play();
    await TrackPlayer.getState();
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

  const timePassed = new Date(position * 1000).toISOString().slice(14, 19);

  const timeLeft = new Date((duration - position) * 1000)
    .toISOString()
    .slice(14, 19);

  return (
    <Layout style={styles.container}>
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
        <Layout style={styles.timeContainer}>
          <Text category='s2' style={styles.timePassed}>{timePassed}</Text>
        </Layout>
        <Layout style={styles.timeContainer}>
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
  )
}

const styles = StyleSheet.create({
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
