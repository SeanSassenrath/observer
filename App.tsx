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

import AppNavigator from './src/navigation/App';
import MeditationDataContext from './src/contexts/meditationData';
import { Meditation } from './src/types';

const App = () => {
  const [meditations, setMeditations] = useState([] as Meditation[]);

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <MeditationDataContext.Provider value={{meditations, setMeditations}}>
          <AppNavigator />
        </MeditationDataContext.Provider>
      </ApplicationProvider>
    </>
  );
};

export default App;
