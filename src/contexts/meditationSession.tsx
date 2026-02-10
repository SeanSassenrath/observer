import {createContext} from 'react';
import {MeditationInstance, PlaylistId} from '../types';

export interface MeditationSession {
  intention?: string;
  notes?: string;
  feedback?: string;
  playlistId?: PlaylistId;
  playlistName?: string;
  sessionStartTime?: number;
  instances: MeditationInstance[];  // Partially populated during playback
  timeMeditated?: number;
}

interface MeditationSessionContext {
  meditationSession: MeditationSession;
  setMeditationSession: React.Dispatch<React.SetStateAction<MeditationSession>>;
}

export const meditationSessionContext = {
  meditationSession: {instances: []},
  setMeditationSession: () => {},
} as MeditationSessionContext;

const MeditationSessionContext = createContext(meditationSessionContext);

export default MeditationSessionContext;
