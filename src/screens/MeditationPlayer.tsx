import React, { useContext, useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TrackPlayer, { Capability  } from 'react-native-track-player';
import { Button, Layout, Text } from '@ui-kitten/components';

import MeditationDataContext from '../contexts/meditationData';
import { MeditationPlayerScreenNavigationProp, MeditationPlayerStackScreenProps } from '../types';

const track = {
  title: 'testing',
  url: require('../tracks/test.mp3'),
  artist: 'dr joe',
}

const MeditationPlayer = ({ route }: MeditationPlayerStackScreenProps<'MeditationPlayer'>) => {
  const { meditationFiles } = useContext(MeditationDataContext);
  const navigation = useNavigation<MeditationPlayerScreenNavigationProp>();
  const { name } = route.params;

  const meditationFile = meditationFiles.map(meditation => meditation.normalizedName === name);

  const setupTrackPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.add(track)
      TrackPlayer.updateOptions({
        // Media controls capabilities
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],

        // Capabilities that will show up when the notification is in the compact form on Android
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