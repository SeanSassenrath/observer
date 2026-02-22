/**
 * Tests for meditation utility functions:
 * - meditations.ts helpers (isBreathwork, getTopFiveMeditationIds, etc.)
 * - meditation.ts data transforms (makeUpdatedMeditationCountData, makeUpdatedRecentUserMeditationData, etc.)
 */

import {
  isBreathwork,
  isBreathworkAvailable,
  getTopFiveMeditationIds,
  getLastMeditationInstance,
} from '../src/utils/meditations/meditations';

import {
  makeUpdatedMeditationCountData,
  makeUpdatedRecentUserMeditationData,
  makeTotalMeditationTime,
  makeUpdatedFbUserMeditationData,
} from '../src/utils/meditation';

import {MeditationInstance, MeditationTypes} from '../src/types';
import {initialUserState, User} from '../src/contexts/userData';

// Mock meditationCatalog for getMeditationFromId
jest.mock('../src/services/meditationCatalog', () => ({
  getFullMeditationCatalogSync: jest.fn(() => ({
    'm-test': {
      meditationBaseId: 'm-test',
      name: 'Test Meditation',
      formattedDuration: '30:00',
      groupName: 'Test',
      type: 0,
      artist: 'Dr. Joe',
      url: '',
    },
  })),
}));

const mockMedInstance: MeditationInstance = {
  meditationBaseId: 'm-test',
  name: 'Test Meditation',
  type: MeditationTypes.Meditation,
  timeMeditated: 1800,
};

const makeUser = (overrides: Partial<User> = {}): User => ({
  ...initialUserState,
  uid: 'test-uid',
  ...overrides,
});

describe('isBreathwork', () => {
  it('returns true for breathwork keys (b- prefix)', () => {
    expect(isBreathwork('b-botec-1')).toBe(true);
    expect(isBreathwork('b-generating')).toBe(true);
  });

  it('returns false for non-breathwork keys', () => {
    expect(isBreathwork('m-botec-1')).toBe(false);
    expect(isBreathwork('meditation')).toBe(false);
  });
});

describe('isBreathworkAvailable', () => {
  it('returns true if any key is breathwork', () => {
    expect(isBreathworkAvailable(['m-test', 'b-test'])).toBe(true);
  });

  it('returns false if no breathwork keys', () => {
    expect(isBreathworkAvailable(['m-test', 'm-other'])).toBe(false);
  });

  it('returns false for empty array', () => {
    expect(isBreathworkAvailable([])).toBe(false);
  });
});

describe('getTopFiveMeditationIds', () => {
  it('returns top 5 meditation IDs sorted by count descending', () => {
    const counts = {
      'm-1': {count: 10, name: 'Med 1', id: 'm-1'},
      'm-2': {count: 5, name: 'Med 2', id: 'm-2'},
      'm-3': {count: 20, name: 'Med 3', id: 'm-3'},
      'm-4': {count: 1, name: 'Med 4', id: 'm-4'},
      'm-5': {count: 15, name: 'Med 5', id: 'm-5'},
      'm-6': {count: 3, name: 'Med 6', id: 'm-6'},
    };

    const result = getTopFiveMeditationIds(counts);

    expect(result).toHaveLength(5);
    expect(result[0]).toBe('m-3'); // highest count
    expect(result[1]).toBe('m-5');
    expect(result[2]).toBe('m-1');
    // m-4 (count=1) should be excluded as it's 6th
    expect(result).not.toContain('m-4');
  });

  it('returns fewer than 5 if not enough meditations', () => {
    const counts = {
      'm-1': {count: 3, name: 'Med 1', id: 'm-1'},
      'm-2': {count: 1, name: 'Med 2', id: 'm-2'},
    };

    const result = getTopFiveMeditationIds(counts);
    expect(result).toHaveLength(2);
    expect(result[0]).toBe('m-1');
  });

  it('handles empty counts', () => {
    const result = getTopFiveMeditationIds({});
    expect(result).toHaveLength(0);
  });
});

describe('getLastMeditationInstance', () => {
  it('returns first item from meditation history', () => {
    const history = {
      meditationInstances: [
        {...mockMedInstance, name: 'First'},
        {...mockMedInstance, name: 'Second'},
      ],
    };

    const result = getLastMeditationInstance(history as any);
    expect(result.name).toBe('First');
  });

  it('returns undefined for empty history', () => {
    const result = getLastMeditationInstance({meditationInstances: []} as any);
    expect(result).toBeUndefined();
  });

  it('handles null history gracefully', () => {
    const result = getLastMeditationInstance(null as any);
    expect(result).toBeFalsy();
  });
});

