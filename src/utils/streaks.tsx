import { set } from 'lodash';
import { DateTime } from 'luxon';

import { User, UserStreaks } from "../contexts/userData";
import { MeditationInstance } from "../types";

export const getUserStreakData = (user: User) =>
  user.meditationUserData?.streaks;

export const updateUserStreakData = (
  user: User,
  streakData: UserStreaks,
): User => ({
  ...user,
  meditationUserData: {
    ...user.meditationUserData,
    streaks: {
      ...streakData
    }
  }
})

export const makeFbStreakUpdate = (streakData: UserStreaks) => {
  return ({
    ['meditationUserData.streaks']: {
      ...streakData,
    }
  })
}

export const checkStreakData = (
  streakData: UserStreaks,
  lastMeditation: MeditationInstance,
): UserStreaks => {
  const dt = DateTime.now();
  const today = dt.weekdayShort;
  const yesterday = dt.minus({ days: 1 }).weekdayShort;

  if (lastMeditation && lastMeditation.meditationStartTime) {
    const lastMeditationDt = DateTime.fromSeconds(lastMeditation.meditationStartTime);
    const lastMeditationWeekday = lastMeditationDt.weekdayShort;

    if (
      lastMeditationWeekday === today ||
      lastMeditationWeekday === yesterday
    ) {
      return streakData;
    } else {
      return {
        ...streakData,
        current: 0,
      }
    }
  }

  return streakData;
}