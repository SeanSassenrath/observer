import {sortBy, takeRight, values} from 'lodash';
import {MeditationCountsMap} from '../../contexts/userData';

export const getTopFiveMeditationIds = (
  meditationInstanceCounts: MeditationCountsMap,
) => {
  const meditationCountsList = values(meditationInstanceCounts);
  const sortedMeditationCountsList = sortBy(meditationCountsList, 'count');
  const lastFiveMeditationCounts = takeRight(sortedMeditationCountsList, 5);
  const meditationCountListIds = lastFiveMeditationCounts.map(med => med.id);
  return meditationCountListIds.reverse();
};
