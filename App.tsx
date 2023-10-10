/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState, useEffect} from 'react';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';

import StackNavigator from './src/navigation/Stack';
import {
  MeditationBaseMap,
  MeditationFilePath,
  MeditationInstance,
  UnsupportedFileData,
} from './src/types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {default as mapping} from './mapping.json'; // <-- Import app mapping
import {default as theme} from './theme.json';
import UserContext, {initialUserState, User} from './src/contexts/userData';
import MeditationBaseDataContext from './src/contexts/meditationBaseData';
import {
  makeMeditationBaseData,
  updateAsyncStorageMeditationData as _updateAsyncStorageMeditationData,
} from './src/utils/meditation';
import MeditationInstanceDataContext from './src/contexts/meditationInstanceData';
import toastConfig from './src/toastConfig';
import {SetupService} from './src/services/setupService';
import MeditationHistoryContext from './src/contexts/meditationHistory';
import {fbAddUser, fbGetUser, fbUpdateUser} from './src/fb/user';
import {
  checkStreakData,
  getUserStreakData,
  makeFbStreakUpdate,
  updateUserStreakData,
} from './src/utils/streaks';
import {fbGetMeditationHistory} from './src/fb/meditationHistory';
import {Action, appInitializationSendEvent, Noun} from './src/analytics';
import MeditationFilePathsContext from './src/contexts/meditationFilePaths';
import {getMeditationFilePathDataInAsyncStorage} from './src/utils/asyncStorageMeditation';
import Splash from './src/screens/Splash';
import UnsupportedFilesContext from './src/contexts/unsupportedFiles';

const googleWebClientId =
  '859830619066-3iasok69fiujoak3vlcrq3lsjevo65rg.apps.googleusercontent.com';

const EMPTY_STRING = '';

