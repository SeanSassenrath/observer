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

import UnlockedMeditationIdsContext, { getUnlockedMeditationIdsFromAsyncStorage } from './src/contexts/meditationData';
import RecentMeditationIdsContext, { getRecentMeditationIdsFromAsyncStorage } from './src/contexts/recentMeditationData';
import StackNavigator from './src/navigation/Stack';
import { MeditationId } from './src/types';
import { default as theme } from './theme.json';
import { getFtuxStateInAsyncStorage } from './src/utils/ftux';
import FtuxContext from './src/contexts/ftuxData';

const App = () => {
  const [unlockedMeditationIds, setUnlockedMeditationIds] = useState([] as MeditationId[]);
  const [recentMeditationIds, setRecentMeditationIds] = useState([] as MeditationId[]);
  const [hasSeenFtux, setHasSeenFtux] = useState(false);
  const [isReady, setIsReady] = React.useState(false);

  useEffect(() => {
    const syncAsyncUnlockedMeditationStorageToContext = async () => {
      const unlockedMeditationIdsFromStorage = await getUnlockedMeditationIdsFromAsyncStorage();
      if (unlockedMeditationIdsFromStorage) {
        setUnlockedMeditationIds(unlockedMeditationIdsFromStorage);
      }
    }

    const syncAsyncRecentMeditationStorageToContext = async () => {
      const recentMeditationIdsFromStorage = await getRecentMeditationIdsFromAsyncStorage();
      if (recentMeditationIdsFromStorage) {
        setRecentMeditationIds(recentMeditationIdsFromStorage);
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
    syncAsyncRecentMeditationStorageToContext();
    syncAsyncUnlockedMeditationStorageToContext();
  }, [isReady])

  if (!isReady) {
    return null;
  }

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
        <UnlockedMeditationIdsContext.Provider value={{ unlockedMeditationIds, setUnlockedMeditationIds }}>
          <RecentMeditationIdsContext.Provider value={({ recentMeditationIds, setRecentMeditationIds })}>
            <FtuxContext.Provider value={({ hasSeenFtux, setHasSeenFtux })}>
              <StackNavigator />
            </FtuxContext.Provider>
          </RecentMeditationIdsContext.Provider>
        </UnlockedMeditationIdsContext.Provider>
      </ApplicationProvider>
    </>
  );
};

export default App;
