import {uniq} from 'lodash';

import {oldMeditationBaseMap} from '../constants/meditation';
import {getFullMeditationCatalogSync} from '../services/meditationCatalog';
import {MeditationHistoryData} from '../contexts/meditationHistory';
import {User} from '../contexts/userData';
import {
  Meditation,
  MeditationBaseId,
  MeditationBaseMap,
  MeditationId,
  MeditationInstance,
} from '../types';
import {
  MeditationFilePathData,
  getMeditationFilePathDataInAsyncStorage,
  setMeditationFilePathDataInAsyncStorage,
} from './asyncStorageMeditation';
import {UpdatedStreakData} from './streaks';

export const getMeditation = (id: string, meditations: Meditation[]) =>
  meditations.find(meditation => meditation.id === id);

export const checkMeditationBaseId = (meditationBaseId: MeditationBaseId) => {
  const meditationBaseMap = getFullMeditationCatalogSync();
  if (meditationBaseMap.hasOwnProperty(meditationBaseId)) {
    return meditationBaseId;
  } else if (oldMeditationBaseMap.hasOwnProperty(meditationBaseId)) {
    return oldMeditationBaseMap[meditationBaseId].updatedId;
  }
};

export const checkMeditationBaseIds = (
  meditationBaseIds: MeditationBaseId[],
) => {
  const updatedMeditationBaseIds = [] as MeditationBaseId[];

  meditationBaseIds.forEach(id => {
    const checkedMeditationBaseId = checkMeditationBaseId(id);
    if (checkedMeditationBaseId) {
      updatedMeditationBaseIds.push(checkedMeditationBaseId);
    }
  });

  return updatedMeditationBaseIds;
};

export const getRecentMeditationBaseIds = (user: User) => {
  const recentMeditationIds =
    user &&
    user.meditationUserData &&
    user.meditationUserData.recentMeditationBaseIds;

  if (recentMeditationIds) {
    const checkedMeditations = checkMeditationBaseIds(recentMeditationIds);
    return uniq(checkedMeditations);
  } else {
    return [];
  }
};

export const updateAsyncStorageMeditationData = async () => {
  const filePathData = await getMeditationFilePathDataInAsyncStorage();

  if (filePathData) {
    const meditationBaseMap = getFullMeditationCatalogSync();
    const parsedFilePathData = JSON.parse(filePathData);
    const filePathDataKeys = Object.keys(parsedFilePathData);
    const oldMeditationIds = [] as MeditationId[];
    const updatedMeditationData = {} as MeditationFilePathData;

    filePathDataKeys.forEach(key => {
      const meditationFilePath = parsedFilePathData[key];

      if (oldMeditationBaseMap.hasOwnProperty(key)) {
        oldMeditationIds.push(key);
        const oldMeditationData = oldMeditationBaseMap[key];
        const updatedMeditationId = oldMeditationData.updatedId;
        if (updatedMeditationId) {
          updatedMeditationData[updatedMeditationId] = meditationFilePath;
        }
      } else if (meditationBaseMap.hasOwnProperty(key)) {
        updatedMeditationData[key] = meditationFilePath;
      }
    });

    if (oldMeditationIds.length > 0) {
      await setMeditationFilePathDataInAsyncStorage(updatedMeditationData);
    }
  }
};

export const makeMeditationBaseData = async () => {
  const filePathData = await getMeditationFilePathDataInAsyncStorage();

  console.log('File Data Path >>>', filePathData);

  if (filePathData) {
    const meditationBaseMap = getFullMeditationCatalogSync();
    let meditationBaseData = {} as MeditationBaseMap;
    const parsedFilePathData = JSON.parse(filePathData);
    const filePathDataKeys = Object.keys(parsedFilePathData);

    console.log('makeMeditationBaseData - filePathDataKeys:', filePathDataKeys);

    filePathDataKeys.forEach(key => {
      const meditationFilePath = parsedFilePathData[key];
      const meditationBase = {
        ...meditationBaseMap[key],
        url: meditationFilePath,
      };
      meditationBaseData = {[key]: meditationBase, ...meditationBaseData};
    });

    console.log('makeMeditationBaseData - built meditationBaseData keys:', Object.keys(meditationBaseData));
    console.log('makeMeditationBaseData - is array?', Array.isArray(meditationBaseData));

    return meditationBaseData;
  }
};

