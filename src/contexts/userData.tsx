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

interface UserStreaks {
  currentStreak?: number,
  longestStreak?: number,
  streakUpdated?: boolean,
}

export interface User {
  uid: UserUid,
  profile: UserProfile,
  hasBetaAccess?: boolean;
  meditationHistoryIds?: MeditationBaseId[],
  meditationUserData?: {
    recentMeditationBaseIds?: MeditationBaseId[],
    meditationCounts?: {
      [key: string]: { 
        count: number,
        name: string,
        id: string,
      },
    },
    streaks?: UserStreaks,
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
  meditationUserData: {}
};

export default UserContext;
