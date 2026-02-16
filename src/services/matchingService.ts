import {Platform} from 'react-native';
import {DocumentPickerResponse} from 'react-native-document-picker';

import {MeditationFilePathData} from '../utils/asyncStorageMeditation';
import {UnknownFileData} from '../types';
import {getRawCatalogSync, FirestoreMeditation} from './meditationCatalog';

/**
 * Data-driven file matching service.
 * Reads matchingData from the cloud catalog instead of hardcoded switch statements.
 *
 * Priority:
 * 1. Exact file size match
 * 2. Size prefix match (first 5 digits)
 * 3. Filename pattern match (regex)
 */

function makeRelativeFilePath(absoluteFilePath: string | null) {
  if (absoluteFilePath && Platform.OS === 'ios') {
    const splitFilePath = absoluteFilePath.split('/');
    return splitFilePath
      .slice(splitFilePath.length - 2, splitFilePath.length)
      .join('/');
  }
}

function matchByExactSize(
  fileSize: number,
  catalog: Record<string, FirestoreMeditation>,
): string | null {
  for (const [id, med] of Object.entries(catalog)) {
    const sizes = med.matchingData?.knownFileSizes;
    if (sizes && sizes.includes(fileSize)) {
      return id;
    }
  }
  return null;
}

function matchBySizePrefix(
  fileSize: number,
  catalog: Record<string, FirestoreMeditation>,
): string | null {
  const prefix = fileSize.toString().slice(0, 5);
  for (const [id, med] of Object.entries(catalog)) {
    const prefixes = med.matchingData?.knownStringSizes;
    if (prefixes && prefixes.includes(prefix)) {
      return id;
    }
  }
  return null;
}

function matchByFileName(
  fileName: string,
  catalog: Record<string, FirestoreMeditation>,
): string | null {
  for (const [id, med] of Object.entries(catalog)) {
    const patterns = med.matchingData?.fileNamePatterns;
    if (patterns) {
      for (const patternStr of patterns) {
        // Parse "/pattern/flags" string into RegExp
        const match = patternStr.match(/^\/(.+)\/([gimsuy]*)$/);
        if (match) {
          try {
            const regex = new RegExp(match[1], match[2]);
            if (regex.test(fileName)) {
              return id;
            }
          } catch (e) {
            console.log('Invalid regex pattern for', id, ':', patternStr);
          }
        }
      }
    }
  }
  return null;
}

function matchFileToMeditation(
  file: DocumentPickerResponse,
): MeditationFilePathData | null {
  const catalog = getRawCatalogSync();
  if (!catalog) {
    return null;
  }

  const fileSize = file.size;
  const fileName = file.name;
  const filePath = makeRelativeFilePath(file.fileCopyUri);

  let meditationId: string | null = null;

  // 1. Exact file size match
  if (fileSize) {
    meditationId = matchByExactSize(fileSize, catalog);
  }

  // 2. Size prefix match
  if (!meditationId && fileSize) {
    meditationId = matchBySizePrefix(fileSize, catalog);
  }

  // 3. Filename pattern match
  if (!meditationId && fileName) {
    meditationId = matchByFileName(fileName, catalog);
  }

  if (meditationId && filePath) {
    return {[meditationId]: filePath};
  }

  return null;
}

export function makeFilePathDataList(
  files: DocumentPickerResponse[],
  existingMeditationFilePathData: MeditationFilePathData,
) {
  let filePathDataList = {...existingMeditationFilePathData} as any;
  let unknownFiles: UnknownFileData[] = [];

  files.forEach(file => {
    const filePathData = matchFileToMeditation(file);
    if (filePathData) {
      filePathDataList = {...filePathDataList, ...filePathData};
    } else {
      const fileCopyUri = makeRelativeFilePath(file.fileCopyUri) || null;
      unknownFiles.push({
        name: file.name,
        type: file.type,
        size: file.size,
        uri: fileCopyUri,
      });
    }
  });

  return {filePathDataList, unknownFiles};
}
