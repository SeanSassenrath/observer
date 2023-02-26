import { meditationBaseMap } from "../constants/meditation";
import { User } from "../contexts/userData";
import { Meditation, MeditationBaseMap, MeditationId, MeditationInstance } from "../types";
import { getMeditationFilePathDataInAsyncStorage } from "./asyncStorageMeditation";

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

export const makeMeditationBaseData = async () => {
  const filePathData = await getMeditationFilePathDataInAsyncStorage()

  if (filePathData) {
    let meditationBaseData = {} as MeditationBaseMap;
    const parsedFilePathData = JSON.parse(filePathData);
    console.log('APP: parsed file path data from Async Storage', parsedFilePathData);
    const filePathDataKeys = Object.keys(parsedFilePathData);

    filePathDataKeys.forEach(key => {
      const meditationFilePath = parsedFilePathData[key];
      console.log('APP: meditation file path', meditationFilePath);
      const meditationBase = {
        ...meditationBaseMap[key],
        url: meditationFilePath,
      }
      meditationBaseData = { [key]: meditationBase, ...meditationBaseData }
    })

    console.log('APP: Setting meditation base data to context', meditationBaseData);

    return meditationBaseData;
  }
}

export const getMeditationCountFromUserData = (user: User, meditationInstanceData: MeditationInstance) =>
    user && user.meditationUserData
    && user.meditationUserData.meditationCounts
    && user.meditationUserData.meditationCounts[meditationInstanceData.meditationBaseId]
    && user.meditationUserData.meditationCounts[meditationInstanceData.meditationBaseId].count;

export const getMeditationBreathCountFromUserData = (user: User, meditationInstanceData: MeditationInstance) =>
  meditationInstanceData.meditationBaseBreathId
  && user 
  && user.meditationUserData
  && user.meditationUserData.meditationCounts
  && user.meditationUserData.meditationCounts[meditationInstanceData.meditationBaseBreathId]
  && user.meditationUserData.meditationCounts[meditationInstanceData.meditationBaseBreathId].count;