const App = () => {
  const [meditationBaseData, setMeditationBaseData] = useState(
    {} as MeditationBaseMap,
  );
  const [meditationInstanceData, setMeditationInstanceData] = useState(
    {} as MeditationInstance,
  );
  const [meditationHistory, setMeditationHistory] = useState({});
  const [meditationFilePaths, setMeditationFilePaths] = useState(
    {} as MeditationFilePath,
  );
  const [user, setUser] = useState(initialUserState as User);
  const [initializing, setInitializing] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);
  const [unsupportedFiles, setUnsupportedFiles] = useState(
    [] as UnsupportedFileData[],
  );

  const getFirstName = (firebaseUser: any) => {
    if (firebaseUser.displayName) {
      return firebaseUser.displayName.split(' ')[0];
    } else if (firebaseUser.firstName) {
      return firebaseUser.firstName;
    }
  };

  const getLastName = (firebaseUser: any) => {
    if (firebaseUser.displayName) {
      return firebaseUser.displayName.split(' ')[1];
    } else if (firebaseUser.lastName) {
      return firebaseUser.lastName;
    }
  };

  const getPhotoUrl = (firebaseUser: any) => {
    if (firebaseUser.providerData && firebaseUser.providerData[0]) {
      return firebaseUser.providerData[0].photoURL;
    }
  };

  const normalizeFirebaseUser = (firebaseUser: any): User => ({
    uid: firebaseUser.uid,
    hasBetaAccess: false,
    profile: {
      displayName: firebaseUser.displayName || EMPTY_STRING,
      email: firebaseUser.email || EMPTY_STRING,
      firstName: getFirstName(firebaseUser) || EMPTY_STRING,
      lastName: getLastName(firebaseUser) || EMPTY_STRING,
      creationTime: firebaseUser.metadata.creationTime,
      lastSignInTime: firebaseUser.metadata.lastSignInTime,
      photoURL: getPhotoUrl(firebaseUser) || EMPTY_STRING,
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
      },
      totalMeditationTime: 0,
    },
  });

  const onAuthStateChanged = async (firebaseUser: any) => {
    try {
      if (firebaseUser && user && user.uid.length <= 0) {
        const userId = firebaseUser.uid;
        const userDocument = await fbGetUser(userId);

        if (userDocument && userDocument.exists) {
          const userData = userDocument.data() as User;

          if (userData) {
            const userStreakData = getUserStreakData(userData);
            const _meditationHistory = await fbGetMeditationHistory(userId);
            setMeditationHistory({
              meditationInstances: _meditationHistory.meditationInstances,
              lastDocument: _meditationHistory.lastDocument,
            });

            if (
              userStreakData &&
              _meditationHistory.meditationInstances.length
            ) {
              const lastMeditation = _meditationHistory.meditationInstances[0];
              const streakData = checkStreakData(
                userStreakData,
                lastMeditation,
              );
              if (userStreakData.current === streakData.current) {
                setUser(userData);
                if (initializing) {
                  setInitializing(false);
                }
              } else {
                const updatedUser = updateUserStreakData(userData, streakData);
                const fbUpdate = makeFbStreakUpdate(streakData);
                setUser(updatedUser);
                await fbUpdateUser(userId, fbUpdate);
                if (initializing) {
                  setInitializing(false);
                }
              }
            } else {
              setUser(userData);
              if (initializing) {
                setInitializing(false);
              }
            }
          }
        } else {
          const normalizedUser = normalizeFirebaseUser(firebaseUser);

          const userAdded = await fbAddUser(userId, normalizedUser);

          if (userAdded) {
            setUser(normalizedUser);
            if (initializing) {
              setInitializing(false);
            }
          }
        }
      } else {
        if (initializing) {
          setInitializing(false);
        }
      }
    } catch (e) {
      appInitializationSendEvent(Action.FAIL, Noun.ON_MOUNT);
      setInitializing(false);
    }
  };

  useEffect(() => {
    let unmounted = false;

    GoogleSignin.configure({webClientId: googleWebClientId});
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

    setupPlayerService(unmounted);
    updateAsyncStorageMeditationData();
    setMeditationBaseDataToContext();
    setMeditationFilePathsFromContext();

    return () => {
      unmounted = true;
      subscriber;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setupPlayerService = async (unmounted: boolean) => {
    const isSetup = await SetupService();
    if (unmounted) {
      return;
    }
    setIsPlayerReady(isSetup);
  };

  const updateAsyncStorageMeditationData = async () => {
    await _updateAsyncStorageMeditationData();
  };

  const setMeditationBaseDataToContext = async () => {
    const _meditationBaseData = await makeMeditationBaseData();
    if (_meditationBaseData) {
      setMeditationBaseData(_meditationBaseData);
    }
  };

  const setMeditationFilePathsFromContext = async () => {
    const meditationFilePathsJSON =
      await getMeditationFilePathDataInAsyncStorage();
    if (meditationFilePathsJSON) {
      const _meditationFilePaths = JSON.parse(meditationFilePathsJSON);
      setMeditationFilePaths(_meditationFilePaths);
    }
  };

  if (initializing) {
    return <Splash />;
  }

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider
        {...eva}
        theme={{...eva.dark, ...theme}}
        // @ts-ignore
        // customMapping={mapping}
      >
        <UserContext.Provider value={{user, setUser}}>
          <MeditationHistoryContext.Provider
            value={{meditationHistory, setMeditationHistory}}>
            <MeditationBaseDataContext.Provider
              value={{meditationBaseData, setMeditationBaseData}}>
              <MeditationInstanceDataContext.Provider
                value={{meditationInstanceData, setMeditationInstanceData}}>
                <MeditationFilePathsContext.Provider
                  value={{meditationFilePaths, setMeditationFilePaths}}>
                  <UnsupportedFilesContext.Provider
                    value={{unsupportedFiles, setUnsupportedFiles}}>
                    <StackNavigator />
                  </UnsupportedFilesContext.Provider>
                </MeditationFilePathsContext.Provider>
              </MeditationInstanceDataContext.Provider>
            </MeditationBaseDataContext.Provider>
          </MeditationHistoryContext.Provider>
        </UserContext.Provider>
      </ApplicationProvider>
      <Toast config={toastConfig as any} />
    </>
  );
};

export default App;
