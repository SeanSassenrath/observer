/**
 * Tests for the addMeditations utility - file picking, matching, and persistence.
 */

import DocumentPicker from 'react-native-document-picker';
import {onAddMeditations} from '../src/utils/addMeditations';
import {makeFilePathDataList} from '../src/services/matchingService';
import {setMeditationFilePathDataInAsyncStorage} from '../src/utils/asyncStorageMeditation';
import {makeMeditationBaseData} from '../src/utils/meditation';
import {fbAddUnsupportedFiles} from '../src/fb/unsupportedFiles';

// Mock dependencies
jest.mock('../src/services/matchingService');
jest.mock('../src/utils/asyncStorageMeditation');
jest.mock('../src/utils/meditation');
jest.mock('../src/fb/unsupportedFiles');
jest.mock('../src/analytics', () => ({
  meditationAddSendEvent: jest.fn(),
  Action: {SUBMIT: 'submit'},
  Noun: {BUTTON: 'button'},
}));

const mockSetFilePaths = jest.fn();
const mockSetUnknownFiles = jest.fn();
const mockSetMeditationBaseData = jest.fn();

const mockUser = {
  uid: 'test-uid',
  profile: {email: 'test@test.com', displayName: '', firstName: '', lastName: '', creationTime: '', lastSignInTime: '', photoURL: ''},
  onboarding: {hasSeenWelcome: false, hasSeenAddMeditationOnboarding: false, hasSeenLibraryOnboarding: false, hasSeenHomeOnboarding: false, hasSeenInsightsOnboarding: false, hasSeenBreathworkOnboarding: false, hasSeenPlaylistOnboarding: false},
  meditationUserData: {streaks: {current: 0, longest: 0}},
} as any;

beforeEach(() => {
  jest.clearAllMocks();
  (fbAddUnsupportedFiles as jest.Mock).mockResolvedValue(true);
  (setMeditationFilePathDataInAsyncStorage as jest.Mock).mockResolvedValue(undefined);
  (makeMeditationBaseData as jest.Mock).mockResolvedValue({});
});

describe('onAddMeditations', () => {
  it('calls DocumentPicker.pick with multi-select', async () => {
    (DocumentPicker.pick as jest.Mock).mockResolvedValue([]);
    (makeFilePathDataList as jest.Mock).mockReturnValue({
      filePathDataList: {},
      unknownFiles: [],
    });

    await onAddMeditations(
      {},
      mockSetFilePaths,
      mockSetUnknownFiles,
      mockUser,
      mockSetMeditationBaseData,
    );

    expect(DocumentPicker.pick).toHaveBeenCalledWith({
      allowMultiSelection: true,
      copyTo: 'documentDirectory',
    });
  });

  it('saves matched files to AsyncStorage and updates context', async () => {
    const pickedFiles = [
      {name: 'meditation.m4a', size: 12345, type: 'audio/mp4', uri: 'file://med.m4a', fileCopyUri: '/path/med.m4a'},
    ];
    const matchedData = {'m-test': '/path/med.m4a'};

    (DocumentPicker.pick as jest.Mock).mockResolvedValue(pickedFiles);
    (makeFilePathDataList as jest.Mock).mockReturnValue({
      filePathDataList: matchedData,
      unknownFiles: [],
    });
    (makeMeditationBaseData as jest.Mock).mockResolvedValue({'m-test': {name: 'Test'}});

    await onAddMeditations(
      {},
      mockSetFilePaths,
      mockSetUnknownFiles,
      mockUser,
      mockSetMeditationBaseData,
    );

    expect(setMeditationFilePathDataInAsyncStorage).toHaveBeenCalledWith(matchedData);
    expect(mockSetFilePaths).toHaveBeenCalledWith(matchedData);
    expect(mockSetMeditationBaseData).toHaveBeenCalledWith({'m-test': {name: 'Test'}});
  });

  it('uploads unsupported files to Firebase (filtering intros/images)', async () => {
    const pickedFiles = [
      {name: 'file.m4a', size: 100, type: 'audio/mp4', uri: 'file://f.m4a', fileCopyUri: '/path/f.m4a'},
    ];
    const unknownAudio = {name: 'unknown.m4a', type: 'audio/mp4', size: 5000, uri: '/path/unknown.m4a'};
    const introFile = {name: 'Introduction to meditation.m4a', type: 'audio/mp4', size: 2000, uri: '/path/intro.m4a'};
    const imageFile = {name: 'cover.png', type: 'image/png', size: 1000, uri: '/path/cover.png'};

    (DocumentPicker.pick as jest.Mock).mockResolvedValue(pickedFiles);
    (makeFilePathDataList as jest.Mock).mockReturnValue({
      filePathDataList: {},
      unknownFiles: [unknownAudio, introFile, imageFile],
    });

    const result = await onAddMeditations(
      {},
      mockSetFilePaths,
      mockSetUnknownFiles,
      mockUser,
      mockSetMeditationBaseData,
    );

    // Intros and images should be filtered out
    expect(fbAddUnsupportedFiles).toHaveBeenCalledWith(
      mockUser,
      [unknownAudio],
    );
    expect(result._unknownFiles).toEqual([unknownAudio]);
  });

  it('filters out PDF files from unknown files', async () => {
    const pdfFile = {name: 'manual.pdf', type: 'application/pdf', size: 3000, uri: '/path/manual.pdf'};

    (DocumentPicker.pick as jest.Mock).mockResolvedValue([]);
    (makeFilePathDataList as jest.Mock).mockReturnValue({
      filePathDataList: {},
      unknownFiles: [pdfFile],
    });

    const result = await onAddMeditations(
      {},
      mockSetFilePaths,
      mockSetUnknownFiles,
      mockUser,
      mockSetMeditationBaseData,
    );

    expect(result._unknownFiles).toEqual([]);
  });

  it('handles empty file selection gracefully', async () => {
    (DocumentPicker.pick as jest.Mock).mockResolvedValue([]);
    (makeFilePathDataList as jest.Mock).mockReturnValue({
      filePathDataList: {},
      unknownFiles: [],
    });

    const result = await onAddMeditations(
      {},
      mockSetFilePaths,
      mockSetUnknownFiles,
      mockUser,
      mockSetMeditationBaseData,
    );

    expect(result._unknownFiles).toEqual([]);
    expect(result._meditations).toEqual({});
  });

  it('merges with existing meditation file path data', async () => {
    const existing = {'m-existing': '/old/path.m4a'};
    const pickedFiles = [
      {name: 'new.m4a', size: 999, type: 'audio/mp4', uri: 'file://new.m4a', fileCopyUri: '/path/new.m4a'},
    ];

    (DocumentPicker.pick as jest.Mock).mockResolvedValue(pickedFiles);
    (makeFilePathDataList as jest.Mock).mockReturnValue({
      filePathDataList: {'m-existing': '/old/path.m4a', 'm-new': '/new/path.m4a'},
      unknownFiles: [],
    });
    (makeMeditationBaseData as jest.Mock).mockResolvedValue({});

    await onAddMeditations(
      existing,
      mockSetFilePaths,
      mockSetUnknownFiles,
      mockUser,
      mockSetMeditationBaseData,
    );

    expect(makeFilePathDataList).toHaveBeenCalledWith(pickedFiles, existing);
  });
});
