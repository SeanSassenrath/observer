import React, {createContext} from 'react';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

import {MeditationInstance} from '../types';

export interface MeditationHistoryData {
  meditationInstances?: MeditationInstance[];
  lastDocument?: FirebaseFirestoreTypes.DocumentData;
}

export interface MeditationHistoryContext {
  meditationHistory: MeditationHistoryData;
  setMeditationHistory: React.Dispatch<
    React.SetStateAction<MeditationHistoryData>
  >;
}

export const initialMeditationHistoryData = {} as MeditationHistoryContext;

const MeditationHistoryContext = createContext(initialMeditationHistoryData);

export default MeditationHistoryContext;
