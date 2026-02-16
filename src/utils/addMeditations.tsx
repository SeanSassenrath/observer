import {isEmpty} from 'lodash';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';

import {
  MeditationFilePathData,
  setMeditationFilePathDataInAsyncStorage,
} from './asyncStorageMeditation';
import {makeFilePathDataList} from '../services/matchingService';
import {makeMeditationBaseData} from './meditation';
import {meditationAddSendEvent, Action, Noun} from '../analytics';
import {MeditationBaseMap, UnknownFileData} from '../types';
import {fbAddUnsupportedFiles} from '../fb/unsupportedFiles';
import {User} from '../contexts/userData';

const filterUnknownFiles = (_unknownFiles: UnknownFileData[]) => {
  const filteredFiles = [] as UnknownFileData[];

  if (_unknownFiles.length > 0) {
    _unknownFiles.filter(file => {
      const fileName = file.name?.toLowerCase();
      const fileType = file.type?.toLowerCase();

      const filterByName = (_fileName: string) =>
        _fileName.includes('introduction') ||
        _fileName.includes('intro') ||
        _fileName.includes('explanation');

      const filterByType = (_fileType: string) =>
        _fileType.includes('image/png') ||
        _fileType.includes('application/pdf');

      if (fileName && fileType) {
        if (!filterByName(fileName) && !filterByType(fileType)) {
          filteredFiles.push(file);
        }
      }
    });
  }

  return filteredFiles;
};

export const onAddMeditations = async (
  existingMeditationFilePathData: MeditationFilePathData,
  setExistingMeditationFilePathData: React.Dispatch<
    React.SetStateAction<MeditationFilePathData>
  >,
  setUnknownFiles: (a: UnknownFileData[]) => void,
  user: User,
  setMeditationBaseData: React.Dispatch<React.SetStateAction<MeditationBaseMap>>,
) => {
  meditationAddSendEvent(Action.SUBMIT, Noun.BUTTON);
  let meditationBaseData = {} as any;
  let pickedFiles = [] as DocumentPickerResponse[];

  pickedFiles = await DocumentPicker.pick({
    allowMultiSelection: true,
    copyTo: 'documentDirectory',
  });

  const {filePathDataList, unknownFiles} = makeFilePathDataList(
    pickedFiles,
    existingMeditationFilePathData,
  );

  const filteredUnknownFiles = filterUnknownFiles(unknownFiles);

  if (unknownFiles.length > 0) {
    fbAddUnsupportedFiles(user, filteredUnknownFiles);
    setUnknownFiles(filteredUnknownFiles);
  }

  if (!isEmpty(filePathDataList)) {
    setMeditationFilePathDataInAsyncStorage(filePathDataList);
    setExistingMeditationFilePathData(filePathDataList);
    meditationBaseData = await makeMeditationBaseData();
    if (meditationBaseData && Object.keys(meditationBaseData).length > 0) {
      setMeditationBaseData(meditationBaseData);
    }
  }

  return {
    _meditations: meditationBaseData,
    _unknownFiles: filteredUnknownFiles,
  };
};
