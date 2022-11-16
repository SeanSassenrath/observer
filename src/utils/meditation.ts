import { MeditationGroupKey, meditationMap } from "../constants/meditation";
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