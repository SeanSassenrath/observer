import React, { createContext } from 'react';

export interface FullUserLoadedContext {
  fullUserLoaded: boolean,
  setFullUserLoaded: React.Dispatch<React.SetStateAction<boolean>>,
}

const initialFullUserLoadedData = {} as FullUserLoadedContext;

const FullUserLoadedContext = createContext(initialFullUserLoadedData);

export default FullUserLoadedContext;
