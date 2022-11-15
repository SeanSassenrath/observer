import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { StackScreenProps } from '@react-navigation/stack';
import { DocumentPickerResponse } from 'react-native-document-picker';


// App Navigation
export type AppStackParamList = {
  Home: undefined;
  InitialUpload: undefined;
  SignIn: undefined;
  Welcome: undefined;
};

type HomeProps = NativeStackScreenProps<AppStackParamList, 'Home'>;
type InitialUploadProps = NativeStackScreenProps<AppStackParamList, 'InitialUpload'>;
type SignInProps = NativeStackScreenProps<AppStackParamList, 'SignIn'>;
type WelcomeProps = NativeStackScreenProps<AppStackParamList, 'Welcome'>;

export type HomeScreenNavigationProp = HomeProps['navigation'];
export type InitialUploadScreenNavigationProp = InitialUploadProps['navigation'];
export type SignInScreenNavigationProp = SignInProps['navigation'];
export type WelcomeScreenNavigationProp = WelcomeProps['navigation'];

// Home Navigation
export type HomeStackParamList = {
  HomeDashboard: undefined;
  Meditation: MeditationParams;
  MeditationPlayer: MeditationParams;
  MeditationSync: undefined;
};

interface MeditationParams {
  id: string,
}

export type MeditationProps = NativeStackScreenProps<HomeStackParamList, 'Meditation'>;
export type MeditationScreenNavigationProp = MeditationProps['navigation'];
export type MeditationStackScreenProps<T extends keyof HomeStackParamList> =
  StackScreenProps<HomeStackParamList, T>;

export type MeditationPlayerProps = NativeStackScreenProps<HomeStackParamList, 'MeditationPlayer'>;
export type MeditationPlayerScreenNavigationProp = MeditationProps['navigation'];
export type MeditationPlayerStackScreenProps<T extends keyof HomeStackParamList> =
  StackScreenProps<HomeStackParamList, T>;

export type MeditationSyncProps = NativeStackScreenProps<HomeStackParamList, 'MeditationSync'>;
export type MeditationSyncScreenNavigationProp = MeditationSyncProps['navigation'];

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
    interface RootParamList extends AppStackParamList { }
  }
}


