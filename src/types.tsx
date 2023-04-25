import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { StackScreenProps } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { DocumentPickerResponse } from 'react-native-document-picker';

import { MeditationGroupKey, MeditationGroupName, MeditationSizes } from './constants/meditation';

// Stack Navigation
export type StackParamList = {
  Debug: undefined;
  InitialUpload: undefined;
  SignIn: undefined;
  Welcome: undefined;
  Meditation: MeditationParams;
  MeditationFinish: undefined;
  MeditationPlayer: MeditationParams;
  TabNavigation: undefined;
  AddFilesTutorial1: undefined;
  AddFilesTutorial2: undefined;
  AddFilesTutorial3: undefined;
  AddFilesTutorial4: undefined;
  BetaAgreement: undefined;
  BetaCheck: undefined;
  OnboardingStep1: undefined;
  OnboardingStep2: undefined;
};

interface MeditationParams {
  id: MeditationId,
  meditationBreathId?: MeditationId,
}

type SignInProps = NativeStackScreenProps<StackParamList, 'SignIn'>;
type BetaCheck = NativeStackScreenProps<StackParamList, 'BetaCheck'>;
type BetaAgreement = NativeStackScreenProps<StackParamList, 'BetaAgreement'>;
type OnboardingStep1 = NativeStackScreenProps<StackParamList, 'OnboardingStep1'>;
type OnboardingStep2 = NativeStackScreenProps<StackParamList, 'OnboardingStep2'>;

export type SignInScreenNavigationProp = SignInProps['navigation'];
export type BetaAgreementProp = BetaAgreement['navigation'];
export type BetaCheckProp = BetaCheck['navigation'];
export type OnboardingStep1Prop = OnboardingStep1['navigation'];
export type OnboardingStep2Prop = OnboardingStep2['navigation'];

export type MeditationProps = NativeStackScreenProps<StackParamList, 'Meditation'>;
export type MeditationScreenNavigationProp = MeditationProps['navigation'];
export type MeditationStackScreenProps<T extends keyof StackParamList> =
  StackScreenProps<StackParamList, T>;

export type MeditationFinishProps = NativeStackScreenProps<StackParamList, 'MeditationFinish'>;
export type MeditationFinishScreenNavigationProp = MeditationFinishProps['navigation'];

export type MeditationPlayerProps = NativeStackScreenProps<StackParamList, 'MeditationPlayer'>;
export type MeditationPlayerScreenNavigationProp = MeditationPlayerProps['navigation'];
export type MeditationPlayerStackScreenProps<T extends keyof StackParamList> =
  StackScreenProps<StackParamList, T>;

// Tab Navigation
export type TabParamList = {
  Home: undefined;
  Insight: undefined;
  Library: undefined;
  Learn: undefined;
}

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
  normalizedName?: string,
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
  artwork: any,
  artist: MeditationArtist,
  backgroundImage?: any,
  color: string,
  formattedDuration: MeditationFormattedDuration,
  id: MeditationInstanceId,
  groupKey: MeditationGroupKey,
  groupName: MeditationGroupName,
  meditationId: MeditationId,
  meditationBreathId?: MeditationId,
  name: MeditationName,
  size: MeditationSizes,
  url: MeditationUrl,
}

export interface MeditationBase {
  artwork: any,
  artist: MeditationArtist,
  backgroundImage?: any,
  color: string,
  formattedDuration: MeditationFormattedDuration,
  id: MeditationInstanceId,
  groupKey: MeditationGroupKey,
  groupName: MeditationGroupName,
  meditationBaseId: MeditationId,
  name: MeditationName,
  size: MeditationSizes,
  type: MeditationTypes,
  url: any,
}

export enum MeditationTypes {
  Meditation,
  Breath,
  Heart,
}

export interface MeditationBaseMap {
  [key: string]: MeditationBase,
}

export interface MeditationMap {
  [key: string]: Meditation,
}

// Global
declare global {
  namespace ReactNavigation {
    interface RootParamList extends StackParamList { }
  }
}

export interface MeditationInstance {
  uid?: MeditationInstanceId,
  creationTime?: any;
  meditationBaseId: MeditationBaseId,
  meditationBaseBreathId?: MeditationBaseId,
  meditationBaseHeartId?: MeditationBaseId,
  meditationStartTime?: number,
  name: MeditationName,
  intention?: string,
  timeMeditated?: number,
  notes?: string,
  feedback?: string,
  type: MeditationTypes,
}

export type MeditationFilePath = {
  [key: string]: MeditationUrl
}
