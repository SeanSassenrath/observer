import React, {createContext} from 'react';

import {MeditationBaseMap} from '../types';

interface MeditationBaseDataContext {
  meditationBaseData: MeditationBaseMap;
  setMeditationBaseData: React.Dispatch<
    React.SetStateAction<MeditationBaseMap>
  >;
}

const meditationBaseData = {} as MeditationBaseDataContext;

const MeditationBaseDataContext = createContext(meditationBaseData);

export default MeditationBaseDataContext;
