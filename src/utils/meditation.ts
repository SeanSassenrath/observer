import { sortBy, uniq } from "lodash";

import { meditationBaseMap } from "../constants/meditation";
import { MeditationHistoryData } from "../contexts/meditationHistory";
import { User } from "../contexts/userData";
import { Meditation, MeditationBase, MeditationBaseId, MeditationBaseMap, MeditationId, MeditationInstance } from "../types";
import { getMeditationFilePathDataInAsyncStorage } from "./asyncStorageMeditation";
import { UpdatedStreakData } from "./streaks";

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

export type UpdatedRecentUserMeditationData = MeditationBaseId[]

export const makeUpdatedRecentUserMeditationData = (
  user: User,
  meditationInstanceData: MeditationInstance
): UpdatedRecentUserMeditationData => {
  const recentMeditationBaseIds = user
    && user.meditationUserData
    && user.meditationUserData.recentMeditationBaseIds
    && user.meditationUserData.recentMeditationBaseIds.slice(0, 5)
    || [];

  return uniq([
    meditationInstanceData.meditationBaseId, ...recentMeditationBaseIds
  ])
};

export type UpdatedMeditationCountData = number;

export const makeUpdatedMeditationCountData = (
  user: User,
  meditationInstanceData: MeditationInstance
): UpdatedMeditationCountData => {
  const meditationInstanceCount = getMeditationCountFromUserData(user, meditationInstanceData) || 0;
  const updatedMeditationInstanceCount = meditationInstanceCount + 1;

  return updatedMeditationInstanceCount;
};

export interface UpdatedBreathMeditationCountData {
  meditationBaseBreathName: string,
  updatedMeditationBreathCount: number,
}

export const makeUpdatedBreathMeditationCountData = (
  user: User,
  meditationInstanceData: MeditationInstance
): UpdatedBreathMeditationCountData | undefined => {
  const meditationBaseBreathId = meditationInstanceData.meditationBaseBreathId;

  if (!meditationBaseBreathId) { return; }
  const meditationBaseData = meditationBaseMap[meditationBaseBreathId];
  const meditationBreathCount = getMeditationBreathCountFromUserData(user, meditationInstanceData);
  const updatedMeditationBreathCount = meditationBreathCount ? meditationBreathCount + 1 : 1;
  const meditationBaseBreathName = meditationBaseData.name;

  return ({
    meditationBaseBreathName,
    updatedMeditationBreathCount,
  })
};

export const makeUpdatedFbUserMeditationData = (
  updatedMeditationInstanceCount: UpdatedMeditationCountData,
  updatedBreathMeditationCountData: UpdatedBreathMeditationCountData | undefined,
  updatedRecentUserMeditationData: UpdatedRecentUserMeditationData,
  updatedStreaksData: UpdatedStreakData,
  meditationInstanceData: MeditationInstance,
) => {
  const {
    meditationBaseId,
    meditationBaseBreathId,
    name,
  } = meditationInstanceData

  const updatedUserMeditationData = {
    'meditationUserData.recentMeditationBaseIds': updatedRecentUserMeditationData,
    'meditationUserData.streaks.current': updatedStreaksData.current,
    'meditationUserData.streaks.longest': updatedStreaksData.longest,
    [`meditationUserData.meditationCounts.${meditationBaseId}.count`]: updatedMeditationInstanceCount,
    [`meditationUserData.meditationCounts.${meditationBaseId}.name`]: name,
    [`meditationUserData.meditationCounts.${meditationBaseId}.id`]: meditationBaseId,
  }

  if (updatedBreathMeditationCountData) {
    Object.assign(updatedUserMeditationData, {
      [`meditationUserData.meditationCounts.${meditationBaseBreathId}.count`]: updatedBreathMeditationCountData.updatedMeditationBreathCount,
      [`meditationUserData.meditationCounts.${meditationBaseBreathId}.name`]: updatedBreathMeditationCountData.meditationBaseBreathName,
      [`meditationUserData.meditationCounts.${meditationBaseBreathId}.id`]: meditationBaseBreathId,
    })
  }
  
  return updatedUserMeditationData;
}

export const makeUpdatedContextMeditationData = (
  updatedMeditationInstanceCount: UpdatedMeditationCountData,
  updatedBreathMeditationCountData: UpdatedBreathMeditationCountData | undefined,
  updatedRecentUserMeditationData: UpdatedRecentUserMeditationData,
  updatedStreaksData: UpdatedStreakData,
  meditationInstanceData: MeditationInstance,
  user: User,
) => {
  const {
    meditationBaseId,
    meditationBaseBreathId,
    name,
  } = meditationInstanceData

  const meditationCounts = {
    [meditationBaseId]: {
      count: updatedMeditationInstanceCount,
      name: name,
      id: meditationBaseId,
    },
  }

  if (meditationBaseBreathId && updatedBreathMeditationCountData) {
    Object.assign(meditationCounts, {
      [meditationBaseBreathId]: {
        count: updatedBreathMeditationCountData.updatedMeditationBreathCount,
        name: updatedBreathMeditationCountData.meditationBaseBreathName,
        id: meditationBaseBreathId,
      },
    })
  }

  return ({
    ...user,
    meditaitonUserData: {
      ...user.meditationUserData,
      recentMeditationBaseIds: updatedRecentUserMeditationData,
      meditationCounts: meditationCounts,
      streaks: {
        current: updatedStreaksData.current,
        longest: updatedStreaksData.longest,
      }
    }
  })
}

export const getLastMeditationFromMeditationHistory = (meditationHistory: MeditationHistoryData) =>
  meditationHistory &&
  meditationHistory.meditationInstances &&
  meditationHistory.meditationInstances[meditationHistory.meditationInstances.length - 1];

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
