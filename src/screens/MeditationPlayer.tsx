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
import { MeditationFilePathData } from '../utils/asyncStorageMeditation';
import { meditationPlayerSendEvent, Action, Noun } from '../analytics';

const brightWhite = '#fcfcfc';
const lightWhite = '#f3f3f3';
const lightestWhite = '#dcdcdc';
const errorRed = '#E28E69';
const countDownInSeconds = 8;

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

const ErrorIcon = (props: any) => (
  <Icon {...props} style={iconStyles.restartIcon} fill={errorRed} name='alert-circle-outline' />
);

const MeditationPlayer = ({ route }: MeditationPlayerStackScreenProps<'MeditationPlayer'>) => {
  const { meditationBaseData, setMeditationBaseData } = useContext(MeditationBaseDataContext);
  const { meditationInstanceData, setMeditationInstanceData } = useContext(MeditationInstanceDataContext);
  const [existingMeditationFilePathData, setExistingMeditationFilePathData] = useState({} as MeditationFilePathData);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [time, setTime] = React.useState(countDownInSeconds);
  const navigation = useNavigation<MeditationPlayerScreenNavigationProp>();
  const timerRef = React.useRef(time);
  const { position, duration } = useProgress();
  const [trackData, setTrackData] = useState({} as Track);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [tracks, setTracks] = useState([] as Track[]);
  const [meditationTime, setMeditationTime] = useState(0);

  const { id, meditationBreathId } = route.params;
  const meditation = meditationBaseData[id];

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.nextTrack && event.nextTrack > 0) {
      const prevTrackMeditationTime = position;
      setMeditationTime(prevTrackMeditationTime);
      setCurrentTrackIndex(event.nextTrack);
    } else if (event.nextTrack === undefined) {
      setMeditationInstanceData({
        ...meditationInstanceData,
        timeMeditated: meditationTime + position,
      })
      navigation.navigate('MeditationFinish');
    }
  });

  useEffect(() => {
    meditationPlayerSendEvent(
      Action.VIEW,
      Noun.ON_MOUNT,
      {
        meditationName: meditation.name,
        meditationBaseId: meditation.meditationBaseId,
      },
    );
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
      if (timerRef.current === 3) {
        playTrackPlayer();
      } else if (timerRef.current < 0) {
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
        meditationPlayerSendEvent(
          Action.FAIL,
          Noun.ON_PLAY,
          {
            meditationName: meditation.name,
            meditationBaseId: meditation.meditationBaseId,
          },
        );
        clearInterval(getTrackStateInterval);
        // setIsModalVisible(true);
        //@ts-ignore
      } else if (
        state !== TrackPlayerState.Playing &&
        isPlaying
      ) {
        setIsPlaying(false);
      } else if (
        state === TrackPlayerState.Playing &&
        !isPlaying
      ) {
        setIsModalVisible(false);
        setIsPlaying(true);
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
      existingMeditationFilePathData,
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
    shouldKeepAwake(false);
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

  const isFinishButtonDisabled = time > 3;
  const timePassed = new Date(position * 1000)
    .toISOString()
    .slice(12, 19);
  const timeLeft = new Date((duration - position) * 1000)
    .toISOString()
    .slice(12, 19);
  const trackTitle = tracks[currentTrackIndex]&& tracks[currentTrackIndex].title;

  const renderModalContext = () => {
    return (
      <>
        <Layout level='3' style={styles.modalHeader}>
          <ErrorIcon />
        </Layout>
        <Text
          category='s1'
          style={styles.modalDescription}
        >
          Your meditation files have entered the void.
          Please re-add them to start this meditation.
        </Text>
        <Button
          onPress={onAddMeditationsPress}
        >
          Re-add Meditations
        </Button>
      </>
    )
  }

  return (
    <Layout style={styles.container} level='4'>
      <SafeAreaView style={styles.container}>
        <Layout style={styles.topBarContainer} level='4'>
          <Text category='h6' style={styles.topBarTitle}>
            Playbox
          </Text>
          <TouchableWithoutFeedback
            onPress={onClosePress}
          >
            <Layout level='4'>
              <CloseIcon />
            </Layout>
          </TouchableWithoutFeedback>
        </Layout>
        <Layout style={styles.mainContainer} level='4'>
          <Layout style={styles.countdownTextContainer} level='4'>
            {time > 2
              ? <Text style={styles.countdownText}>{time - 3}</Text>
              : null
            }
          </Layout>
          <Layout style={styles.meditationName} level='4'>
            <Text category='h6' style={styles.meditationNameText}>{trackTitle}</Text>
          </Layout>
        </Layout>
        <Layout style={styles.bottomBarContainer} level='4'>
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
            status="control"
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
  errorIcon: {
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
  bottomBarContainer: {
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
  mainContainer: {
    flex: 5,
    paddingHorizontal: 20,
  },
  countdownTextContainer: {
    flex: 6,
    justifyContent: 'center',
  },
  meditationName: {
    flex: 3,
    flexDirection: 'column-reverse',
    paddingBottom: 16,
    color: 'red',
  },
  meditationNameText: {
    color: '#fcfcfc',
    textAlign: 'center',
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
    textAlign: 'center',
  },
  modalHeader: {
    alignItems: 'center',
  },
  countdownText: {
    textAlign: 'center',
    fontSize: 80,
    color: lightestWhite,
  },
  topBarContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  topBarTitle: {
    opacity: 0.8,
  },
})

export default MeditationPlayer;
