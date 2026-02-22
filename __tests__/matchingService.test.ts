/**
 * Tests for matchingService - the data-driven file matching pipeline.
 *
 * We mock getRawCatalogSync to provide a controlled catalog, then test
 * exact size, prefix size, and filename pattern matching.
 */

import {makeFilePathDataList} from '../src/services/matchingService';
import {getRawCatalogSync} from '../src/services/meditationCatalog';
import {Platform} from 'react-native';

// Mock the catalog module
jest.mock('../src/services/meditationCatalog', () => ({
  getRawCatalogSync: jest.fn(),
}));

const mockCatalog = {
  'm-botec-1': {
    meditationBaseId: 'm-botec-1',
    name: 'Blessing of the Energy Centers 01',
    artist: 'Dr. Joe Dispenza',
    formattedDuration: '55:00',
    groupName: 'Foundational',
    type: 0,
    backgroundImageKey: 'default',
    matchingData: {
      knownFileSizes: [58234567, 58234568],
      knownStringSizes: ['58234'],
      fileNamePatterns: ['/blessing.*energy.*centers.*0?1/i'],
    },
  },
  'm-generating-abundance': {
    meditationBaseId: 'm-generating-abundance',
    name: 'Generating Abundance',
    artist: 'Dr. Joe Dispenza',
    formattedDuration: '45:00',
    groupName: 'Generating',
    type: 0,
    backgroundImageKey: 'default',
    matchingData: {
      knownFileSizes: [47123456],
      knownStringSizes: ['47123'],
      fileNamePatterns: ['/generating.*abundance/i'],
    },
  },
  'm-no-matching': {
    meditationBaseId: 'm-no-matching',
    name: 'No Matching Data',
    artist: 'Dr. Joe Dispenza',
    formattedDuration: '30:00',
    groupName: 'Other',
    type: 0,
    backgroundImageKey: 'default',
    // No matchingData at all
  },
};

const makeFile = (overrides: any = {}) => ({
  name: overrides.name || 'test-file.m4a',
  size: overrides.size || 12345,
  type: overrides.type || 'audio/mp4',
  uri: overrides.uri || 'file:///test/test-file.m4a',
  fileCopyUri:
    overrides.fileCopyUri ||
    '/var/mobile/Containers/Data/Application/UUID/Documents/test-file.m4a',
});

beforeEach(() => {
  (getRawCatalogSync as jest.Mock).mockReturnValue(mockCatalog);
  // Default to iOS for relative path extraction
  Platform.OS = 'ios';
});

