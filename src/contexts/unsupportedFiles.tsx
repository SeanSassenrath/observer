import React, { createContext } from 'react';

import { UnsupportedFileData } from '../types';

interface UnsupportedFilesContext {
  unsupportedFiles: UnsupportedFileData[],
  setUnsupportedFiles: React.Dispatch<React.SetStateAction<UnsupportedFileData[]>>,
}

const unsupportedFiles = {} as UnsupportedFilesContext;

const UnsupportedFilesContext = createContext(unsupportedFiles);

export default UnsupportedFilesContext;
