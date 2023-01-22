import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TrackPlayer from 'react-native-track-player';
import _ from 'lodash';
import { Icon, Layout, Text } from '@ui-kitten/components';

import _Button from '../components/Button';
import { MeditationPlayerScreenNavigationProp, MeditationPlayerStackScreenProps } from '../types';
import MeditationBaseDataContext from '../contexts/meditationBaseData';
import RecentMeditationIdsContext from '../contexts/recentMeditationData';
import { setRecentMeditationIdsInAsyncStorage } from '../utils/meditation';
import { Player } from '../components/Player';


const brightWhite = '#fcfcfc';
const lightestWhite = '#dcdcdc';
const countDownInSeconds = 5;

const CloseIcon = (props: any) => (
  <Icon {...props} style={styles.closeIcon} fill={brightWhite} name='close-outline' />
);

const MeditationPlayer = ({ route }: MeditationPlayerStackScreenProps<'MeditationPlayer'>) => {
  const { recentMeditationIds, setRecentMeditationIds } = useContext(RecentMeditationIdsContext);
  const { meditationBaseData } = useContext(MeditationBaseDataContext);
  const navigation = useNavigation<MeditationPlayerScreenNavigationProp>();
  const [ isPlaying, setIsPlaying ] = useState(false);
  const [time, setTime] = React.useState(countDownInSeconds);
  const timerRef = React.useRef(time);

  const { id, meditationBreathId } = route.params;
  const meditation = meditationBaseData[id]
  const tracks = [meditation]

  console.log('MEDITATION PLAYER: Tracks', tracks);
  
  // if (meditationBreathId) {
  //   tracks.unshift(meditationMap[meditationBreathId])
  // };

  // if (!meditation) return null;

  // const updateRecentMeditationIds = () => {
  //   if (meditation) {
  //     const recentlyPlayedIds = [meditation.meditationId, ...recentMeditationIds];
  //     const dedupedRecentlyPlayedIds = _.uniq(recentlyPlayedIds);
  //     return dedupedRecentlyPlayedIds.slice(0, 8);
  //   }
  // }

  // const tester = async () => {
  //   const result = await AsyncStorage.getItem(storageKey);
  //   setFilePath(result as any);
  //   console.log('result 2', result);
  // }

  const tester2 = async () => {
    const test = await TrackPlayer.getState();
    console.log('player state', test);
  }

  useEffect(() => {
    // const recentMeditationIds = updateRecentMeditationIds();

    const timerId = setInterval(() => {
      timerRef.current -= 1;
      if (timerRef.current < 0) {
        TrackPlayer.play();
        setIsPlaying(true);
        clearInterval(timerId);
        if (recentMeditationIds) {
          setRecentMeditationIdsInAsyncStorage(recentMeditationIds)
          setRecentMeditationIds(recentMeditationIds)
        }
        tester2();
      } else {
        setTime(timerRef.current);
      }
    }, 1000);

    const testInterval = setInterval(() => {
      tester2();
    }, 5000)

    return () => {
      clearInterval(timerId);
      clearInterval(testInterval);
    }
  }, []);

  const onClosePress = () => {
    navigation.pop();
  }

  const onFinishPress = () => {
    navigation.replace('MeditationFinish');
  }

  const isFinishButtonDisabled = time > 0;

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
            <Text category='h6' style={styles.meditationNameText}>{meditation.name}</Text>
          </Layout>
        </Layout>
        <Layout style={styles.bottomBar} level='4'>
          <Player tracks={tracks} />
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
    </Layout>
  )
}

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
  closeIcon: {
    height: 20,
    width: 20,
  },
  closeIconContainer: {
    padding: 20,
  },
})

export default MeditationPlayer;