import {Track} from 'react-native-track-player';
import RNFS from 'react-native-fs';

import {MeditationBase} from '../types';

export const convertMeditationToTrack = (
  meditationBase: MeditationBase,
  filePath?: string,
): Track => {
  if (meditationBase) {
    // Use provided filePath if available, otherwise fall back to constructed path
    const trackUrl = `${RNFS.DocumentDirectoryPath}/${meditationBase.url}`;
    console.log('player debugging - trackURL', trackUrl)
    return {
      url: trackUrl,
      title: meditationBase.name,
    };
  }
};
