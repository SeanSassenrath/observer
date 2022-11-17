import React, { createContext } from 'react';

interface FtuxContext {
  hasSeenFtux: boolean,
  setHasSeenFtux: React.Dispatch<React.SetStateAction<boolean>>,
}

const initialFtuxData = {} as FtuxContext;

export const ftuxStorageKey = '@ftux_seen'

const FtuxContext = createContext(initialFtuxData);

export default FtuxContext;
