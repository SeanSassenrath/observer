import { isEmpty, keyBy } from 'lodash';
import Toast from 'react-native-toast-message';
import analytics from '@react-native-firebase/analytics';
import DocumentPicker from 'react-native-document-picker';

import { MeditationFilePathData, setMeditationFilePathDataInAsyncStorage } from './asyncStorageMeditation';
import { makeFilePathDataList } from './filePicker';
import { makeMeditationBaseData } from './meditation';

export const onAddMeditations = async (
  existingMediationFilePathData: MeditationFilePathData,
  setExistingMeditationFilePathData: React.Dispatch<React.SetStateAction<MeditationFilePathData>>,
) => {
  await analytics().logEvent('add_meditations_start')

  const pickedFiles = await DocumentPicker.pick({
    allowMultiSelection: true,
    copyTo: 'documentDirectory',
  });

  const filePathDataList = makeFilePathDataList(pickedFiles, existingMediationFilePathData);

  if (!filePathDataList) { return null; }
  const numberOfMeditations = Object.keys(filePathDataList).length;

  if (
    !filePathDataList ||
    numberOfMeditations <= 0
  ) {
    const errorPickedFiles = Object.fromEntries(
      pickedFiles.map((file) => [file.name, file])
    );

    await analytics().logEvent('add_meditations_fail', errorPickedFiles)

    Toast.show({
      type: 'error',
      text1: 'Something went wrong',
      text2: 'Tap to retry',
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
        setExistingMeditationFilePathData,
      ),
      visibilityTime: 5000,
    });
  }

  if (!isEmpty(filePathDataList)) {
    setMeditationFilePathDataInAsyncStorage(filePathDataList);
    setExistingMeditationFilePathData(filePathDataList);
    const meditationBaseData = await makeMeditationBaseData();
    return meditationBaseData;
  }
};