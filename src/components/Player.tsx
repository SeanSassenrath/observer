import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Slider from '@react-native-community/slider';
import TrackPlayer, { useProgress, useTrackPlayerEvents, Event, Track } from 'react-native-track-player';
import { Icon, Layout, Text } from '@ui-kitten/components';
import { MeditationBase } from '../types';

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
  setCurrentTrackName: Dispatch<SetStateAction<string | undefined>>;
  tracks: any;
  trackState: any;
}

export const Player = (props: PlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { position, duration } = useProgress()
  const [trackData, setTrackData] = useState({} as Track);

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

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    console.log(' ');
    console.log('TRACK PLAYER EVENT', event);
    console.log('TRACK PLAYER EVENT TYPE', event.type);
    console.log('TRACK PLAYER EVENT NEXT TRACK', event.nextTrack);
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      if (track) {
        console.log('TRACK PLAYER EVENT TRACK NAME', track.name)
        console.log(' ')
        setTrackData(track);
        props.setCurrentTrackName(track.name);
      }
    }
  });

  const addTracks = async () => {
    try {
      await TrackPlayer.add(props.tracks)
    } catch (e) {
      console.log(e);
    }
  }

  const removeTracks = async () => {
    // await TrackPlayer.reset();
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

  const timePassed = new Date(position * 1000).toISOString().slice(14, 19);

  const timeLeft = new Date((duration - position) * 1000)
    .toISOString()
    .slice(14, 19);

  return (
    <Layout style={styles.container} level='4'>
      <Layout>
        <Text category='s2'>{`Name: ${trackData.name}`}</Text>
        <Text category='s2'>{`Url: ${trackData.url}`}</Text>
        <Text category='s2'>{`State: ${props.trackState}`}</Text>
      </Layout>
      <TouchableWithoutFeedback
        onPress={onRestartPress}
      >
        <Layout style={styles.restartContainer} level='4'>
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
      <Layout style={styles.timeTextContainer} level='4'>
        <Layout style={styles.timeContainer} level='4'>
          <Text category='s2' style={styles.timePassed}>{timePassed}</Text>
        </Layout>
        <Layout style={styles.timeContainer} level='4'>
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
