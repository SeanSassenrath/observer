import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AppStackParamList = {
  Home: undefined;
  SignIn: undefined;
};

type HomeProps = NativeStackScreenProps<AppStackParamList, 'Home'>;
type SignInProps = NativeStackScreenProps<AppStackParamList, 'SignIn'>;

export type HomeScreenNavigationProp = HomeProps['navigation'];
export type SignInScreenNavigationProp = SignInProps['navigation'];
