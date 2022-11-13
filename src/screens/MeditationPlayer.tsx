import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import { Bar } from 'react-native-progress';
import { Button, Icon, Layout, Text } from '@ui-kitten/components';

import MeditationDataContext from '../contexts/meditationData';
import { MeditationPlayerScreenNavigationProp, MeditationPlayerStackScreenProps } from '../types';
import { getMeditation, getTrackURL } from '../utils/meditation';
import { TouchableWithoutFeedback } from '@ui-kitten/components/devsupport';

const CloseIcon = (props: any) => (
  <Icon {...props} name='close-outline' />
);

const PlayIcon = (props: any) => (
  <Icon {...props} style={styles.playerIcon} fill='#b2b2b2' name='play-circle-outline' />
);

const PauseIcon = (props: any) => (
  <Icon {...props} style={styles.playerIcon} fill='#b2b2b2' name='pause-circle-outline' />
);

const RestartIcon = (props: any) => (
  <Icon {...props} style={styles.restartIcon} fill='#b2b2b2' name='sync-outline' />
);

const MeditationPlayer = ({ route }: MeditationPlayerStackScreenProps<'MeditationPlayer'>) => {
  const { meditations } = useContext(MeditationDataContext);
  const navigation = useNavigation<MeditationPlayerScreenNavigationProp>();
  const [ isPlaying, setIsPlaying ] = useState(false);
  const { position, buffered, duration } = useProgress()

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

  const trackProgress = (position / duration) || 0;

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Layout style={styles.topBar}>
          <Text category='h5' style={styles.topBarText}>{meditation.name}</Text>
          <Button
            appearance='ghost'
            accessoryLeft={CloseIcon}
            onPress={onClosePress}
            style={styles.topBarIcon}
          />
        </Layout>
        <Layout style={styles.main}>
          <Text></Text>
        </Layout>
        <Layout style={styles.bottomBar}>
          <TouchableWithoutFeedback
            onPress={onRestartPress}
            style={styles.test}
          >
            <RestartIcon />
          </TouchableWithoutFeedback>
          <Bar animationType={'timing'} color={'#B2B2B2'} progress={trackProgress} width={200}/>
          {isPlaying
            ? <TouchableWithoutFeedback
              onPress={onPausePress}
              style={styles.test}
            >
              <PauseIcon />
            </TouchableWithoutFeedback>
            : <TouchableWithoutFeedback
                onPress={onPlayPress}
                style={styles.test}
              >
              <PlayIcon />
            </TouchableWithoutFeedback>
          }
          {/* { isPlaying
            ? <Button
                appearance='ghost'
                accessoryLeft={PauseIcon}
                onPress={onPausePress}
              />
            : <Button
                appearance='ghost'
                accessoryLeft={PlayIcon}
                onPress={onPlayPress}
              />
          } */}
        </Layout>
      </SafeAreaView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  bottomBar: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  container: {
    flex: 1,
  },
  main: {
    flex: 6,
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
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingLeft: 20,
    paddingTop: 20,
    flex: 1,
  },
  topBarText: {
    flex: 9,
    // paddingBottom: 20,
  },
  topBarIcon: {
    flex: 1,
  },
  test: {
    // flex: 1,
    // backgroundColor: 'blue',
    flexDirection: 'row',
    padding: 20,
  }
})

export default MeditationPlayer;