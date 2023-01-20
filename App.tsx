/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { type PropsWithChildren, useState, useEffect } from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

import UnlockedMeditationIdsContext, { getUnlockedMeditationIdsFromAsyncStorage } from './src/contexts/meditationData';
import RecentMeditationIdsContext, { getRecentMeditationIdsFromAsyncStorage } from './src/contexts/recentMeditationData';
import StackNavigator from './src/navigation/Stack';
import { MeditationId } from './src/types';
import { default as mapping } from './mapping.json'; // <-- Import app mapping
import { default as theme } from './theme.json';
import { getFtuxStateInAsyncStorage } from './src/utils/ftux';
import FtuxContext from './src/contexts/ftuxData';
import { MeditationKeys } from './src/constants/meditation';
import UserContext, { initialUserState } from './src/contexts/userData';

const App = () => {
  const [unlockedMeditationIds, setUnlockedMeditationIds] = useState([] as MeditationId[]);
  const [recentMeditationIds, setRecentMeditationIds] = useState([] as MeditationId[]);
  const [user, setUser] = useState(initialUserState);
  const [hasSeenFtux, setHasSeenFtux] = useState(false);
  const [isReady, setIsReady] = React.useState(false);

  const normalizeFirebaseUser = (firebaseUser: any) => ({
    displayName: firebaseUser.displayName,
    email: firebaseUser.email,
    metaData: {
      creationTime: firebaseUser.metadata.creationTime,
      lastSignInTime: firebaseUser.metadata.lastSignInTime,
    },
    photoURL: firebaseUser.photoURL,
    uid: firebaseUser.uid,
  })

  const onAuthStateChanged = (firebaseUser: any) => {
    if (firebaseUser && user && user.uid.length <= 0) {
      console.log('firebase user', firebaseUser);
      setUser(normalizeFirebaseUser(firebaseUser));
    }
  }

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '859830619066-3iasok69fiujoak3vlcrq3lsjevo65rg.apps.googleusercontent.com'
    })

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

    const setMeditationIds = async () => {
      setUnlockedMeditationIds([MeditationKeys.NewPotentials, MeditationKeys.NewPotentialsBreath, MeditationKeys.BreakingTheHabit, MeditationKeys.BreakingTheHabitWater])
    }

    const syncAsyncUnlockedMeditationStorageToContext = async () => {
      const unlockedMeditationIdsFromStorage = await getUnlockedMeditationIdsFromAsyncStorage();
      if (unlockedMeditationIdsFromStorage) {
        setUnlockedMeditationIds(unlockedMeditationIdsFromStorage);
      }
    }

    const syncAsyncRecentMeditationStorageToContext = async () => {
      const recentMeditationIdsFromStorage = await getRecentMeditationIdsFromAsyncStorage();
      if (recentMeditationIdsFromStorage) {
        console.log('HERE', recentMeditationIdsFromStorage)
        setRecentMeditationIds(recentMeditationIdsFromStorage);
      } else {
        return null;
      }
    }

    const getFtux = async () => {
      try {
        const hasSeenFtux = await getFtuxStateInAsyncStorage();
        if (hasSeenFtux) {
          setHasSeenFtux(hasSeenFtux)
        }
      } finally {
        setIsReady(true);
      }
    }

    if (!isReady) {
      getFtux();
    }
    // syncAsyncRecentMeditationStorageToContext();
    // syncAsyncUnlockedMeditationStorageToContext();
    setMeditationIds();

    return subscriber;
  }, [isReady])

  if (!isReady) {
    return null;
  }

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider
        {...eva}
        theme={{ ...eva.dark, ...theme }}
        // @ts-ignore
        // customMapping={mapping}
      >
        <UserContext.Provider value={{ user, setUser }}>
          <UnlockedMeditationIdsContext.Provider value={{ unlockedMeditationIds, setUnlockedMeditationIds }}>
            <RecentMeditationIdsContext.Provider value={({ recentMeditationIds, setRecentMeditationIds })}>
              <FtuxContext.Provider value={({ hasSeenFtux, setHasSeenFtux })}>
                <StackNavigator />
              </FtuxContext.Provider>
            </RecentMeditationIdsContext.Provider>
          </UnlockedMeditationIdsContext.Provider>
        </UserContext.Provider>
      </ApplicationProvider>
    </>
  );
};

export default App;
