import React, { createContext } from 'react';
import { UserStreaks } from './userData';

export interface StreaksContext {
  streaks: UserStreaks,
  setStreaks: React.Dispatch<React.SetStateAction<UserStreaks>>,
}

export const initialStreakData = {
  streaks: {
    current: 0,
    longest: 0,
    updated: false,    
  }
} as StreaksContext;

const StreakContext = createContext(initialStreakData);

export default StreakContext;
