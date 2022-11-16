import React, { createContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Meditation, MeditationId } from '../types';

interface UnlockedMeditationIdsContext {
  unlockedMeditationIds: MeditationId[],
  setUnlockedMeditationIds: React.Dispatch<React.SetStateAction<MeditationId[]>>, 
}

const initialMeditationData = {} as UnlockedMeditationIdsContext;

export const storageKey = '@unlocked_meditation_ids';

const UnlockedMeditationIdsContext = createContext(initialMeditationData);

export const getUnlockedMeditationIdsFromAsyncStorage = async () => {
  try {
    const unlockedMeditationIdsData = await AsyncStorage.getItem(storageKey)
    const unlockedMeditationIds = unlockedMeditationIdsData != null
      ? JSON.parse(unlockedMeditationIdsData)
      : null as MeditationId[] | null;
    console.log('Async meditation data value', unlockedMeditationIds);
    return unlockedMeditationIds;
  } catch (e) {
    console.log('error with setting meditation files', e);
  }
}

export default UnlockedMeditationIdsContext;
