import React, {createContext} from 'react';

import {MeditationFilePath} from '../types';

interface MeditationFilePathsContext {
  meditationFilePaths: MeditationFilePath;
  setMeditationFilePaths: React.Dispatch<
    React.SetStateAction<MeditationFilePath>
  >;
}

const meditationFilePaths = {} as MeditationFilePathsContext;

const MeditationFilePathsContext = createContext(meditationFilePaths);

export default MeditationFilePathsContext;
