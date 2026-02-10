import React, {useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import TrackPlayer, {
  Track,
  State as TrackPlayerState,
} from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import {Icon, Layout, Modal, Text} from '@ui-kitten/components';

import _Button from '../components/Button';
import MeditationBaseDataContext from '../contexts/meditationBaseData';
import PlaylistContext from '../contexts/playlist';
import {
  MeditationPlayerScreenNavigationProp,
  MeditationPlayerStackScreenProps,
} from '../types';
import {convertMeditationToTrack} from '../utils/track';
import MeditationInstanceDataContext from '../contexts/meditationInstanceData';
import MeditationSessionContext from '../contexts/meditationSession';
import MeditationFilePathsContext from '../contexts/meditationFilePaths';
import Button from '../components/Button';
import {meditationPlayerSendEvent, Action, Noun} from '../analytics';
import {MeditationPlayerCancelModal} from '../components/MeditationPlayerCancelModal/component';
import {resetMeditationInstanceData} from '../utils/meditationInstance/meditationInstance';
import UserContext from '../contexts/userData';
import {
  getActiveTrackIndex,
  getPlaybackState,
  getProgress,
} from 'react-native-track-player/lib/src/trackPlayer';

const brightWhite = '#fcfcfc';
const lightWhite = '#f3f3f3';
const lightestWhite = '#dcdcdc';
const countDownInSeconds = 8;

const CloseIcon = (props: any) => (
  <Icon
    {...props}
    style={iconStyles.closeIcon}
    fill={brightWhite}
    name="close-outline"
  />
);

const PlayIcon = (props: any) => (
  <Icon
    {...props}
    style={iconStyles.playerIcon}
    fill={lightWhite}
    name="play-circle"
  />
);

const PauseIcon = (props: any) => (
  <Icon
    {...props}
    style={iconStyles.playerIcon}
    fill={lightWhite}
    name="pause-circle"
  />
);

const RestartIcon = (props: any) => (
  <Icon
    {...props}
    style={iconStyles.restartIcon}
    fill={lightWhite}
    name="sync"
  />
);

const MeditationPlayer = ({
  route,
}: MeditationPlayerStackScreenProps<'MeditationPlayer'>) => {
  const {meditationBaseData} = useContext(MeditationBaseDataContext);
  const {playlists} = useContext(PlaylistContext);
  const {meditationInstanceData, setMeditationInstanceData} = useContext(
    MeditationInstanceDataContext,
  );
  const {meditationSession, setMeditationSession} = useContext(
    MeditationSessionContext,
  );
  const [playerState, setPlayerState] = useState(TrackPlayerState.None);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [time, setTime] = React.useState(countDownInSeconds);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [tracks, setTracks] = useState([] as Track[]);
  const [meditationTime, setMeditationTime] = useState(0);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const timerRef = React.useRef(time);

  const navigation = useNavigation<MeditationPlayerScreenNavigationProp>();

  const {id, meditationBreathId} = route.params;
  const meditation = meditationBaseData[id];
const playlist = meditationSession.playlistId ? playlists[meditationSession.playlistId] : null;
  useEffect(() => {
    meditationPlayerSendEvent(Action.VIEW, Noun.ON_MOUNT, {
      meditationName: meditation.name,
      meditationBaseId: meditation.meditationBaseId,
    });
    addTracks();
    const countDownTimer = setCountDownTimer();
    const trackStateInterval = getTrackState();

    return () => {
      clearInterval(countDownTimer);
      clearInterval(trackStateInterval);
      resetTrackPlayer();
    };
  }, []);

  const addTracks = async () => {
    const _tracks = makeTrackList();
    setTracks(_tracks);
    await TrackPlayer.add(_tracks);
  };

  const makeTrackList = () => {
    const _tracks = [];

    // PLAYLIST MODE: Load all meditations from playlist
    if (playlist) {
      playlist.meditationIds.forEach(medId => {
        const med = meditationBaseData[medId];
        if (med) {
          _tracks.push(convertMeditationToTrack(med));
        }
      });
      return _tracks;
    }

    // SINGLE/BREATHWORK MODE: Original logic
    _tracks.push(convertMeditationToTrack(meditation));

    if (meditationBreathId) {
      const meditationBreath = meditationBaseData[meditationBreathId];
      _tracks.unshift(convertMeditationToTrack(meditationBreath));
    }

    return _tracks;
  };

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
  };

  const getTrackState = () => {
    const getTrackStateInterval = setInterval(async () => {
      // Track State Management
      const playbackState = await getPlaybackState();
      const {state} = playbackState;
      setPlayerState(state);

      if (state === TrackPlayerState.Error) {
        meditationPlayerSendEvent(Action.FAIL, Noun.ON_PLAY, {
          meditationName: meditation.name,
          meditationBaseId: meditation.meditationBaseId,
        });

        // Retry playing the current track
        TrackPlayer.play();
      }

      // Active Track
      const activeTrackIndex = await getActiveTrackIndex();
      if (activeTrackIndex !== currentTrackIndex) {
        if (activeTrackIndex) {
          setCurrentTrackIndex(activeTrackIndex);
        }
      }

      // Track Progress Management
      const progress = await getProgress();
      const _position = Math.round(progress.position);
      const _duration = Math.round(progress.duration);

      setPosition(_position);
      setDuration(_duration);

      const endOfTrack = _duration > 0 && _position >= _duration;

      if (endOfTrack) {
        const trackQueue = await TrackPlayer.getQueue();
        const numberOfTracks = trackQueue.length;
        const isLastTrack = activeTrackIndex === numberOfTracks - 1;

        // Update the current meditation instance with timeMeditated
        const currentMeditationId = playlist && activeTrackIndex
          ? playlist.meditationIds[activeTrackIndex]
          : meditation.meditationBaseId;

        // Find the instance in the session and update its timeMeditated
        const updatedInstances = meditationSession.instances.map((instance, idx) => {
          // For playlist: match by index, for single: it's the only instance
          if ((playlist && idx === activeTrackIndex) ||
              (!playlist && instance.meditationBaseId === currentMeditationId)) {
            return {
              ...instance,
              timeMeditated: _position,
            };
          }
          return instance;
        });

        setMeditationSession({
          ...meditationSession,
          instances: updatedInstances,
          timeMeditated: meditationTime + position,
        });

        if (isLastTrack) {
          // Last track completed - navigate to finish screen
          const totalTime = meditationTime + _position;

          setMeditationInstanceData({
            ...meditationInstanceData,
            timeMeditated: totalTime,
          });
          navigation.pop();
          navigation.navigate('MeditationFinish');
        } else {
          // Not last track - continue playing
          setMeditationTime(meditationTime + _position);
        }
      }
    }, 1000);

    // Track Index Management

    return getTrackStateInterval;
  };

  const playTrackPlayer = async () => {
    TrackPlayer.play();
  };

  const resetTrackPlayer = () => {
    TrackPlayer.reset();
  };

  const onClosePress = () => {
    setIsCancelModalVisible(true);
  };

  const onFinishPress = () => {
    // Update current meditation instance with partial time before navigating
    const currentMeditationId = playlist
      ? playlist.meditationIds[currentTrackIndex]
      : meditation.meditationBaseId;

    // Find and update the current instance with timeMeditated
    const updatedInstances = meditationSession.instances.map((instance, idx) => {
      if ((playlist && idx === currentTrackIndex) ||
          (!playlist && instance.meditationBaseId === currentMeditationId)) {
        return {
          ...instance,
          timeMeditated: position,  // Update with current position
        };
      }
      return instance;
    });

    setMeditationSession({
      ...meditationSession,
      instances: updatedInstances,
      timeMeditated: meditationTime + position,
    });

    setMeditationInstanceData({
      ...meditationInstanceData,
      timeMeditated: meditationTime + position,
    });
    navigation.pop();
    navigation.navigate('MeditationFinish');
    resetTrackPlayer();
  };

  const onPlayPress = () => {
    playTrackPlayer();
  };

  const onPausePress = async () => {
    TrackPlayer.pause();
  };

  const onRestartPress = async () => {
    TrackPlayer.seekTo(0);
  };

  const onCancelMeditationModalPress = () => {
    resetMeditationInstanceData(setMeditationInstanceData);
    resetTrackPlayer();
    // @ts-ignore
    navigation.navigate('TabNavigation', {screen: 'Home'});
  };

  const isPlaying = playerState === TrackPlayerState.Playing;
  const isFinishButtonDisabled = time > 3;
  const timePassed = new Date(position * 1000).toISOString().slice(12, 19);
  const timeLeft = new Date((duration - position) * 1000)
    .toISOString()
    .slice(12, 19);
  const trackTitle =
    tracks[currentTrackIndex] && tracks[currentTrackIndex].title;

  return (
    <Layout level="4" style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.topBarContainer}>
          <TouchableWithoutFeedback onPress={onClosePress}>
            <View>
              <CloseIcon />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.countdownTextContainer}>
            {time > 2 ? (
              <Text style={styles.countdownText}>{time - 3}</Text>
            ) : null}
          </View>
          <View style={styles.meditationName}>
            <Text category="h6" style={styles.meditationNameText}>
              {trackTitle}
            </Text>
            {playlist && (
              <Text category="s1" style={styles.trackIndicatorText}>
                Meditation {currentTrackIndex + 1} of {tracks.length}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.bottomBarContainer}>
          <View style={playerStyles.container}>
            <TouchableWithoutFeedback onPress={onRestartPress}>
              <View style={playerStyles.restartContainer}>
                <RestartIcon />
              </View>
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
            <View style={playerStyles.timeTextContainer}>
              <View style={playerStyles.timeContainer}>
                <Text category="s2" style={playerStyles.timePassed}>
                  {timePassed}
                </Text>
              </View>
              <View style={playerStyles.timeContainer}>
                <Text
                  category="s2"
                  style={playerStyles.timeLeft}>{`-${timeLeft}`}</Text>
              </View>
            </View>
            {isPlaying ? (
              <TouchableWithoutFeedback onPress={onPausePress}>
                <PauseIcon />
              </TouchableWithoutFeedback>
            ) : (
              <TouchableWithoutFeedback onPress={onPlayPress}>
                <PlayIcon />
              </TouchableWithoutFeedback>
            )}
          </View>
          <View style={styles.finishButtonContainer}>
            <_Button
              disabled={isFinishButtonDisabled}
              onPress={onFinishPress}
              size="large"
              style={styles.finishButton}>
              FINISH
            </_Button>
          </View>
        </View>
      </SafeAreaView>
      <MeditationPlayerCancelModal
        isVisible={isCancelModalVisible}
        onCancel={onCancelMeditationModalPress}
        onContinue={() => setIsCancelModalVisible(false)}
      />
      <Modal
        visible={isModalVisible}
        backdropStyle={styles.modalBackdrop}
        onBackdropPress={() => setIsModalVisible(false)}>
        <Layout level="3" style={styles.modalContainer}>
          {/* <Layout level='3'>
            {renderModalContext()}
          </Layout> */}
          <Button
            appearance="ghost"
            onPress={() => setIsModalVisible(false)}
            style={styles.modalButton}
            status="control">
            Close
          </Button>
        </Layout>
      </Modal>
    </Layout>
  );
};

const iconStyles = StyleSheet.create({
  closeIcon: {
    height: 36,
    width: 36,
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
  },
});

const styles = StyleSheet.create({
  bottomBarContainer: {
    flex: 4,
    padding: 20,
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
  trackIndicatorText: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
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
    justifyContent: 'flex-end',
    marginRight: 20,
  },
  topBarTitle: {
    opacity: 0.8,
  },
});

export default MeditationPlayer;
