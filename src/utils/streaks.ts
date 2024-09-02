import {DateTime} from 'luxon';

import {User, UserStreaks} from '../contexts/userData';
import {MeditationInstance} from '../types';

export const getUserStreakData = (user: User) => {
  return user.meditationUserData?.streaks;
};

export const updateUserStreakData = (
  user: User,
  streakData: UserStreaks,
): User => ({
  ...user,
  meditationUserData: {
    ...user.meditationUserData,
    streaks: {
      ...streakData,
    },
  },
});

export const makeFbStreakUpdate = (streakData: UserStreaks) => {
  return {
    ['meditationUserData.streaks']: {
      ...streakData,
    },
  };
};

export const checkStreakData = (
  streakData: UserStreaks,
  lastMeditation: MeditationInstance,
): UserStreaks => {
  const dt = DateTime.now();
  const currentDay = dt.day;
  const currentMonth = dt.month;
  const currentYear = dt.year;

  const yesterdayDay = dt.minus({days: 1}).day;
  const yesterdayMonth = dt.minus({days: 1}).month;
  const yesterdayYear = dt.minus({days: 1}).year;


  if (lastMeditation && lastMeditation.meditationStartTime) {
    const lastMeditationDt = DateTime.fromSeconds(
      lastMeditation.meditationStartTime,
    );
    const lastMeditationDay = lastMeditationDt.day;
    const lastMeditationMonth = lastMeditationDt.month;
    const lastMeditationYear = lastMeditationDt.year;

    if (
      lastMeditationDay === currentDay && lastMeditationMonth === currentMonth && lastMeditationYear === currentYear ||
      lastMeditationDay === yesterdayDay && lastMeditationMonth === yesterdayMonth && lastMeditationYear === yesterdayYear
    ) {
      return streakData;
    } else {
      return {
        ...streakData,
        current: 0,
      };
    }
  }

  return streakData;
};

const updateStreakData = (
  streakData: UserStreaks,
  lastMeditation?: MeditationInstance,
) => {
  const dt = DateTime.now();
  const currentDay = dt.day;
  const currentMonth = dt.month;
  const currentYear = dt.year;

  const yesterdayDay = dt.minus({days: 1}).day;
  const yesterdayMonth = dt.minus({days: 1}).month;
  const yesterdayYear = dt.minus({days: 1}).year;

  if (lastMeditation && lastMeditation.meditationStartTime) {
    const lastMeditationDt = DateTime.fromSeconds(
      lastMeditation.meditationStartTime,
    );
    const lastMeditationDay = lastMeditationDt.day;
    const lastMeditationMonth = lastMeditationDt.month;
    const lastMeditationYear = lastMeditationDt.year;

    if (
      lastMeditationDay === currentDay &&
      lastMeditationMonth === currentMonth &&
      lastMeditationYear === currentYear &&
      streakData.current &&
      streakData.longest
    ) {
      return {
        current: streakData.current,
        longest: streakData.longest,
        newLongestStreak: false,
        streakUpdated: false,
      };
    } else if (
      lastMeditationDay === yesterdayDay &&
      lastMeditationMonth === yesterdayMonth &&
      lastMeditationYear === yesterdayYear
    ) {
      const currentStreak = streakData.current || 0;
      const longestStreak = streakData.longest || 0;
      const updatedCurrentStreak = currentStreak + 1;
      let updatedLongestStreak = longestStreak;
      let newLongestStreak = false;

      if (updatedCurrentStreak > longestStreak) {
        updatedLongestStreak = updatedCurrentStreak;
        newLongestStreak = true;
      }
      return {
        current: updatedCurrentStreak,
        longest: updatedLongestStreak,
        newLongestStreak,
        streakUpdated: true,
      };
    } else {
      const updatedCurrentStreak = 1;
      const updatedLongestStreak = streakData.longest || 1;
      const newLongestStreak = streakData.longest === 0;

      return {
        current: updatedCurrentStreak,
        longest: updatedLongestStreak,
        newLongestStreak,
        streakUpdated: true,
      };
    }
  } else {
    const updatedCurrentStreak = 1;
    const updatedLongestStreak = streakData.longest || 1;

    return {
      current: updatedCurrentStreak,
      longest: updatedLongestStreak,
      newLongestStreak: true,
      streakUpdated: true,
    };
  }
};

export interface UpdatedStreakData {
  current: number;
  longest: number;
  newLongestStreak: boolean;
  streakUpdated: boolean;
}

export const makeUpdatedStreakData = (
  user: User,
  lastMeditation?: MeditationInstance,
): UpdatedStreakData => {
  const streakData = getUserStreakData(user);
  return updateStreakData(streakData, lastMeditation);
};
