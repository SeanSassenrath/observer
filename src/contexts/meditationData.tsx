import React, { createContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { PickedFile } from '../types';

interface MeditationDataContext {
  meditationFiles: PickedFile[],
  setMeditationFiles: React.Dispatch<React.SetStateAction<PickedFile[]>>, 
}

const initialMeditationData = {} as MeditationDataContext;

const MeditationDataContext = createContext(initialMeditationData);

const storageKey = '@meditation_data';

export const getMeditationData = async (setMeditationFiles: React.Dispatch<React.SetStateAction<PickedFile[]>>) => {
  try {
    const jsonMeditationFiles = await AsyncStorage.getItem(storageKey)
    const meditationFiles = jsonMeditationFiles != null ? JSON.parse(jsonMeditationFiles) : null as PickedFile[] | null;
    console.log('Async meditation data value', meditationFiles);
    setMeditationFiles(meditationFiles)
  } catch (e) {
    console.log('error with setting meditation files', e);
  }
}

export default MeditationDataContext;
