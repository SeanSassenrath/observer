import {isEmpty} from 'lodash';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';

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
import {matchMeditationFile, MeditationMatchResult} from '../services/meditationMatcher';

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

/**
 * Convert MeditationMatchResult to MeditationFilePathData format for existing system compatibility
 */
const convertMatchResultToFilePathData = (
  matchResult: MeditationMatchResult,
  filePath: string
): MeditationFilePathData | null => {
  console.log(`🔍 Converting match result for: ${matchResult.file.name}`);
  console.log(`  - Match method: ${matchResult.matchMethod}`);
  console.log(`  - Has meditation: ${matchResult.meditation ? 'YES' : 'NO'}`);
  console.log(`  - File path: ${filePath}`);
  
  if (matchResult.meditation && (matchResult.matchMethod === 'name' || matchResult.matchMethod === 'size')) {
    const baseKey = matchResult.meditation.baseKey;
    console.log(`✅ Match found: ${matchResult.file.name} → ${baseKey} (${matchResult.matchMethod}, ${(matchResult.meditation.confidence * 100).toFixed(1)}%)`);
    
    const result = {
      [baseKey]: filePath,
    };
    console.log(`📦 Returning file path data:`, result);
    return result;
  }
  
  console.log(`❌ No match found for: ${matchResult.file.name} (method: ${matchResult.matchMethod})`);
  return null;
};

/**
 * New intelligent file processing using MeditationMatcher (name-based with size fallback)
 */
const makeIntelligentFilePathDataList = async (
  files: DocumentPickerResponse[],
  existingMeditationFilePathData: MeditationFilePathData,
) => {
  let filePathDataList = {...existingMeditationFilePathData};
  let unknownFiles: UnknownFileData[] = [];
  
  console.log(`🚀 Processing ${files.length} files with intelligent matching`);
  
  for (const file of files) {
    try {
      // Use the MeditationMatcher with name-based primary, size-based fallback
      const matchResult = await matchMeditationFile(file, {
        enableNameMatching: true,   // Primary method
        enableSizeMatching: true,   // Fallback method
        enableFingerprinting: false, // Disabled for production
        nameMatchingOptions: {
          confidenceThreshold: 0.5, // Moderate threshold
          maxResults: 1,
        },
      });
      
      // Convert successful matches to the expected data format
      const filePathData = convertMatchResultToFilePathData(matchResult, file.fileCopyUri || '');
      
      if (filePathData) {
        filePathDataList = {...filePathDataList, ...filePathData};
      } else {
        // No match found - add to unknown files (same as legacy behavior)
        unknownFiles.push({
          name: file.name,
          type: file.type,
          size: file.size,
          uri: file.fileCopyUri || null,
        });
      }
    } catch (error) {
      console.error(`Error matching file ${file.name}:`, error);
      // On error, add to unknown files
      unknownFiles.push({
        name: file.name,
        type: file.type,
        size: file.size,
        uri: file.fileCopyUri || null,
      });
    }
  }
  
  console.log(`📊 Matching results: ${Object.keys(filePathDataList).length - Object.keys(existingMeditationFilePathData).length} matched, ${unknownFiles.length} unknown`);
  
  return {filePathDataList, unknownFiles};
};

export const onAddMeditations = async (
  existingMeditationFilePathData: MeditationFilePathData,
  setExistingMeditationFilePathData: React.Dispatch<
    React.SetStateAction<MeditationFilePathData>
  >,
  setUnknownFiles: (a: UnknownFileData[]) => void,
  user: User,
) => {
  meditationAddSendEvent(Action.SUBMIT, Noun.BUTTON);
  let meditationBaseData = {} as any;
  let pickedFiles = [] as DocumentPickerResponse[];

  pickedFiles = await DocumentPicker.pick({
    allowMultiSelection: true,
    copyTo: 'documentDirectory',
  });

  // Use intelligent matching (name-based with size fallback) instead of size-only matching
  let filePathDataList: MeditationFilePathData = {};
  let unknownFiles: UnknownFileData[] = [];
  
  try {
    const result = await makeIntelligentFilePathDataList(
      pickedFiles,
      existingMeditationFilePathData,
    );
    filePathDataList = result.filePathDataList;
    unknownFiles = result.unknownFiles;
    console.log('✅ Intelligent matching completed successfully');
  } catch (error) {
    console.error('❌ Intelligent matching failed, falling back to legacy size-based matching:', error);
    // Fallback to legacy system if intelligent matching fails
    const legacyResult = makeFilePathDataList(pickedFiles, existingMeditationFilePathData);
    filePathDataList = legacyResult.filePathDataList;
    unknownFiles = legacyResult.unknownFiles;
  }

  const filteredUnknownFiles = filterUnknownFiles(unknownFiles);

  if (unknownFiles.length > 0) {
    fbAddUnsupportedFiles(user, filteredUnknownFiles);
    setUnknownFiles(filteredUnknownFiles);
  }

  console.log('🔍 Final filePathDataList:', filePathDataList);
  console.log('🔍 Is filePathDataList empty?', isEmpty(filePathDataList));
  
  if (!isEmpty(filePathDataList)) {
    console.log('💾 Saving meditation data to AsyncStorage...');
    setMeditationFilePathDataInAsyncStorage(filePathDataList);
    setExistingMeditationFilePathData(filePathDataList);
    console.log('📋 Creating meditation base data...');
    meditationBaseData = await makeMeditationBaseData();
    console.log('✅ Meditation base data created:', Object.keys(meditationBaseData));
  } else {
    console.log('❌ filePathDataList is empty - no meditations to save');
  }

  return {
    _meditations: meditationBaseData,
    _unknownFiles: filteredUnknownFiles,
  };
};
