import {MeditationInstance} from '../../types';

export const resetMeditationInstanceData = (
  setMeditationInstanceData: React.Dispatch<
    React.SetStateAction<MeditationInstance>
  >,
) => {
  setMeditationInstanceData({} as MeditationInstance);
};
