import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {StackScreenProps} from '@react-navigation/stack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {DocumentPickerResponse} from 'react-native-document-picker';

import {
  GeneratingSeriesSizes,
  MeditationGroupKey,
  MeditationSizes,
  OtherSizes,
  SynchronizingSeriesSizes,
  WalkingMeditationSizes,
} from './constants/meditation';
import {MeditationGroupName} from './constants/meditation-data';
import {UserUid} from './contexts/userData';

// Stack Navigation
export type StackParamList = {
  AddMeditations: undefined;
  AddMedsSuccess: undefined;
  AddMedsMatching: AddMedsMatchingParams;
  BetaAgreement: undefined;
  Disclaimer: undefined;
  Feedback: undefined;
  Meditation: MeditationParams;
  MeditationFinish: undefined;
  MeditationMatch: UnrecognizedFilesParams;
  MeditationPlayer: MeditationParams;
  Profile: UserParams;
  LimitedVersion: undefined;
  PurchaseOnboarding: undefined;
  Purchase: undefined;
  SignIn: undefined;
  Subscriptions: undefined;
  TabNavigation: undefined;
  UnrecognizedFiles: UnrecognizedFilesParams;
};

interface MeditationParams {
  id: MeditationId;
  meditationBreathId?: MeditationId;
}

interface AddMedsMatchingParams {
  medsSuccess: MeditationBaseId[];
  medsFail: UnknownFileData[];
}

interface UnrecognizedFilesParams {
  medsFail: UnknownFileData[];
}

interface UserParams {
  userId: UserUid;
}

type AddMeditations = NativeStackScreenProps<StackParamList, 'AddMeditations'>;
type AddMedsMatching = NativeStackScreenProps<
  StackParamList,
  'AddMedsMatching'
>;
type MeditationMatch = NativeStackScreenProps<
  StackParamList,
  'MeditationMatch'
>;
type AddMedsSuccess = NativeStackScreenProps<StackParamList, 'AddMedsSuccess'>;
type BetaAgreement = NativeStackScreenProps<StackParamList, 'BetaAgreement'>;
type SignInProps = NativeStackScreenProps<StackParamList, 'SignIn'>;
type UnrecognizedFiles = NativeStackScreenProps<
  StackParamList,
  'UnrecognizedFiles'
>;

export type SignInScreenNavigationProp = SignInProps['navigation'];
export type BetaAgreementProp = BetaAgreement['navigation'];
export type AddMeditationsProp = AddMeditations['navigation'];
export type AddMedsMatchingProp = AddMedsMatching['navigation'];
export type AddMedsMatchingScreenNavigationProp = AddMedsMatching['navigation'];
export type AddMedsMatchingScreenRouteProp = AddMedsMatching['route'];
export type AddMedsSuccessProp = AddMedsSuccess['navigation'];
export type AddMedsSuccessScreenNavigationProp = AddMedsSuccess['navigation'];
export type AddMedsSuccessScreenRouteProp = AddMedsSuccess['route'];
export type UnrecognizedFilesScreenNavigationProp =
  UnrecognizedFiles['navigation'];
export type UnrecognizedFilesScreenRouteProp = UnrecognizedFiles['route'];
export type MeditationMatchScreenNavigationProp = AddMedsSuccess['navigation'];
export type MeditationMatchScreenRouteProp = MeditationMatch['route'];

type Profile = NativeStackScreenProps<StackParamList, 'Profile'>;
export type ProfileScreenNavigationProp = Profile['navigation'];
export type ProfileScreenRouteProp = Profile['route'];

export type MeditationProps = NativeStackScreenProps<
  StackParamList,
  'Meditation'
>;
export type MeditationScreenNavigationProp = MeditationProps['navigation'];
export type MeditationStackScreenProps<T extends keyof StackParamList> =
  StackScreenProps<StackParamList, T>;

export type MeditationFinishProps = NativeStackScreenProps<
  StackParamList,
  'MeditationFinish'
>;
export type MeditationFinishScreenNavigationProp =
  MeditationFinishProps['navigation'];

export type MeditationPlayerProps = NativeStackScreenProps<
  StackParamList,
  'MeditationPlayer'
>;
export type MeditationPlayerScreenNavigationProp =
  MeditationPlayerProps['navigation'];
export type MeditationPlayerStackScreenProps<T extends keyof StackParamList> =
  StackScreenProps<StackParamList, T>;

// Tab Navigation
export type TabParamList = {
  Home: undefined;
  Insight: undefined;
  Library: undefined;
  Learn: undefined;
};

type HomeProps = BottomTabNavigationProp<TabParamList, 'Home'>;
type InsightProps = BottomTabNavigationProp<TabParamList, 'Insight'>;
type LibraryProps = BottomTabNavigationProp<TabParamList, 'Library'>;
type LearnProps = BottomTabNavigationProp<TabParamList, 'Learn'>;

export type HomeScreenNavigationProp = HomeProps['navigate'];
export type InsightScreenNavigationProp = InsightProps['navigate'];
export type LibraryScreenNavigationProp = LibraryProps[];
export type LearnScreenNavigationProp = LearnProps['navigate'];

// File Picker
export interface PickedFile extends DocumentPickerResponse {
  normalizedName?: string;
}

// Meditation Data
type MeditationArtist = string;
export type MeditationFormattedDuration = string;
export type MeditationId = string;
export type MeditationBaseId = string;
type MeditationInstanceId = string;
export type MeditationName = string;
export type MeditationUrl = string;

export interface Meditation {
  artwork?: any;
  artist: MeditationArtist;
  backgroundImage?: any;
  color: string;
  formattedDuration: MeditationFormattedDuration;
  id: MeditationInstanceId;
  groupKey: MeditationGroupKey;
  groupName: MeditationGroupName;
  meditationId: MeditationId;
  meditationBreathId?: MeditationId;
  name: MeditationName;
  size?: MeditationSizes;
  url: MeditationUrl;
}

export interface MeditationBase {
  artwork?: any;
  artist: MeditationArtist;
  backgroundImage?: any;
  color?: string;
  formattedDuration: MeditationFormattedDuration;
  id: MeditationInstanceId;
  groupKey?: MeditationGroupKey;
  groupName: MeditationGroupName;
  meditationBaseId: MeditationId;
  name: MeditationName;
  size?:
    | MeditationSizes
    | GeneratingSeriesSizes
    | OtherSizes
    | SynchronizingSeriesSizes
    | WalkingMeditationSizes;
  type: MeditationTypes;
  url: any;
  updatedId?: string;
}

export enum MeditationTypes {
  Meditation,
  Breath,
  Heart,
}

export interface MeditationBaseMap {
  [key: string]: MeditationBase;
}

export interface MeditationMap {
  [key: string]: Meditation;
}

// Global
declare global {
  namespace ReactNavigation {
    interface RootParamList extends StackParamList {}
  }
}

export interface MeditationInstance {
  uid?: MeditationInstanceId;
  creationTime?: any;
  meditationBaseId: MeditationBaseId;
  meditationBaseBreathId?: MeditationBaseId;
  meditationBaseHeartId?: MeditationBaseId;
  meditationStartTime?: number;
  name: MeditationName;
  intention?: string;
  timeMeditated?: number;
  notes?: string;
  feedback?: string;
  type: MeditationTypes;
}

export type MeditationFilePath = {
  [key: string]: MeditationUrl;
};

export interface UnknownFileData {
  name: string | null;
  size: number | null;
  type: string | null;
  uri: string | null;
}
