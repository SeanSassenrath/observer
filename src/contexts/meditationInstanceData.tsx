import React, { createContext } from 'react';

import { MeditationInstance } from '../types';

interface MeditationInstanceContext {
  meditationInstanceData: MeditationInstance,
  setMeditationInstanceData: React.Dispatch<React.SetStateAction<MeditationInstance>>,
}

const meditationInstanceData = {} as MeditationInstanceContext;

const MeditationInstanceDataContext = createContext(meditationInstanceData);

export default MeditationInstanceDataContext;
