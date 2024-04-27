import React, {useContext} from 'react';

import {
  getTotalMeditationCount,
  getTotalMeditationTime,
} from '../../utils/profile';
import {TotalOverviewComponent} from './component';
import UserContext from '../../contexts/userData';

export const TotalOverview = () => {
  const {user} = useContext(UserContext);

  const totalMeditationCount = getTotalMeditationCount(user);
  const totalMeditationTime = getTotalMeditationTime(user);

  return (
    <TotalOverviewComponent
      totalMedCount={totalMeditationCount}
      totalTimeCount={totalMeditationTime}
    />
  );
};
