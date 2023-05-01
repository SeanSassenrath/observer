import auth from '@react-native-firebase/auth';
import { appleAuth } from '@invertase/react-native-apple-authentication';

import AppleSSOButtonComponent from './component';

interface Props {
  setIsSigningIn(b: boolean): void;
}

const AppleSSOButton = (props: Props) => {
  const onPress = async () => {
    // 1). start a apple sign-in request
    console.log('sending request for apple auth');
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    console.log('appleAuthRequestResponse', appleAuthRequestResponse);

    // 2). if the request was successful, extract the token and nonce
    const { identityToken, nonce } = appleAuthRequestResponse;

    // can be null in some scenarios
    if (identityToken) {
      // 3). create a Firebase `AppleAuthProvider` credential
      const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

      // 4). use the created `AppleAuthProvider` credential to start a Firebase auth request,
      //     in this example `signInWithCredential` is used, but you could also call `linkWithCredential`
      //     to link the account to an existing user
      const userCredential = await auth().signInWithCredential(appleCredential);

      props.setIsSigningIn(true);
      // user is now signed in, any Firebase `onAuthStateChanged` listeners you have will trigger
      console.warn(`Firebase authenticated via Apple, UID: ${userCredential.user.uid}`);
    } else {
      // handle this - retry?
    }
  }

  return (
    <AppleSSOButtonComponent
      onPress={onPress}
    />
  )
}

export default AppleSSOButton;
