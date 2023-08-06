import {isEmpty} from 'lodash';
import Toast from 'react-native-toast-message';
import DocumentPicker from 'react-native-document-picker';

import {
  MeditationFilePathData,
  setMeditationFilePathDataInAsyncStorage,
} from './asyncStorageMeditation';
import {makeFilePathDataList} from './filePicker';
import {makeMeditationBaseData} from './meditation';
import {meditationAddSendEvent, Action, Noun} from '../analytics';
import {UnsupportedFileData} from '../types';
import {fbAddUnsupportedFiles} from '../fb/unsupportedFiles';
import {User} from '../contexts/userData';

export const onAddMeditations = async (
  existingMeditationFilePathData: MeditationFilePathData,
  setExistingMeditationFilePathData: React.Dispatch<
    React.SetStateAction<MeditationFilePathData>
  >,
  setUnsupportedFiles: (a: UnsupportedFileData[]) => void,
  user: User,
  hideSuccessToast?: boolean,
) => {
  meditationAddSendEvent(Action.SUBMIT, Noun.BUTTON);
  let meditationBaseData = {} as any;

  const pickedFiles = await DocumentPicker.pick({
    allowMultiSelection: true,
    copyTo: 'documentDirectory',
  });

  const {filePathDataList, unsupportedFiles} = makeFilePathDataList(
    pickedFiles,
    existingMeditationFilePathData,
  );

  if (unsupportedFiles.length > 0) {
    fbAddUnsupportedFiles(user, unsupportedFiles);
    setUnsupportedFiles(unsupportedFiles);
  }

  if (
    !isEmpty(filePathDataList) &&
    !hideSuccessToast &&
    unsupportedFiles.length <= 0
  ) {
    Toast.show({
      type: 'success',
      text1: 'Meditations added',
      text2: 'New meditations were added to your library',
      position: 'bottom',
      bottomOffset: 100,
      onPress: () =>
        onAddMeditations(
          existingMeditationFilePathData,
          setExistingMeditationFilePathData,
          setUnsupportedFiles,
          user,
        ),
      visibilityTime: 5000,
    });
  }

  if (!isEmpty(filePathDataList)) {
    setMeditationFilePathDataInAsyncStorage(filePathDataList);
    setExistingMeditationFilePathData(filePathDataList);
    meditationBaseData = await makeMeditationBaseData();
  }

  return {
    _meditations: meditationBaseData,
    _unsupportedFiles: unsupportedFiles,
  };
};
