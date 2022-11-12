import React, { useContext, useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TrackPlayer, { Capability  } from 'react-native-track-player';
import { Button, Layout, Text } from '@ui-kitten/components';

import MeditationDataContext from '../contexts/meditationData';
import { MeditationPlayerScreenNavigationProp, MeditationPlayerStackScreenProps } from '../types';
import { getMeditation, getTrackURL } from '../utils/meditation';

const trackOne = {
  title: 'testing',
  url: require('../tracks/test.mp3'),
  artist: 'dr joe',
}

const MeditationPlayer = ({ route }: MeditationPlayerStackScreenProps<'MeditationPlayer'>) => {
  const { meditations } = useContext(MeditationDataContext);
  const navigation = useNavigation<MeditationPlayerScreenNavigationProp>();

  const { id } = route.params;
  const meditation = getMeditation(id, meditations);

  if (!meditation) return null;

  const trackURL = getTrackURL(meditation.id);
  const track = {
    url: require('../tracks/test.mp3'),
    ...meditation,
  }

  const setupTrackPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.add(trackOne)
      TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],

        compactCapabilities: [Capability.Play, Capability.Pause],
      })
    } catch(e) {
      console.log(e)
    }
  }

  useEffect(() => {
    setupTrackPlayer();
  }, []);

  const onClosePress = () => {
    navigation.pop();
  }

  const onPlayPress = () => {
    TrackPlayer.play();
  }

  const onPausePress = () => {
    TrackPlayer.pause();
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