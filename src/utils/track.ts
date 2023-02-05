import { Track } from 'react-native-track-player';

import { MeditationBase } from '../types';

export const convertMeditationToTrack = (meditationBase: MeditationBase): Track => {
  if (meditationBase) {
    return ({
      url: meditationBase.url,
      title: meditationBase.name,
    })
  }
}
