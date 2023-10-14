import {DateTime} from 'luxon';
import {initialUserState} from '../contexts/userData';
import {MeditationInstance, MeditationTypes} from '../types';

import {checkStreakData, makeUpdatedStreakData} from './streaks';

const mockMeditationInstance = {
  meditationBaseId: '',
  name: '',
  type: MeditationTypes.Meditation,
};

describe('Initial Current Streak State', () => {
  test("It should not reset if the user's last meditation was started yesterday", () => {
    const currentStreak = 1;
    const longestStreak = 3;
    const dt = DateTime.now();
    const yesterdayInSeconds = dt.minus({days: 1}).toSeconds();
    const lastMeditation: MeditationInstance = {
      ...mockMeditationInstance,
      meditationStartTime: yesterdayInSeconds,
    };

    const originalStreakValues = {
      current: currentStreak,
      longest: longestStreak,
    };

    const updatedStreakValues = checkStreakData(
      originalStreakValues,
      lastMeditation,
    );

    expect(updatedStreakValues).toEqual(originalStreakValues);
  });

  test("It should not reset if the user's last meditation was started today", () => {
    const currentStreak = 1;
    const longestStreak = 3;
    const dt = DateTime.now();
    const todayInSeconds = dt.toSeconds();
    const lastMeditation: MeditationInstance = {
      ...mockMeditationInstance,
      meditationStartTime: todayInSeconds,
    };

    const originalStreakValues = {
      current: currentStreak,
      longest: longestStreak,
    };

    const updatedStreakValues = checkStreakData(
      originalStreakValues,
      lastMeditation,
    );

    expect(updatedStreakValues).toEqual(originalStreakValues);
  });

  test("It should reset the streak count if the user's last meditation was started over a day ago", () => {
    const currentStreak = 1;
    const longestStreak = 3;
    const dt = DateTime.now();
    const twoDaysAgoInSeconds = dt.minus({days: 2}).toSeconds();
    const lastMeditation: MeditationInstance = {
      ...mockMeditationInstance,
      meditationStartTime: twoDaysAgoInSeconds,
    };

    const originalStreakValues = {
      current: currentStreak,
      longest: longestStreak,
    };

    const updatedStreakValues = checkStreakData(
      originalStreakValues,
      lastMeditation,
    );

    expect(updatedStreakValues).not.toEqual(originalStreakValues);
  });
});

describe('Post Medtiation Updated Streak State', () => {
  test('It should not increase streak count if the last meditation was completed today', () => {
    const currentStreak = 1;
    const longestStreak = 3;
    const dt = DateTime.now();
    const todayInSeconds = dt.toSeconds();
    const lastMeditation: MeditationInstance = {
      ...mockMeditationInstance,
      meditationStartTime: todayInSeconds,
    };

    const expectedStreakValues = {
      current: currentStreak,
      longest: longestStreak,
      newLongestStreak: false,
      streakUpdated: false,
    };

    const user = {
      ...initialUserState,
      meditationUserData: {
        streaks: {
          current: currentStreak,
          longest: longestStreak,
        },
      },
    };

    const updatedStreakValues = makeUpdatedStreakData(user, lastMeditation);

    expect(updatedStreakValues).toEqual(expectedStreakValues);
  });

  test('It should increase streak count if the last meditation was completed yesterday', () => {
    const currentStreak = 1;
    const longestStreak = 3;
    const dt = DateTime.now();
    const yesterdayInSeconds = dt.minus({days: 1}).toSeconds();
    const lastMeditation: MeditationInstance = {
      ...mockMeditationInstance,
      meditationStartTime: yesterdayInSeconds,
    };

    const expectedStreakValues = {
      current: currentStreak + 1,
      longest: longestStreak,
      newLongestStreak: false,
      streakUpdated: true,
    };

    const user = {
      ...initialUserState,
      meditationUserData: {
        streaks: {
          current: currentStreak,
          longest: longestStreak,
        },
      },
    };

    const updatedStreakValues = makeUpdatedStreakData(user, lastMeditation);

    expect(updatedStreakValues).toEqual(expectedStreakValues);
  });

  test('It should increase longest and current streak count if the last meditation was completed yesterday', () => {
    const currentStreak = 3;
    const longestStreak = 3;
    const dt = DateTime.now();
    const yesterdayInSeconds = dt.minus({days: 1}).toSeconds();
    const lastMeditation: MeditationInstance = {
      ...mockMeditationInstance,
      meditationStartTime: yesterdayInSeconds,
    };

    const expectedStreakValues = {
      current: currentStreak + 1,
      longest: longestStreak + 1,
      newLongestStreak: true,
      streakUpdated: true,
    };

    const user = {
      ...initialUserState,
      meditationUserData: {
        streaks: {
          current: currentStreak,
          longest: longestStreak,
        },
      },
    };

    const updatedStreakValues = makeUpdatedStreakData(user, lastMeditation);

    expect(updatedStreakValues).toEqual(expectedStreakValues);
  });
});
