import {sortBy, takeRight, values} from 'lodash';
import {MeditationCountsMap} from '../../contexts/userData';
import {MeditationHistoryData} from '../../contexts/meditationHistory';
import {MeditationBaseId} from '../../types';
import {getFullMeditationCatalogSync} from '../../services/meditationCatalog';

export const getMeditationFromId = (meditationBaseId: MeditationBaseId) =>
  getFullMeditationCatalogSync()[meditationBaseId];

export const getLastMeditationInstance = (
  meditationHistory: MeditationHistoryData,
) =>
  meditationHistory &&
  meditationHistory.meditationInstances &&
  meditationHistory.meditationInstances[0];

export const getTopFiveMeditationIds = (
  meditationInstanceCounts: MeditationCountsMap,
) => {
  const meditationCountsList = values(meditationInstanceCounts);
  const sortedMeditationCountsList = sortBy(meditationCountsList, 'count');
  const lastFiveMeditationCounts = takeRight(sortedMeditationCountsList, 5);
  const meditationCountListIds = lastFiveMeditationCounts.map(med => med.id);
  return meditationCountListIds.reverse();
};

export const isBreathwork = (medKey: string) => {
  const breathPrefix = 'b-';

  return medKey.startsWith(breathPrefix);
};

export const isBreathworkAvailable = (medKeys: string[]) => {
  return medKeys.some(isBreathwork);
};
