import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { StackScreenProps } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { DocumentPickerResponse } from 'react-native-document-picker';

// Stack Navigation
export type StackParamList = {
  InitialUpload: undefined;
  SignIn: undefined;
  Welcome: undefined;
  Meditation: MeditationParams;
  MeditationPlayer: MeditationParams;
  TabNavigation: undefined;
};

interface MeditationParams {
  id: string,
}

type InitialUploadProps = NativeStackScreenProps<StackParamList, 'InitialUpload'>;
type SignInProps = NativeStackScreenProps<StackParamList, 'SignIn'>;
type WelcomeProps = NativeStackScreenProps<StackParamList, 'Welcome'>;

export type InitialUploadScreenNavigationProp = InitialUploadProps['navigation'];
export type SignInScreenNavigationProp = SignInProps['navigation'];
export type WelcomeScreenNavigationProp = WelcomeProps['navigation'];

export type MeditationProps = NativeStackScreenProps<StackParamList, 'Meditation'>;
export type MeditationScreenNavigationProp = MeditationProps['navigation'];
export type MeditationStackScreenProps<T extends keyof StackParamList> =
  StackScreenProps<StackParamList, T>;

export type MeditationPlayerProps = NativeStackScreenProps<StackParamList, 'MeditationPlayer'>;
export type MeditationPlayerScreenNavigationProp = MeditationProps['navigation'];
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

export type HomeScreenNavigationProp = HomeProps['getParent'];
export type InsightScreenNavigationProp = InsightProps['getParent'];
export type LibraryScreenNavigationProp = LibraryProps['getParent'];
export type LearnScreenNavigationProp = LearnProps['getParent'];

// export type MeditationSyncProps = NativeStackScreenProps<HomeStackParamList, 'MeditationSync'>;
// export type MeditationSyncScreenNavigationProp = MeditationSyncProps['navigation'];

// File Picker
export interface PickedFile extends DocumentPickerResponse {
  normalizedName?: string,
}

// Meditation Data
export interface Meditation {
  artist: string,
  id: string,
  name: string,
  size: number,
}

// Global
declare global {
  namespace ReactNavigation {
    interface RootParamList extends StackParamList { }
  }
}