describe('matchingService - makeFilePathDataList', () => {
  describe('Exact size matching', () => {
    it('matches file with known exact size', () => {
      const file = makeFile({
        name: 'random-name.m4a',
        size: 58234567,
        fileCopyUri: '/path/to/Documents/random-name.m4a',
      });

      const {filePathDataList, unknownFiles} = makeFilePathDataList(
        [file],
        {},
      );

      expect(filePathDataList).toHaveProperty('m-botec-1');
      expect(unknownFiles).toHaveLength(0);
    });

    it('matches second known size for same meditation', () => {
      const file = makeFile({
        name: 'whatever.m4a',
        size: 58234568,
        fileCopyUri: '/path/to/Documents/whatever.m4a',
      });

      const {filePathDataList} = makeFilePathDataList([file], {});

      expect(filePathDataList).toHaveProperty('m-botec-1');
    });
  });

  describe('Size prefix matching', () => {
    it('matches when first 5 digits of size match', () => {
      // 47123999 has prefix "47123" which matches m-generating-abundance
      const file = makeFile({
        name: 'unknown.m4a',
        size: 47123999,
        fileCopyUri: '/path/to/Documents/unknown.m4a',
      });

      const {filePathDataList} = makeFilePathDataList([file], {});

      expect(filePathDataList).toHaveProperty('m-generating-abundance');
    });
  });

  describe('Filename pattern matching', () => {
    it('matches file by name pattern (regex)', () => {
      const file = makeFile({
        name: 'Blessing of the Energy Centers 01.m4a',
        size: 99999999, // size won't match
        fileCopyUri: '/path/to/Documents/bec01.m4a',
      });

      const {filePathDataList} = makeFilePathDataList([file], {});

      expect(filePathDataList).toHaveProperty('m-botec-1');
    });

    it('matches generating abundance by name pattern', () => {
      const file = makeFile({
        name: 'Generating Abundance.mp3',
        size: 11111111,
        fileCopyUri: '/path/to/Documents/ga.mp3',
      });

      const {filePathDataList} = makeFilePathDataList([file], {});

      expect(filePathDataList).toHaveProperty('m-generating-abundance');
    });
  });

  describe('Priority order', () => {
    it('exact size takes priority over filename pattern', () => {
      // Size matches m-botec-1, name matches m-generating-abundance
      const file = makeFile({
        name: 'Generating Abundance.m4a',
        size: 58234567, // exact match for botec-1
        fileCopyUri: '/path/to/Documents/ga.m4a',
      });

      const {filePathDataList} = makeFilePathDataList([file], {});

      expect(filePathDataList).toHaveProperty('m-botec-1');
      expect(filePathDataList).not.toHaveProperty('m-generating-abundance');
    });
  });

  describe('No match / unknown files', () => {
    it('returns unknown file when nothing matches', () => {
      const file = makeFile({
        name: 'completely-unknown.m4a',
        size: 11111,
        fileCopyUri: '/path/to/Documents/unknown.m4a',
      });

      const {filePathDataList, unknownFiles} = makeFilePathDataList(
        [file],
        {},
      );

      expect(Object.keys(filePathDataList)).toHaveLength(0);
      expect(unknownFiles).toHaveLength(1);
      expect(unknownFiles[0].name).toBe('completely-unknown.m4a');
    });
  });

  describe('Null catalog', () => {
    it('returns all files as unknown when catalog is null', () => {
      (getRawCatalogSync as jest.Mock).mockReturnValue(null);

      const file = makeFile({size: 58234567});
      const {filePathDataList, unknownFiles} = makeFilePathDataList(
        [file],
        {},
      );

      expect(Object.keys(filePathDataList)).toHaveLength(0);
      expect(unknownFiles).toHaveLength(1);
    });
  });

  describe('Existing file path data merging', () => {
    it('merges new matches with existing data', () => {
      const file = makeFile({
        name: 'Generating Abundance.m4a',
        size: 47123456,
        fileCopyUri: '/path/to/Documents/ga.m4a',
      });

      const existing = {'m-existing': '/path/to/existing.m4a'};
      const {filePathDataList} = makeFilePathDataList([file], existing);

      expect(filePathDataList).toHaveProperty('m-existing');
      expect(filePathDataList).toHaveProperty('m-generating-abundance');
    });

    it('overwrites existing match for same meditation', () => {
      const file = makeFile({
        name: 'new-file.m4a',
        size: 47123456,
        fileCopyUri: '/path/to/Documents/new-file.m4a',
      });

      const existing = {
        'm-generating-abundance': '/path/to/old-file.m4a',
      };
      const {filePathDataList} = makeFilePathDataList([file], existing);

      expect(filePathDataList['m-generating-abundance']).toBe(
        'Documents/new-file.m4a',
      );
    });
  });

  describe('Multiple files', () => {
    it('processes mixed matched and unmatched files', () => {
      const matched = makeFile({
        name: 'bec1.m4a',
        size: 58234567,
        fileCopyUri: '/path/to/Documents/bec1.m4a',
      });
      const unmatched = makeFile({
        name: 'random.m4a',
        size: 99999,
        fileCopyUri: '/path/to/Documents/random.m4a',
      });

      const {filePathDataList, unknownFiles} = makeFilePathDataList(
        [matched, unmatched],
        {},
      );

      expect(filePathDataList).toHaveProperty('m-botec-1');
      expect(unknownFiles).toHaveLength(1);
    });

    it('handles empty file list', () => {
      const {filePathDataList, unknownFiles} = makeFilePathDataList([], {});

      expect(Object.keys(filePathDataList)).toHaveLength(0);
      expect(unknownFiles).toHaveLength(0);
    });
  });
});
