/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';

import UnlockedMeditationIdsContext, { getUnlockedMeditationIdsFromAsyncStorage } from './src/contexts/meditationData';
import RecentMeditationIdsContext, { getRecentMeditationIdsFromAsyncStorage } from './src/contexts/recentMeditationData';
import StackNavigator from './src/navigation/Stack';
import { MeditationBaseMap, MeditationId, MeditationInstance } from './src/types';
import { default as mapping } from './mapping.json'; // <-- Import app mapping
import { default as theme } from './theme.json';
import { getFtuxStateInAsyncStorage } from './src/utils/ftux';
import FtuxContext from './src/contexts/ftuxData';
import { MeditationKeys } from './src/constants/meditation';
import UserContext, { initialUserState, User, UserStreaks } from './src/contexts/userData';
import FullUserLoadedContext from './src/contexts/fullUserLoaded';
import MeditationBaseDataContext from './src/contexts/meditationBaseData';
import { makeMeditationBaseData } from './src/utils/meditation';
import MeditationInstanceDataContext from './src/contexts/meditationInstanceData';
import StreakContext, { initialStreakData } from './src/contexts/streaks';
import toastConfig from './src/toastConfig';
import { SetupService } from './src/services/setupService';
import _ from 'lodash';

const App = () => {
  const [unlockedMeditationIds, setUnlockedMeditationIds] = useState([] as MeditationId[]);
  const [meditationBaseData, setMeditationBaseData] = useState({} as MeditationBaseMap);
  const [recentMeditationIds, setRecentMeditationIds] = useState([] as MeditationId[]);
  const [meditationInstanceData, setMeditationInstanceData] = useState({} as MeditationInstance);
  const [user, setUser] = useState(initialUserState as User);
  const [streaks, setStreaks] = useState(initialStreakData as UserStreaks);
  const [fullUserLoaded, setFullUserLoaded] = useState(false);
  const [hasSeenFtux, setHasSeenFtux] = useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);

  const normalizeFirebaseUser = (firebaseUser: any): User => ({
    uid: firebaseUser.uid,
    hasBetaAccess: false,
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
              setFullUserLoaded(true);
            }
          } else {
            console.log('adding user')
            firestore()
              .collection('users')
              .doc(firebaseUser.uid)
              .set(normalizeFirebaseUser(firebaseUser))
              .then(() => {
                setFullUserLoaded(true);
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

  const setMeditationBaseDataToContext = async () => {
    const meditationBaseData = await makeMeditationBaseData();
    if (meditationBaseData) {
      setMeditationBaseData(meditationBaseData);
    }
  }

  useEffect(() => {
    let unmounted = false;

    (async () => {
      const isSetup = await SetupService();
      if (unmounted) return;
      setIsPlayerReady(isSetup);
    })();

    setMeditationBaseDataToContext();

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

    return () => {
      unmounted = true;
      subscriber;
    }
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
          <FullUserLoadedContext.Provider value={{ fullUserLoaded, setFullUserLoaded }}>
            <StreakContext.Provider value={{ streaks, setStreaks }}>
              <MeditationBaseDataContext.Provider value={{ meditationBaseData, setMeditationBaseData }}>
                <MeditationInstanceDataContext.Provider value={{ meditationInstanceData, setMeditationInstanceData }}>
                  <UnlockedMeditationIdsContext.Provider value={{ unlockedMeditationIds, setUnlockedMeditationIds }}>
                    <RecentMeditationIdsContext.Provider value={({ recentMeditationIds, setRecentMeditationIds })}>
                      <FtuxContext.Provider value={({ hasSeenFtux, setHasSeenFtux })}>
                        <StackNavigator />
                      </FtuxContext.Provider>
                    </RecentMeditationIdsContext.Provider>
                  </UnlockedMeditationIdsContext.Provider>
                </MeditationInstanceDataContext.Provider>
              </MeditationBaseDataContext.Provider>
            </StreakContext.Provider>
          </FullUserLoadedContext.Provider>
        </UserContext.Provider>
      </ApplicationProvider>
      <Toast config={toastConfig as any} />
    </>
  );
};

export default App;
