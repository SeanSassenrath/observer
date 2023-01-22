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
import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import UnlockedMeditationIdsContext, { getUnlockedMeditationIdsFromAsyncStorage } from './src/contexts/meditationData';
import RecentMeditationIdsContext, { getRecentMeditationIdsFromAsyncStorage } from './src/contexts/recentMeditationData';
import StackNavigator from './src/navigation/Stack';
import { MeditationBaseMap, MeditationId } from './src/types';
import { default as mapping } from './mapping.json'; // <-- Import app mapping
import { default as theme } from './theme.json';
import { getFtuxStateInAsyncStorage } from './src/utils/ftux';
import FtuxContext from './src/contexts/ftuxData';
import { MeditationKeys } from './src/constants/meditation';
import UserContext, { initialUserState, User } from './src/contexts/userData';
import MeditationBaseDataContext from './src/contexts/meditationBaseData';
import { setMeditationBaseDataToContext } from './src/utils/meditation';

const App = () => {
  const [unlockedMeditationIds, setUnlockedMeditationIds] = useState([] as MeditationId[]);
  const [meditationBaseData, setMeditationBaseData] = useState({} as MeditationBaseMap);
  const [recentMeditationIds, setRecentMeditationIds] = useState([] as MeditationId[]);
  const [user, setUser] = useState(initialUserState as User);
  const [hasSeenFtux, setHasSeenFtux] = useState(false);
  const [isReady, setIsReady] = React.useState(false);

  const normalizeFirebaseUser = (firebaseUser: any): User => ({
    uid: firebaseUser.uid,
    profile: {
      displayName: firebaseUser.displayName,
      email: firebaseUser.email,
      firstName: firebaseUser.displayName.split(' ')[0],
      lastName: firebaseUser.displayName.split(' ')[1],
      creationTime: firebaseUser.metadata.creationTime,
      lastSignInTime: firebaseUser.metadata.lastSignInTime,
      photoURL: firebaseUser.photoURL,
    }
  })

  const onAuthStateChanged = (firebaseUser: any) => {
    if (firebaseUser && user && user.uid.length <= 0) {
      const normalizedUser = normalizeFirebaseUser(firebaseUser)
      setUser(normalizedUser);

      firestore()
        .collection('users')
        .doc(firebaseUser.uid)
        .get()
        .then(documentSnapshot => {
          if (documentSnapshot.exists) {
            const fullUserData = documentSnapshot.data();
            if (fullUserData) {
              setUser(fullUserData as User);
            }
          } else {
            console.log('adding user')
            firestore()
              .collection('users')
              .doc(firebaseUser.uid)
              .set(normalizeFirebaseUser(firebaseUser))
              .then(() => {
                console.log('user added')
                // TODO: Add monitoring here
              })
              .catch((e) => {
                console.log('user not added', e)
                // TODO: Add monitoring here
              })
          }
        })
    }
  }

  useEffect(() => {
    setMeditationBaseDataToContext(setMeditationBaseData);

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
          <MeditationBaseDataContext.Provider value={{ meditationBaseData, setMeditationBaseData }}>
            <UnlockedMeditationIdsContext.Provider value={{ unlockedMeditationIds, setUnlockedMeditationIds }}>
              <RecentMeditationIdsContext.Provider value={({ recentMeditationIds, setRecentMeditationIds })}>
                <FtuxContext.Provider value={({ hasSeenFtux, setHasSeenFtux })}>
                  <StackNavigator />
                </FtuxContext.Provider>
              </RecentMeditationIdsContext.Provider>
            </UnlockedMeditationIdsContext.Provider>
          </MeditationBaseDataContext.Provider>
        </UserContext.Provider>
      </ApplicationProvider>
    </>
  );
};

export default App;
