import auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import crashlytics from '@react-native-firebase/crashlytics';

import GoogleSSOButtonComponent from './component';

const GoogleSSOButton = () => {
  const navigation = useNavigation();

  const onPress = async () => {
    crashlytics().log('User signed in.');
    let userInfo;
    try {
      await GoogleSignin.hasPlayServices();
      userInfo = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);
      const { user } = userInfo;

      if (!user) {
        crashlytics().log('ERROR: Empty user object after sign up');
        return;
      }

      crashlytics().setUserId(user.id),

        await auth().signInWithCredential(googleCredential);

      navigation.navigate('BetaCheck');
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        crashlytics().recordError(error);
        // user cancelled the login flow
        // TODO: Add metric here for monitoring
        // TODO: Add error handling
      } else if (error.code === statusCodes.IN_PROGRESS) {
        crashlytics().recordError(error);

        // operation (e.g. sign in) is in progress already
        // TODO: Add metric here for monitoring
        // TODO: Add error handling
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        crashlytics().recordError(error);
        // play services not available or outdated
        // TODO: Add metric here for monitoring
        // TODO: Add error handling
      } else {
        crashlytics().recordError(error);

        // some other error happened
        // TODO: Add metric here for monitoring
        // TODO: Add error handling
      }
    }
  }

  return (
    <GoogleSSOButtonComponent
      onPress={onPress}
    />
  )
}

export default GoogleSSOButton;
