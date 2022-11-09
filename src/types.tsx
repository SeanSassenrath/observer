import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { StackScreenProps } from '@react-navigation/stack';

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
};

interface Meditation {
  name: string,
}

export type MeditationProps = NativeStackScreenProps<HomeStackParamList, 'Meditation'>;
export type MeditationScreenNavigationProp = MeditationProps['navigation'];
export type MeditationStackScreenProps<T extends keyof HomeStackParamList> =
  StackScreenProps<HomeStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppStackParamList { }
  }
}


