/**
 * Additional streak tests covering edge cases not in the existing test file.
 * Existing tests are in src/utils/streaks.test.ts
 */

import {DateTime} from 'luxon';
import {initialUserState, User} from '../src/contexts/userData';
import {MeditationInstance, MeditationTypes} from '../src/types';

import {
  checkStreakData,
  makeUpdatedStreakData,
  getUserStreakData,
  updateUserStreakData,
  makeFbStreakUpdate,
} from '../src/utils/streaks';

const mockMeditationInstance: MeditationInstance = {
  meditationBaseId: 'm-test',
  name: 'Test Meditation',
  type: MeditationTypes.Meditation,
};

const makeUser = (streaks: {current?: number; longest?: number}): User => ({
  ...initialUserState,
  meditationUserData: {
    ...initialUserState.meditationUserData,
    streaks,
  },
});

describe('getUserStreakData', () => {
  it('returns streak data from user object', () => {
    const user = makeUser({current: 3, longest: 7});
    expect(getUserStreakData(user)).toEqual({current: 3, longest: 7});
  });

  it('returns undefined when no meditationUserData', () => {
    const user = {...initialUserState, meditationUserData: undefined} as any;
    expect(getUserStreakData(user)).toBeUndefined();
  });
});

describe('updateUserStreakData', () => {
  it('returns updated user with new streak data', () => {
    const user = makeUser({current: 1, longest: 5});
    const updated = updateUserStreakData(user, {current: 2, longest: 5});

    expect(updated.meditationUserData.streaks).toEqual({
      current: 2,
      longest: 5,
    });
    // Original user profile should be preserved
    expect(updated.uid).toBe(user.uid);
  });
});

describe('makeFbStreakUpdate', () => {
  it('returns Firestore dot-notation update object', () => {
    const result = makeFbStreakUpdate({current: 5, longest: 10});
    expect(result).toEqual({
      'meditationUserData.streaks': {current: 5, longest: 10},
    });
  });
});

describe('makeUpdatedStreakData - edge cases', () => {
  it('first meditation ever (no last meditation) creates streak of 1', () => {
    const user = makeUser({current: 0, longest: 0});
    const result = makeUpdatedStreakData(user);

    expect(result.current).toBe(1);
    expect(result.longest).toBe(1);
    expect(result.streakUpdated).toBe(true);
    expect(result.newLongestStreak).toBe(true);
  });

  it('first meditation with no previous streaks at all', () => {
    const user = makeUser({});
    const result = makeUpdatedStreakData(user);

    expect(result.current).toBe(1);
    expect(result.longest).toBe(1);
    expect(result.streakUpdated).toBe(true);
  });

  it('gap of 2+ days resets current to 1 but preserves longest', () => {
    const user = makeUser({current: 5, longest: 10});
    const threeDaysAgo = DateTime.now().minus({days: 3}).toSeconds();
    const lastMed: MeditationInstance = {
      ...mockMeditationInstance,
      meditationStartTime: threeDaysAgo,
    };

    const result = makeUpdatedStreakData(user, lastMed);

    expect(result.current).toBe(1);
    expect(result.longest).toBe(10);
    expect(result.streakUpdated).toBe(true);
    expect(result.newLongestStreak).toBe(false);
  });

  it('longest streak updates when current exceeds it', () => {
    const user = makeUser({current: 5, longest: 5});
    const yesterday = DateTime.now().minus({days: 1}).toSeconds();
    const lastMed: MeditationInstance = {
      ...mockMeditationInstance,
      meditationStartTime: yesterday,
    };

    const result = makeUpdatedStreakData(user, lastMed);

    expect(result.current).toBe(6);
    expect(result.longest).toBe(6);
    expect(result.newLongestStreak).toBe(true);
  });

  it('longest streak does NOT update when current is below it', () => {
    const user = makeUser({current: 2, longest: 10});
    const yesterday = DateTime.now().minus({days: 1}).toSeconds();
    const lastMed: MeditationInstance = {
      ...mockMeditationInstance,
      meditationStartTime: yesterday,
    };

    const result = makeUpdatedStreakData(user, lastMed);

    expect(result.current).toBe(3);
    expect(result.longest).toBe(10);
    expect(result.newLongestStreak).toBe(false);
  });

  it('same-day meditation does not double-count', () => {
    const user = makeUser({current: 3, longest: 5});
    const today = DateTime.now().toSeconds();
    const lastMed: MeditationInstance = {
      ...mockMeditationInstance,
      meditationStartTime: today,
    };

    const result = makeUpdatedStreakData(user, lastMed);

    expect(result.current).toBe(3);
    expect(result.longest).toBe(5);
    expect(result.streakUpdated).toBe(false);
  });
});

describe('checkStreakData - validation', () => {
  it('preserves streak when last meditation was today', () => {
    const streakData = {current: 3, longest: 5};
    const today = DateTime.now().toSeconds();
    const lastMed: MeditationInstance = {
      ...mockMeditationInstance,
      meditationStartTime: today,
    };

    const result = checkStreakData(streakData, lastMed);
    expect(result).toEqual(streakData);
  });

  it('preserves streak when last meditation was yesterday', () => {
    const streakData = {current: 3, longest: 5};
    const yesterday = DateTime.now().minus({days: 1}).toSeconds();
    const lastMed: MeditationInstance = {
      ...mockMeditationInstance,
      meditationStartTime: yesterday,
    };

    const result = checkStreakData(streakData, lastMed);
    expect(result).toEqual(streakData);
  });

  it('resets current streak when gap is 2+ days', () => {
    const streakData = {current: 3, longest: 5};
    const threeDaysAgo = DateTime.now().minus({days: 3}).toSeconds();
    const lastMed: MeditationInstance = {
      ...mockMeditationInstance,
      meditationStartTime: threeDaysAgo,
    };

    const result = checkStreakData(streakData, lastMed);
    expect(result.current).toBe(0);
    expect(result.longest).toBe(5);
  });

  it('returns original streak data when no meditation provided', () => {
    const streakData = {current: 3, longest: 5};
    const result = checkStreakData(streakData, null as any);
    expect(result).toEqual(streakData);
  });

  it('returns original streak data when meditation has no start time', () => {
    const streakData = {current: 3, longest: 5};
    const lastMed: MeditationInstance = {
      ...mockMeditationInstance,
      meditationStartTime: undefined,
    };

    const result = checkStreakData(streakData, lastMed);
    expect(result).toEqual(streakData);
  });
});
