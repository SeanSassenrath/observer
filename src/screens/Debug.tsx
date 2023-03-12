import React, { useContext } from 'react';
import { Button, Layout } from '@ui-kitten/components';
import auth from '@react-native-firebase/auth';

import { removeFtuxStateFromAsyncStorage } from '../utils/ftux';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MeditationScreenNavigationProp } from '../types';
import UserContext, { initialUserState } from '../contexts/userData';
import { removeMeditationFilePathDataInAsyncStorage } from '../utils/asyncStorageMeditation';

const DebugScreen = () => {
  const { setUser } = useContext(UserContext);
  const stackNavigation = useNavigation<MeditationScreenNavigationProp>();
  const onBackPress = () => stackNavigation.navigate('TabNavigation');
  const onSignOut = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!')
        setUser(initialUserState)
        stackNavigation.navigate('SignIn');
      });
  }

  return (
    <Layout style={styles.container}>
      <Button
        onPress={onBackPress}
      >
        Go Back
      </Button>
      <Button
        onPress={removeMeditationFilePathDataInAsyncStorage}
      >
        Remove Meditation File Data
      </Button>
      <Button
        onPress={removeFtuxStateFromAsyncStorage}
      >
        Remove FTUX state
      </Button>
      <Button
        onPress={onSignOut}
      >
        Sign Out
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
