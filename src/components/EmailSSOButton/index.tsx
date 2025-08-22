import React from 'react';
import { Alert } from 'react-native';

import EmailSSOButtonComponent from './component';

interface Props {
  setIsSigningIn(signingIn: boolean): void;
}

const EmailSSOButton = (props: Props) => {
  const onPress = () => {
    // For now, show an alert that this feature is coming soon
    Alert.alert(
      'Coming Soon',
      'Email sign-in will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  return <EmailSSOButtonComponent onPress={onPress} />;
};

export default EmailSSOButton;