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
import {UnknownFileData} from '../types';
import {fbAddUnsupportedFiles} from '../fb/unsupportedFiles';
import {User} from '../contexts/userData';

export const onAddMeditations = async (
  existingMeditationFilePathData: MeditationFilePathData,
  setExistingMeditationFilePathData: React.Dispatch<
    React.SetStateAction<MeditationFilePathData>
  >,
  setUnknownFiles: (a: UnknownFileData[]) => void,
  user: User,
  hideSuccessToast?: boolean,
) => {
  meditationAddSendEvent(Action.SUBMIT, Noun.BUTTON);
  let meditationBaseData = {} as any;

  const pickedFiles = await DocumentPicker.pick({
    allowMultiSelection: true,
    copyTo: 'documentDirectory',
  });

  const {filePathDataList, unknownFiles} = makeFilePathDataList(
    pickedFiles,
    existingMeditationFilePathData,
  );

  if (unknownFiles.length > 0) {
    fbAddUnsupportedFiles(user, unknownFiles);
    setUnknownFiles(unknownFiles);
  }

  if (!isEmpty(filePathDataList)) {
    setMeditationFilePathDataInAsyncStorage(filePathDataList);
    setExistingMeditationFilePathData(filePathDataList);
    meditationBaseData = await makeMeditationBaseData();
  }

  return {
    _meditations: meditationBaseData,
    _unknownFiles: unknownFiles,
  };
};
