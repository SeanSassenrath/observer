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
import Toast from 'react-native-toast-message';

import StackNavigator from './src/navigation/Stack';
import { MeditationBaseMap, MeditationId, MeditationInstance } from './src/types';
import { default as mapping } from './mapping.json'; // <-- Import app mapping
import { default as theme } from './theme.json';
import { getFtuxStateInAsyncStorage } from './src/utils/ftux';
import FtuxContext from './src/contexts/ftuxData';
import UserContext, { initialUserState, User, UserStreaks } from './src/contexts/userData';
import FullUserLoadedContext from './src/contexts/fullUserLoaded';
import MeditationBaseDataContext from './src/contexts/meditationBaseData';
import { makeMeditationBaseData } from './src/utils/meditation';
import MeditationInstanceDataContext from './src/contexts/meditationInstanceData';
import toastConfig from './src/toastConfig';
import { SetupService } from './src/services/setupService';
import _, { isEqual } from 'lodash';
import MeditationHistoryContext from './src/contexts/meditationHistory';
import { fbAddUser, fbGetUser, fbUpdateUser } from './src/fb/user';
import { checkStreakData, getUserStreakData, makeFbStreakUpdate, updateUserStreakData } from './src/utils/streaks';
import { fbGetMeditationHistory } from './src/fb/meditationHistory';

const googleWebClientId = '859830619066-3iasok69fiujoak3vlcrq3lsjevo65rg.apps.googleusercontent.com';

const App = () => {
  const [meditationBaseData, setMeditationBaseData] = useState({} as MeditationBaseMap);
  const [meditationInstanceData, setMeditationInstanceData] = useState({} as MeditationInstance);
  const [meditationHistory, setMeditationHistory] = useState({});
  const [user, setUser] = useState(initialUserState as User);
  const [fullUserLoaded, setFullUserLoaded] = useState(false);
  const [hasSeenFtux, setHasSeenFtux] = useState(false);
  const [initializing, setInitializing] = useState(true);
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
    },
    onboarding: {
      hasSeenAddMeditationOnboarding: false,
      hasSeenHomeOnboarding: false,
      hasSeenInsightsOnboarding: false,
      hasSeenLibraryOnboarding: false,
    },
    meditationUserData: {
      streaks: {
        current: 0,
        longest: 0,
      }
    }
  })

  const onAuthStateChanged = async (firebaseUser: any) => {
    if (firebaseUser && user && user.uid.length <= 0) {
      const userId = firebaseUser.uid;
      const normalizedUser = normalizeFirebaseUser(firebaseUser)
      const userDocument = await fbGetUser(userId);

      if (userDocument && userDocument.exists) {
        const userData = userDocument.data() as User;

        if(userData) {
          const userStreakData = getUserStreakData(userData);
          const meditationHistory = await fbGetMeditationHistory(userId);
          setMeditationHistory({
            meditationInstances: meditationHistory.meditationInstances,
            lastDocument: meditationHistory.lastDocument,
          })

          if (userStreakData && meditationHistory.meditationInstances.length) {
            const lastMeditation = meditationHistory.meditationInstances[0];
            const streakData = checkStreakData(
              userStreakData,
              lastMeditation,
            )
            if (userStreakData.current === streakData.current) {
              setUser(userData);
              setFullUserLoaded(true);
              if (initializing) setInitializing(false);
            } else {
              const updatedUser = updateUserStreakData(userData, streakData);
              const fbUpdate = makeFbStreakUpdate(streakData);
              setUser(updatedUser)
              await fbUpdateUser(userId, fbUpdate);
              if (initializing) setInitializing(false);
            }
          } else {
            setUser(userData);
            setFullUserLoaded(true);
            if (initializing) setInitializing(false);
          }
        }
      } else {
        const userAdded = await fbAddUser(
          userId,
          normalizedUser,
        );

        if (userAdded) {
          setUser(normalizedUser);
          setFullUserLoaded(true);
          if (initializing) setInitializing(false);
        }
      }
    } else {
      if (initializing) setInitializing(false);
    }
  }

  useEffect(() => {
    let unmounted = false;

    GoogleSignin.configure({ webClientId: googleWebClientId })
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

    setupPlayerService(unmounted);
    setMeditationBaseDataToContext();
    getFtux();

    return () => {
      unmounted = true;
      subscriber;
    }
  }, [])

  const setupPlayerService = async (unmounted: boolean) => {
    const isSetup = await SetupService();
    if (unmounted) return;
    setIsPlayerReady(isSetup);
  }

  const setMeditationBaseDataToContext = async () => {
    const meditationBaseData = await makeMeditationBaseData();
    if (meditationBaseData) {
      setMeditationBaseData(meditationBaseData);
    }
  }

  const getFtux = async () => {
    try {
      const hasSeenFtux = await getFtuxStateInAsyncStorage();
      if (hasSeenFtux) {
        setHasSeenFtux(hasSeenFtux)
      }
    } catch (e) {
      console.log('Get FTUX error', e);
    }
  }

  if (initializing) {
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
            <MeditationHistoryContext.Provider value={{ meditationHistory, setMeditationHistory}}>
              <MeditationBaseDataContext.Provider value={{ meditationBaseData, setMeditationBaseData }}>
                <MeditationInstanceDataContext.Provider value={{ meditationInstanceData, setMeditationInstanceData }}>
                  <FtuxContext.Provider value={({ hasSeenFtux, setHasSeenFtux })}>
                    <StackNavigator />
                  </FtuxContext.Provider>
                </MeditationInstanceDataContext.Provider>
              </MeditationBaseDataContext.Provider>
            </MeditationHistoryContext.Provider>
          </FullUserLoadedContext.Provider>
        </UserContext.Provider>
      </ApplicationProvider>
      <Toast config={toastConfig as any} />
    </>
  );
};

export default App;
