import { isEmpty } from 'lodash';
import Toast from 'react-native-toast-message';
import DocumentPicker from 'react-native-document-picker';

import { MeditationFilePathData, setMeditationFilePathDataInAsyncStorage } from './asyncStorageMeditation';
import { makeFilePathDataList } from './filePicker';
import { makeMeditationBaseData } from './meditation';
import { meditationAddSendEvent, Action, Noun } from '../analytics';

interface ErrorFiles {
  [key: string]: string | number;
}

export const onAddMeditations = async (
  existingMeditationFilePathData: MeditationFilePathData,
  setExistingMeditationFilePathData: React.Dispatch<React.SetStateAction<MeditationFilePathData>>,
  hideSuccessToast?: boolean,
) => {
  meditationAddSendEvent(
    Action.SUBMIT,
    Noun.BUTTON,
  );

  const pickedFiles = await DocumentPicker.pick({
    allowMultiSelection: true,
    copyTo: 'documentDirectory',
  });

  const filePathDataList = makeFilePathDataList(pickedFiles, existingMeditationFilePathData);

  if (!filePathDataList) { return null; }
  const numberOfMeditations = Object.keys(filePathDataList).length;

  if (
    !filePathDataList ||
    numberOfMeditations <= 0
  ) {
    const errorFiles = {} as ErrorFiles;

    pickedFiles.forEach((file, index) => {
      if (file.name && file.size) {
        errorFiles[`name-${index}`] = file.name
        errorFiles[`name-${index}-size`] = file.size
      }
    })

    meditationAddSendEvent(
      Action.FAIL,
      Noun.BUTTON,
      errorFiles,
    );

    Toast.show({
      type: 'error',
      text1: 'Something went wrong',
      text2: 'Tap to retry',
      position: 'bottom',
      bottomOffset: 100,
      onPress: () => onAddMeditations(
        existingMeditationFilePathData,
        setExistingMeditationFilePathData,
      ),
      visibilityTime: 5000,
    });
  } else {
    if (!hideSuccessToast) {
      Toast.show({
        type: 'success',
        text1: 'Meditations added',
        text2: `New meditations were added to your library`,
        position: 'bottom',
        bottomOffset: 100,
        onPress: () => onAddMeditations(
          existingMeditationFilePathData,
          setExistingMeditationFilePathData,
        ),
        visibilityTime: 5000,
      });
    }
  }

  if (!isEmpty(filePathDataList)) {
    setMeditationFilePathDataInAsyncStorage(filePathDataList);
    setExistingMeditationFilePathData(filePathDataList);
    const meditationBaseData = await makeMeditationBaseData();
    return meditationBaseData;
  }
};