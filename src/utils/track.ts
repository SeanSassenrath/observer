import {Track} from 'react-native-track-player';
import RNFS from 'react-native-fs';

import {MeditationBase} from '../types';

export const convertMeditationToTrack = (
  meditationBase: MeditationBase,
): Track => {
  if (meditationBase) {
    const relativeFilePath = `${RNFS.DocumentDirectoryPath}/${meditationBase.url}`;
    return {
      url: relativeFilePath,
      title: meditationBase.name,
    };
  }
};
