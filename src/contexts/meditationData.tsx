import React, { createContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Meditation } from '../types';

interface MeditationDataContext {
  meditations: Meditation[],
  setMeditations: React.Dispatch<React.SetStateAction<Meditation[]>>, 
}

const initialMeditationData = {} as MeditationDataContext;

const MeditationDataContext = createContext(initialMeditationData);

const storageKey = '@meditation_data';

export const getMeditationData = async (setMeditationFiles: React.Dispatch<React.SetStateAction<Meditation[]>>) => {
  try {
    const jsonMeditationFiles = await AsyncStorage.getItem(storageKey)
    const meditationFiles = jsonMeditationFiles != null ? JSON.parse(jsonMeditationFiles) : null as Meditation[] | null;
    console.log('Async meditation data value', meditationFiles);
    setMeditationFiles(meditationFiles)
  } catch (e) {
    console.log('error with setting meditation files', e);
  }
}

export default MeditationDataContext;
