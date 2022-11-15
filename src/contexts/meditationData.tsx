import React, { createContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Meditation } from '../types';

interface MeditationDataContext {
  meditations: Meditation[],
  setMeditations: React.Dispatch<React.SetStateAction<Meditation[]>>, 
}

const initialMeditationData = {} as MeditationDataContext;

export const storageKey = '@unlocked_meditation_ids';

const MeditationDataContext = createContext(initialMeditationData);

export const getMeditationDataFromAsyncStorage = async () => {
  try {
    const jsonMeditationFiles = await AsyncStorage.getItem(storageKey)
    const accessKeys = jsonMeditationFiles != null ? JSON.parse(jsonMeditationFiles) : null as Meditation[] | null;
    console.log('Async meditation data value', meditationFiles);
    return meditationFiles;
    // setMeditationFiles(meditationFiles)
  } catch (e) {
    console.log('error with setting meditation files', e);
  }
}

export default MeditationDataContext;