export type UpdatedRecentUserMeditationData = MeditationBaseId[];

export const makeUpdatedRecentUserMeditationData = (
  user: User,
  meditationInstanceData: MeditationInstance,
): UpdatedRecentUserMeditationData => {
  const recentMeditationBaseIds =
    (user &&
      user.meditationUserData &&
      user.meditationUserData.recentMeditationBaseIds &&
      user.meditationUserData.recentMeditationBaseIds.slice(0, 5)) ||
    [];

  const recentMeditation = meditationInstanceData.meditationBaseId;

  return uniq([recentMeditation, ...recentMeditationBaseIds]);
};

export type UpdatedMeditationCountData = number;

export const makeUpdatedMeditationCountData = (
  user: User,
  meditationInstanceData: MeditationInstance,
): UpdatedMeditationCountData => {
  const meditationInstanceCount =
    getMeditationCountFromUserData(user, meditationInstanceData) || 0;
  const updatedMeditationInstanceCount = meditationInstanceCount + 1;

  return updatedMeditationInstanceCount;
};

export interface UpdatedBreathMeditationCountData {
  meditationBaseBreathName: string;
  updatedMeditationBreathCount: number;
}

export const makeUpdatedBreathMeditationCountData = (
  user: User,
  meditationInstanceData: MeditationInstance,
): UpdatedBreathMeditationCountData | undefined => {
  const meditationBaseBreathId = meditationInstanceData.meditationBaseBreathId;

  if (!meditationBaseBreathId) {
    return;
  }
  const meditationBaseData = getFullMeditationCatalogSync()[meditationBaseBreathId];
  const meditationBreathCount = getMeditationBreathCountFromUserData(
    user,
    meditationInstanceData,
  );
  const updatedMeditationBreathCount = meditationBreathCount
    ? meditationBreathCount + 1
    : 1;
  const meditationBaseBreathName = meditationBaseData.name;

  return {
    meditationBaseBreathName,
    updatedMeditationBreathCount,
  };
};

export const makeUpdatedFbUserMeditationData = (
  updatedMeditationInstanceCount: UpdatedMeditationCountData,
  updatedBreathMeditationCountData:
    | UpdatedBreathMeditationCountData
    | undefined,
  updatedRecentUserMeditationData: UpdatedRecentUserMeditationData,
  updatedStreaksData: UpdatedStreakData,
  meditationInstanceData: MeditationInstance,
  totalMeditationTime: number | undefined,
) => {
  const {meditationBaseId, meditationBaseBreathId, name} =
    meditationInstanceData;

  const updatedUserMeditationData = {
    'meditationUserData.recentMeditationBaseIds':
      updatedRecentUserMeditationData,
    [`meditationUserData.meditationCounts.${meditationBaseId}.count`]:
      updatedMeditationInstanceCount,
    [`meditationUserData.meditationCounts.${meditationBaseId}.name`]: name,
    [`meditationUserData.meditationCounts.${meditationBaseId}.id`]:
      meditationBaseId,
  };

  if (updatedStreaksData.current) {
    Object.assign(updatedUserMeditationData, {
      ['meditationUserData.streaks.current']: updatedStreaksData.current,
    });
  }

  if (updatedStreaksData.longest) {
    Object.assign(updatedUserMeditationData, {
      ['meditationUserData.streaks.longest']: updatedStreaksData.longest,
    });
  }

  if (totalMeditationTime) {
    Object.assign(updatedUserMeditationData, {
      ['meditationUserData.totalMeditationTime']: totalMeditationTime,
    });
  }

  if (updatedBreathMeditationCountData) {
    Object.assign(updatedUserMeditationData, {
      [`meditationUserData.meditationCounts.${meditationBaseBreathId}.count`]:
        updatedBreathMeditationCountData.updatedMeditationBreathCount,
      [`meditationUserData.meditationCounts.${meditationBaseBreathId}.name`]:
        updatedBreathMeditationCountData.meditationBaseBreathName,
      [`meditationUserData.meditationCounts.${meditationBaseBreathId}.id`]:
        meditationBaseBreathId,
    });
  }

  return updatedUserMeditationData;
};

