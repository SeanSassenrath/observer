import React, {createContext} from 'react';
import {MeditationBaseId} from '../types';

interface UserProfile {
  creationTime: string;
  displayName: string;
  email: string;
  firstName: string;
  lastName: string;
  lastSignInTime: string;
  photoURL: string;
}

export type UserUid = string;

export interface UserStreaks {
  current?: number;
  longest?: number;
}

export interface MeditationCountsMap {
  [key: string]: {
    count: number;
    name: string;
    id: string;
  };
}

interface BetaAgreement {
  hasAccepted: boolean;
  date: string;
}

interface Onboarding {
  hasSeenAddMeditationOnboarding: boolean;
  hasSeenLibraryOnboarding: boolean;
  hasSeenHomeOnboarding: boolean;
  hasSeenInsightsOnboarding: boolean;
}

export interface User {
  uid: UserUid;
  profile: UserProfile;
  hasBetaAccess?: boolean;
  betaAgreement?: BetaAgreement;
  onboarding: Onboarding;
  meditationHistoryIds?: MeditationBaseId[];
  meditationUserData: {
    recentMeditationBaseIds?: MeditationBaseId[];
    meditationCounts?: MeditationCountsMap;
    streaks: UserStreaks;
    totalMeditationTime?: number;
  };
}

interface UserContext {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
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
  onboarding: {
    hasSeenAddMeditationOnboarding: false,
    hasSeenLibraryOnboarding: false,
    hasSeenHomeOnboarding: false,
    hasSeenInsightsOnboarding: false,
  },
  meditationHistoryIds: [],
  meditationUserData: {
    streaks: {
      current: 0,
      longest: 0,
    },
    totalMeditationTime: 0,
  },
};

export default UserContext;
