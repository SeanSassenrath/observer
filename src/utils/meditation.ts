import AsyncStorage from "@react-native-async-storage/async-storage";
import { MeditationGroupKey, meditationMap } from "../constants/meditation";
import { recentMeditationIdsStorageKey } from "../contexts/recentMeditationData";
import { Meditation, MeditationId } from "../types";

export const getMeditation = (id: string, meditations: Meditation[]) =>
  meditations.find(meditation => meditation.id === id);

export interface MeditationGroupMap {
  [key: string]: MeditationId[]
}

export const makeMeditationGroups = (meditationIds: MeditationId[]) => {
  const meditationGroupMap: MeditationGroupMap = {};

  meditationIds.forEach(meditationId => {
    const meditation = meditationMap[meditationId];
    if (meditationGroupMap.hasOwnProperty(meditation.groupKey)) {
      meditationGroupMap[meditation.groupKey].push(meditationId)
    } else {
      meditationGroupMap[meditation.groupKey] = [meditationId];
    }
  })

  return meditationGroupMap;
}

export const setRecentMeditationIdsInAsyncStorage = async (
  recentMeditationIds: MeditationId[] = [],
) => {
  console.log('set recent meditation ids in async storage')
  try {
    const stringifiedRecentMeditationids = JSON.stringify(recentMeditationIds);
    if (stringifiedRecentMeditationids !== null && stringifiedRecentMeditationids !== undefined) {
      await AsyncStorage.setItem(recentMeditationIdsStorageKey, stringifiedRecentMeditationids);
    }
  } catch (e) {
    console.log('Error with setting recent meditation ids to Async Storage', e);
  }
}

export const removeRecentMeditationIdsFromAsyncStorage = async () => {
  try {
    await AsyncStorage.removeItem(recentMeditationIdsStorageKey)
  } catch (e) {
    console.log('error removing from storage', e)
  }
}