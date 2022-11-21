import React from 'react';
import { Button, Layout } from '@ui-kitten/components';

import { removeRecentMeditationIdsFromAsyncStorage } from '../contexts/recentMeditationData';
import { removeUnlockedMeditationIdsFromAsyncStorage } from '../utils/filePicker';
import { removeFtuxStateFromAsyncStorage } from '../utils/ftux';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MeditationScreenNavigationProp } from '../types';

const DebugScreen = () => {
  const stackNavigation = useNavigation<MeditationScreenNavigationProp>();
  const onBackPress = () => stackNavigation.navigate('TabNavigation');

  return (
    <Layout style={styles.container}>
      <Button
        onPress={onBackPress}
      >
        Go Back
      </Button>
      <Button
        onPress={removeUnlockedMeditationIdsFromAsyncStorage}
      >
        Remove Meditation Ids
      </Button>
      <Button
        onPress={removeRecentMeditationIdsFromAsyncStorage}
      >
        Remove Recent Ids
      </Button>
      <Button
        onPress={removeFtuxStateFromAsyncStorage}
      >
        Remove FTUX state
      </Button>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 60,
    flex: 1,
    justifyContent: 'space-around'
  }
})

export default DebugScreen;