describe('makeUpdatedMeditationCountData', () => {
  it('increments count for meditation with existing count', () => {
    const user = makeUser({
      meditationUserData: {
        ...initialUserState.meditationUserData,
        meditationCounts: {
          'm-test': {count: 5, name: 'Test Meditation', id: 'm-test'},
        },
      },
    });

    const result = makeUpdatedMeditationCountData(user, mockMedInstance);
    expect(result).toBe(6);
  });

  it('returns 1 for meditation with no previous count', () => {
    const user = makeUser();
    const result = makeUpdatedMeditationCountData(user, mockMedInstance);
    expect(result).toBe(1);
  });
});

describe('makeUpdatedRecentUserMeditationData', () => {
  it('prepends new meditation to recent list', () => {
    const user = makeUser({
      meditationUserData: {
        ...initialUserState.meditationUserData,
        recentMeditationBaseIds: ['m-old-1', 'm-old-2'],
      },
    });

    const result = makeUpdatedRecentUserMeditationData(user, mockMedInstance);

    expect(result[0]).toBe('m-test');
    expect(result).toContain('m-old-1');
    expect(result).toContain('m-old-2');
  });

  it('deduplicates if meditation already in recent list', () => {
    const user = makeUser({
      meditationUserData: {
        ...initialUserState.meditationUserData,
        recentMeditationBaseIds: ['m-test', 'm-old-1'],
      },
    });

    const result = makeUpdatedRecentUserMeditationData(user, mockMedInstance);

    // Should not have duplicates
    const uniqueResult = [...new Set(result)];
    expect(result).toEqual(uniqueResult);
    expect(result[0]).toBe('m-test');
  });

  it('handles user with no recent meditations', () => {
    const user = makeUser();
    const result = makeUpdatedRecentUserMeditationData(user, mockMedInstance);

    expect(result).toEqual(['m-test']);
  });
});

describe('makeTotalMeditationTime', () => {
  it('adds time to existing total', () => {
    const user = makeUser({
      meditationUserData: {
        ...initialUserState.meditationUserData,
        totalMeditationTime: 3600,
      },
    });

    const result = makeTotalMeditationTime(user, mockMedInstance);
    expect(result).toBe(5400); // 3600 + 1800
  });

  it('returns undefined when no time meditated', () => {
    const user = makeUser({
      meditationUserData: {
        ...initialUserState.meditationUserData,
        totalMeditationTime: 3600,
      },
    });

    const noTimeMed = {...mockMedInstance, timeMeditated: undefined};
    const result = makeTotalMeditationTime(user, noTimeMed);
    expect(result).toBeUndefined();
  });
});

describe('makeUpdatedFbUserMeditationData', () => {
  it('builds correct Firestore update object', () => {
    const result = makeUpdatedFbUserMeditationData(
      5, // count
      undefined, // no breath data
      ['m-test', 'm-old'], // recent
      {current: 3, longest: 5, newLongestStreak: false, streakUpdated: true},
      mockMedInstance,
      5400, // total time
    );

    expect(result['meditationUserData.recentMeditationBaseIds']).toEqual([
      'm-test',
      'm-old',
    ]);
    expect(result['meditationUserData.meditationCounts.m-test.count']).toBe(5);
    expect(result['meditationUserData.meditationCounts.m-test.name']).toBe(
      'Test Meditation',
    );
    expect(result['meditationUserData.streaks.current']).toBe(3);
    expect(result['meditationUserData.streaks.longest']).toBe(5);
    expect(result['meditationUserData.totalMeditationTime']).toBe(5400);
  });

  it('includes breath meditation count when provided', () => {
    const breathData = {
      meditationBaseBreathName: 'Breath Meditation',
      updatedMeditationBreathCount: 2,
    };

    const medWithBreath = {
      ...mockMedInstance,
      meditationBaseBreathId: 'b-test',
    };

    const result = makeUpdatedFbUserMeditationData(
      1,
      breathData,
      ['m-test'],
      {current: 1, longest: 1, newLongestStreak: true, streakUpdated: true},
      medWithBreath,
      1800,
    );

    expect(result['meditationUserData.meditationCounts.b-test.count']).toBe(2);
    expect(result['meditationUserData.meditationCounts.b-test.name']).toBe(
      'Breath Meditation',
    );
  });
});
