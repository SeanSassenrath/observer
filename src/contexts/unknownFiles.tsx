import React, {createContext} from 'react';

import {UnknownFileData} from '../types';

interface UnknownFilesContext {
  unknownFiles: UnknownFileData[];
  setUnknownFiles: React.Dispatch<React.SetStateAction<UnknownFileData[]>>;
}

const unknownFiles = {} as UnknownFilesContext;

const UnknownFilesContext = createContext(unknownFiles);

export default UnknownFilesContext;
