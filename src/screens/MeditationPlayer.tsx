import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TrackPlayer, { useProgress, useTrackPlayerEvents, Event, Track, State as TrackPlayerState } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import KeepAwake from 'react-native-keep-awake';
import { Icon, Layout, Modal, Text } from '@ui-kitten/components';

import _Button from '../components/Button';
import MeditationBaseDataContext from '../contexts/meditationBaseData';
import { MeditationPlayerScreenNavigationProp, MeditationPlayerStackScreenProps } from '../types';
import { convertMeditationToTrack } from '../utils/track';
import MeditationInstanceDataContext from '../contexts/meditationInstanceData';
import Button from '../components/Button';
import { onAddMeditations } from '../utils/addMeditations';

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
  const { meditationBaseData, setMeditationBaseData } = useContext(MeditationBaseDataContext);
  const { meditationInstanceData, setMeditationInstanceData } = useContext(MeditationInstanceDataContext);
  const [existingMediationFilePathData, setExistingMeditationFilePathData] = useState({} as MeditationFilePathData);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [time, setTime] = React.useState(countDownInSeconds);
  const navigation = useNavigation<MeditationPlayerScreenNavigationProp>();
  const timerRef = React.useRef(time);
  const { position, duration } = useProgress();
  const [trackData, setTrackData] = useState({} as Track);
  const [tracks, setTracks] = useState([] as Track[]);
  const [meditationTime, setMeditationTime] = useState(0);

  const { id, meditationBreathId } = route.params;
  const meditation = meditationBaseData[id];

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.nextTrack && event.nextTrack > 0) {
      const track = tracks[event.nextTrack];
      const prevTrackMeditationTime = position;
      setMeditationTime(prevTrackMeditationTime);
      setTrackData(track);
    } else if (event.nextTrack === undefined) {
      setMeditationInstanceData({
        ...meditationInstanceData,
        timeMeditated: meditationTime + position,
      })
      navigation.navigate('MeditationFinish');
    }
  });

  useEffect(() => {
    addTracks();
    const countDownTimer = setCountDownTimer();
    const trackStateInterval = getTrackState();
    shouldKeepAwake(true);

    return () => {
      clearInterval(countDownTimer);
      clearInterval(trackStateInterval);
      resetTrackPlayer();
    }
  }, []);

  const addTracks = async () => {
    const tracks = makeTrackList();
    setTracks(tracks);
    await TrackPlayer.add(tracks)
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
        playTrackPlayer();
        clearInterval(countDownTimer);
      } else {
        setTime(timerRef.current);
      }
    }, 1000);

    return countDownTimer;
  }

  const getTrackState = () => {
    const getTrackStateInterval = setInterval(async () => {
      const state = await TrackPlayer.getState();
      if (
        state === TrackPlayerState.Buffering ||
        state === TrackPlayerState.Connecting &&
        timerRef.current <= 0
      ) {
        // TODO: Send analytics event
        clearInterval(getTrackStateInterval);
        setIsModalVisible(true);
        //@ts-ignore
      } else if (
        state === TrackPlayerState.Paused ||
        state === TrackPlayerState.Stopped ||
        state === TrackPlayerState.None
      ) {
        setIsPlaying(false);
      } else if (
        state === TrackPlayerState.Playing &&
        !isPlaying
      ) {
        setIsPlaying(true)
      }
      console.log('player state', state);
    }, 1000)

    return getTrackStateInterval;
  }

  const shouldKeepAwake = (_shouldBeAwake: boolean) => {
    if (_shouldBeAwake) {
      KeepAwake.activate();
    } else {
      KeepAwake.deactivate();
    }
  }

  const onAddMeditationsPress = async () => {
    const meditations = await onAddMeditations(
      existingMediationFilePathData,
      setExistingMeditationFilePathData,
    )
    if (meditations) {
      setMeditationBaseData(meditations);
      setIsModalVisible(false);
      navigation.goBack();
    }
  }

  const playTrackPlayer = async () => {
    TrackPlayer.play();
    setIsPlaying(true);
  }

  const resetTrackPlayer = () => {
    TrackPlayer.reset();
  }

  const onClosePress = () => {
    resetTrackPlayer();
    navigation.goBack();
  }

  const onFinishPress = () => {
    console.log('MEDITATION PLAYER: onFinishPress > position', position);

    shouldKeepAwake(false);
    resetTrackPlayer();
  }

  const onPlayPress = () => {
    playTrackPlayer();
  }

  const onPausePress = async () => {
    TrackPlayer.pause();
    setIsPlaying(false);
  }

  const onRestartPress = async () => {
    TrackPlayer.seekTo(0);
  }

  const isFinishButtonDisabled = time > 0;
  const timePassed = new Date(position * 1000)
    .toISOString()
    .slice(12, 19);
  const timeLeft = new Date((duration - position) * 1000)
    .toISOString()
    .slice(12, 19);
  const trackTitle = trackData && trackData.title;

  const renderModalContext = () => {
    return (
      <>
        <Text
          category='h5'
        >
          Sorry!
        </Text>
        <Text
          category='s1'
          style={styles.modalDescription}
        >
          It seems that we've lost connection with your meditation files.
          We're looking into why this happened.
          Please re-add them to start this meditation.
        </Text>
        <Button
          onPress={onAddMeditationsPress}
        >
          Add Meditations
        </Button>
      </>
    )
  }

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
      <Modal
        visible={isModalVisible}
        backdropStyle={styles.modalBackdrop}
        onBackdropPress={() => setIsModalVisible(false)}
      >
        <Layout level='3' style={styles.modalContainer}>
          <Layout level='3'>
            {renderModalContext()}
          </Layout>
          <Button
            appearance='ghost'
            onPress={() => setIsModalVisible(false)}
            style={styles.modalButton}
          >
            Close
          </Button>
        </Layout>
      </Modal>
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
  modalBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalButton: {
    marginTop: 20,
  },
  modalContainer: {
    borderRadius: 16,
    padding: 20,
    width: 350,
  },
  modalContextHeader: {
    lineHeight: 22,
    marginBottom: 24,
    opacity: 0.9,
  },
  modalContextText: {
    lineHeight: 22,
    marginBottom: 20,
    opacity: 0.9,
  },
  modalDescription: {
    lineHeight: 22,
    marginVertical: 26,
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
