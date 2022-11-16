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

import UnlockedMeditationIdsContext from './src/contexts/meditationData';
import RecentMeditationIdsContext from './src/contexts/recentMeditationData';
import StackNavigator from './src/navigation/Stack';
import { MeditationId } from './src/types';

const App = () => {
  const [unlockedMeditationIds, setUnlockedMeditationIds] = useState([] as MeditationId[]);
  const [recentMeditationIds, setRecentMeditationIds] = useState([] as MeditationId[]);

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <UnlockedMeditationIdsContext.Provider value={{ unlockedMeditationIds, setUnlockedMeditationIds }}>
          <RecentMeditationIdsContext.Provider value={({ recentMeditationIds, setRecentMeditationIds })}>
            <StackNavigator />
          </RecentMeditationIdsContext.Provider>
        </UnlockedMeditationIdsContext.Provider>
      </ApplicationProvider>
    </>
  );
};

export default App;
