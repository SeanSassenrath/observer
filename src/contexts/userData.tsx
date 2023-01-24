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

export interface User {
  uid: string,
  profile: UserProfile,
  meditationHistoryIds?: MeditationBaseId[],
  meditationUserData?: {
    recentMeditationBaseIds?: MeditationBaseId[],
    meditationCounts?: {
      [key: string]: { 
        count: number,
        name: string,
      },
    },
    currentStreak?: number,
    longestStreak?: number,
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
    currentStreak: 0,
    longestStreak: 0,
    totalMeditationTime: 0,
  }
};

export default UserContext;
