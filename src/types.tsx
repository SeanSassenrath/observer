import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { StackScreenProps } from '@react-navigation/stack';
import { DocumentPickerResponse } from 'react-native-document-picker';


// App Navigation
export type AppStackParamList = {
  Home: undefined;
  SignIn: undefined;
};

type HomeProps = NativeStackScreenProps<AppStackParamList, 'Home'>;
type SignInProps = NativeStackScreenProps<AppStackParamList, 'SignIn'>;

export type HomeScreenNavigationProp = HomeProps['navigation'];
export type SignInScreenNavigationProp = SignInProps['navigation'];

// Home Navigation
export type HomeStackParamList = {
  HomeDashboard: undefined;
  Meditation: Meditation;
  MeditationPlayer: Meditation;
  MeditationSync: undefined;
};

interface Meditation {
  name: string,
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

// Global
declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppStackParamList { }
  }
}