export const makeUpdatedContextMeditationData = (
  updatedMeditationInstanceCount: UpdatedMeditationCountData,
  updatedBreathMeditationCountData:
    | UpdatedBreathMeditationCountData
    | undefined,
  updatedRecentUserMeditationData: UpdatedRecentUserMeditationData,
  updatedStreaksData: UpdatedStreakData,
  meditationInstanceData: MeditationInstance,
  totalMeditationTime: number | undefined,
  user: User,
) => {
  const {meditationBaseId, meditationBaseBreathId, name} =
    meditationInstanceData;

  const meditationCounts = {
    [meditationBaseId]: {
      count: updatedMeditationInstanceCount,
      name: name,
      id: meditationBaseId,
    },
  };

  if (meditationBaseBreathId && updatedBreathMeditationCountData) {
    Object.assign(meditationCounts, {
      [meditationBaseBreathId]: {
        count: updatedBreathMeditationCountData.updatedMeditationBreathCount,
        name: updatedBreathMeditationCountData.meditationBaseBreathName,
        id: meditationBaseBreathId,
      },
    });
  }

  const streaks = {};

  if (updatedStreaksData.current) {
    Object.assign(streaks, {
      ['current']: updatedStreaksData.current,
    });
  }

  if (updatedStreaksData.longest) {
    Object.assign(streaks, {
      ['longest']: updatedStreaksData.longest,
    });
  }

  return {
    ...user,
    meditationUserData: {
      ...user.meditationUserData,
      recentMeditationBaseIds: updatedRecentUserMeditationData,
      meditationCounts: {
        ...user.meditationUserData.meditationCounts,
        ...meditationCounts,
      },
      streaks,
      totalMeditationTime: totalMeditationTime || 0,
    },
  };
};

export const getMeditationCounts = (user: User) =>
  user && user.meditationUserData && user.meditationUserData.meditationCounts;

export const getLastMeditationFromMeditationHistory = (
  meditationHistory: MeditationHistoryData,
) =>
  meditationHistory &&
  meditationHistory.meditationInstances &&
  meditationHistory.meditationInstances[0];

export const getMeditationCountFromUserData = (
  user: User,
  meditationInstanceData: MeditationInstance,
) =>
  user &&
  user.meditationUserData &&
  user.meditationUserData.meditationCounts &&
  user.meditationUserData.meditationCounts[
    meditationInstanceData.meditationBaseId
  ] &&
  user.meditationUserData.meditationCounts[
    meditationInstanceData.meditationBaseId
  ].count;

export const getMeditationBreathCountFromUserData = (
  user: User,
  meditationInstanceData: MeditationInstance,
) =>
  meditationInstanceData.meditationBaseBreathId &&
  user &&
  user.meditationUserData &&
  user.meditationUserData.meditationCounts &&
  user.meditationUserData.meditationCounts[
    meditationInstanceData.meditationBaseBreathId
  ] &&
  user.meditationUserData.meditationCounts[
    meditationInstanceData.meditationBaseBreathId
  ].count;

export const makeTotalMeditationTime = (
  user: User,
  meditationInstanceData: MeditationInstance,
) => {
  const previousTotalMeditationTime =
    user &&
    user.meditationUserData &&
    user.meditationUserData.totalMeditationTime;

  const {timeMeditated} = meditationInstanceData;

  if (previousTotalMeditationTime !== undefined && timeMeditated) {
    return previousTotalMeditationTime + timeMeditated;
  }
};

export const hasMaxMeditationCount = (meds: MeditationBaseMap) => {
  const keys = Object.keys(meds);

  return !!(keys && keys.length === 2);
};
