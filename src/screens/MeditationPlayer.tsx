import React, { useContext, useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TrackPlayer from 'react-native-track-player';
import { Button, Layout, Text } from '@ui-kitten/components';

import MeditationDataContext from '../contexts/meditationData';
import { MeditationPlayerScreenNavigationProp, MeditationPlayerStackScreenProps } from '../types';
import { getMeditation, getTrackURL } from '../utils/meditation';

const MeditationPlayer = ({ route }: MeditationPlayerStackScreenProps<'MeditationPlayer'>) => {
  const { meditations } = useContext(MeditationDataContext);
  const navigation = useNavigation<MeditationPlayerScreenNavigationProp>();

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

    return () => {
      removeTracks();
    }
  }, []);

  const onClosePress = () => {
    navigation.pop();
  }

  const onPlayPress = async () => {
    TrackPlayer.play();
    await TrackPlayer.getState();
    const playerPlay = await TrackPlayer.getState();
    console.log('Player state - Play', playerPlay);
  }

  const onPausePress = async () => {
    TrackPlayer.pause();
    await TrackPlayer.getState();
    const playerPause = await TrackPlayer.getState();
    console.log('Player state - Pause', playerPause);
  }

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Layout style={styles.topBar}>
          <Text category='h5' style={styles.topBarText}>Meditation Player</Text>
          <Button onPress={onClosePress}>Close</Button>
          <Button onPress={onPlayPress}>Play</Button>
          <Button onPress={onPausePress}>Pause</Button>
        </Layout>
      </SafeAreaView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    padding: 20,
  },
  topBarText: {
    paddingBottom: 20,
  },
})

export default MeditationPlayer;