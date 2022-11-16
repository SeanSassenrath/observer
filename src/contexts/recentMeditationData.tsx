import React, { createContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { MeditationId } from '../types';

interface RecentMedtationIdsContext {
  recentMeditationIds: MeditationId[],
  setRecentMeditationIds: React.Dispatch<React.SetStateAction<MeditationId[]>>,
}

const initialRecentMeditationIds = {} as RecentMedtationIdsContext;

export const recentMeditationIdsStorageKey = '@recent_meditation_ids';

const RecentMeditationIdsContext = createContext(initialRecentMeditationIds);

export const getRecentMeditationIdsFromAsyncStorage = async (): Promise<MeditationId[] | undefined> => {
  try {
    const recentMeditationIdsData = await AsyncStorage.getItem(recentMeditationIdsStorageKey)
    const recentMeditationIds = recentMeditationIdsData != null
      ? JSON.parse(recentMeditationIdsData)
      : null as MeditationId[] | null;
    console.log('Async recent meditation ids', recentMeditationIds);
    return recentMeditationIds;
  } catch (e) {
    console.log('error with setting recent meditation ids', e);
  }
}

export const removeRecentMeditationIdsFromAsyncStorage = async () => {
  try {
    await AsyncStorage.removeItem(recentMeditationIdsStorageKey)
  } catch (e) {
    console.log('error removing from storage', e)
  }
}


export default RecentMeditationIdsContext;
