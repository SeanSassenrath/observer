/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {type PropsWithChildren} from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';

import SignIn from './src/screens/SignIn';

const App = () => {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <SignIn />
    </ApplicationProvider>
  );
};

export default App;
