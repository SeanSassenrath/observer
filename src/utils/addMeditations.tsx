import { isEmpty } from 'lodash';
import Toast from 'react-native-toast-message';

import { MeditationFilePathData, setMeditationFilePathDataInAsyncStorage } from './asyncStorageMeditation';
import { pickFiles } from './filePicker';
import { makeMeditationBaseData } from './meditation';

export const onAddMeditations = async (
  existingMediationFilePathData: MeditationFilePathData,
  setExistingMeditationFilePathData: React.Dispatch<React.SetStateAction<MeditationFilePathData>>
) => {
  const pickedFileData = await pickFiles(existingMediationFilePathData);
  if (!pickedFileData) { return null; }
  const numberOfMeditations = Object.keys(pickedFileData).length;

  if (
    !pickedFileData ||
    numberOfMeditations <= 0
  ) {
    Toast.show({
      type: 'error',
      text1: 'Error adding meditations',
      text2: 'Tap to re-try',
      position: 'bottom',
      bottomOffset: 100,
      onPress: () => onAddMeditations(
        existingMediationFilePathData,
        setExistingMeditationFilePathData,
      ),
      visibilityTime: 5000,
    });
  } else {
    Toast.show({
      type: 'success',
      text1: 'Meditations added',
      text2: `New meditations were added to your library`,
      position: 'bottom',
      bottomOffset: 100,
      onPress: () => onAddMeditations(
        existingMediationFilePathData,
        setExistingMeditationFilePathData
      ),
      visibilityTime: 5000,
    });
  }

  if (!isEmpty(pickedFileData)) {
    setMeditationFilePathDataInAsyncStorage(pickedFileData);
    setExistingMeditationFilePathData(pickedFileData);
    const meditationBaseData = await makeMeditationBaseData();
    return meditationBaseData;
  }
};