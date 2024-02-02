import React, {createContext} from 'react';

import {MeditationInstance} from '../types';

interface MeditationInstanceContext {
  meditationInstanceData: MeditationInstance;
  setMeditationInstanceData: React.Dispatch<
    React.SetStateAction<MeditationInstance>
  >;
}

export const meditationInstanceContext = {} as MeditationInstanceContext;

const MeditationInstanceDataContext = createContext(meditationInstanceContext);

export default MeditationInstanceDataContext;
