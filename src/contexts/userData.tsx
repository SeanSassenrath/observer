import React, { createContext } from 'react';
import { MeditationBaseId, MeditationId } from '../types';

interface UserProfile {
  creationTime: string,
  displayName: string,
  email: string,
  firstName: string,
  lastName: string,
  lastSignInTime: string,
  photoURL: string,
}

export type UserUid = string;

export interface UserStreaks {
  current?: number,
  longest?: number,
}

export interface MeditationCountsMap {
  [key: string]: {
    count: number,
    name: string,
    id: string,
  }
}

export interface User {
  uid: UserUid,
  profile: UserProfile,
  hasBetaAccess?: boolean;
  meditationHistoryIds?: MeditationBaseId[],
  meditationUserData: {
    recentMeditationBaseIds?: MeditationBaseId[],
    meditationCounts?: MeditationCountsMap,
    streaks: UserStreaks,
    totalMeditationTime?: number,
  }
}

interface UserContext {
  user: User,
  setUser: React.Dispatch<React.SetStateAction<User>>,
}

const initialUserContext = {} as UserContext;

const UserContext = createContext(initialUserContext);

export const initialUserState = {
  uid: '',
  profile: {
    displayName: '',
    email: '',
    firstName: '',
    lastName: '',
    creationTime: '',
    lastSignInTime: '',
    photoURL: '',
  },
  meditationHistoryIds: [],
  meditationUserData: {
    streaks: {
      current: 0,
      longest: 0,
    }
  }
};

export default UserContext;
