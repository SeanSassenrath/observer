import { sortBy } from "lodash";
import { meditationBaseMap } from "../constants/meditation";
import { User } from "../contexts/userData";
import { Meditation, MeditationBase, MeditationBaseMap, MeditationId, MeditationInstance } from "../types";
import { getMeditationFilePathDataInAsyncStorage } from "./asyncStorageMeditation";

export const getMeditation = (id: string, meditations: Meditation[]) =>
  meditations.find(meditation => meditation.id === id);

export interface MeditationGroupMap {
  [key: string]: MeditationId[]
}

export interface MeditationGroupsMap {
  [key: string]: MeditationBase[]
}

export type MeditationGroupsList = MeditationGroupsMap[];

export const makeMeditationGroups2 = (meditationBaseMap: MeditationBaseMap): MeditationGroupsList => {
  const meditationGroupList = {} as MeditationGroupsMap;

  for (const key in meditationBaseMap) {
    const meditationBase = meditationBaseMap[key];
    const meditationGroupKey = meditationBaseMap[key].groupKey;

    if (meditationGroupList[meditationGroupKey]) {
      meditationGroupList[meditationGroupKey] = [...meditationGroupList[meditationGroupKey], meditationBase]
    } else {
      meditationGroupList[meditationGroupKey] = [meditationBase]
    }
  }

  const sortedMeditationGroups = sortMeditationGroups(meditationGroupList);

  return sortedMeditationGroups;
}

const sortMeditationGroups = (meditationGroupMap: MeditationGroupsMap) => {
  const sortedKeys = Object.keys(meditationGroupMap).sort();
  const sortedGroupByKeyList = sortedKeys.map((key: string) => ({[key]: meditationGroupMap[key]}))

  const sortedGroupMeditationsList = sortedGroupByKeyList.map(
    (group, index) => {
      const key = sortedKeys[index];
      const sortedMeditations = sortBy(group[key], ['name']);

      return ({[key]: sortedMeditations})
    }
  )

  return sortedGroupMeditationsList;
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
    // console.log('APP: parsed file path data from Async Storage', parsedFilePathData);
    const filePathDataKeys = Object.keys(parsedFilePathData);

    filePathDataKeys.forEach(key => {
      const meditationFilePath = parsedFilePathData[key];
      // console.log('APP: meditation file path', meditationFilePath);
      const meditationBase = {
        ...meditationBaseMap[key],
        url: meditationFilePath,
      }
      meditationBaseData = { [key]: meditationBase, ...meditationBaseData }
    })

    // console.log('APP: Setting meditation base data to context', meditationBaseData);

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
