import AsyncStorage from "@react-native-async-storage/async-storage";
import { recentMeditationIdsStorageKey } from "../contexts/recentMeditationData";
import { Meditation, MeditationBaseMap, MeditationId } from "../types";

export const getMeditation = (id: string, meditations: Meditation[]) =>
  meditations.find(meditation => meditation.id === id);

export interface MeditationGroupMap {
  [key: string]: MeditationId[]
}

export const makeMeditationGroups = (meditationBaseMap: MeditationBaseMap) => {
  const meditationGroupMap: MeditationGroupMap = {};
  const meditationBaseIds = Object.keys(meditationBaseMap);

  meditationBaseIds.forEach(meditationBaseId => {
    const meditationBase = meditationBaseMap[meditationBaseId];
    if (meditationGroupMap.hasOwnProperty(meditationBase.groupKey)) {
      meditationGroupMap[meditationBase.groupKey].push(meditationBaseId)
    } else {
      meditationGroupMap[meditationBase.groupKey] = [meditationBaseId];
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