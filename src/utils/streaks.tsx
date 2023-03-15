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

const updateStreakData = (
  streakData: UserStreaks,
  lastMeditation?: MeditationInstance,
) => {
  const dt = DateTime.now();
  const today = dt.weekdayShort;
  const yesterday = dt.minus({ days: 1 }).weekdayShort;

  if (lastMeditation && lastMeditation.meditationStartTime) {
    const lastMeditationDt = DateTime.fromSeconds(lastMeditation.meditationStartTime);
    const lastMeditationWeekday = lastMeditationDt.weekdayShort;

    if (
      lastMeditationWeekday === today &&
      streakData.current &&
      streakData.longest
    ) {
      return ({
        current: streakData.current,
        longest: streakData.longest,
        newLongestStreak: false,
      })
    } else if (lastMeditationWeekday === yesterday) {
      const currentStreak = streakData.current || 0;
      const longestStreak = streakData.longest || 0;
      const updatedCurrentStreak = currentStreak + 1;
      let updatedLongestStreak = longestStreak;
      let newLongestStreak = false;

      if (updatedCurrentStreak > longestStreak) {
        updatedLongestStreak = updatedCurrentStreak;
        newLongestStreak = true;
      }

      return ({
        current: updatedCurrentStreak,
        longest: updatedLongestStreak,
        newLongestStreak,
      })
    } else {
      const updatedCurrentStreak = 1;
      const updatedLongestStreak = streakData.longest || 1;
      const newLongestStreak = streakData.longest === 0;

      return ({
        current: updatedCurrentStreak,
        longest: updatedLongestStreak,
        newLongestStreak,
      })
    }
  } else {
    const updatedCurrentStreak = 1;
    const updatedLongestStreak = streakData.longest || 1;
    const newLongestStreak = streakData.longest === 0;

    return ({
      current: updatedCurrentStreak,
      longest: updatedLongestStreak,
      newLongestStreak,
    })
  }
}

export interface UpdatedStreakData {
  current: number,
  longest: number,
  newLongestStreak: boolean,
}

export const makeUpdatedStreakData = (
  user: User,
  lastMeditation?: MeditationInstance
): UpdatedStreakData => {
  const streakData = getUserStreakData(user);
  return updateStreakData(streakData, lastMeditation);
}
