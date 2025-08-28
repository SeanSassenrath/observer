import React from 'react';

import EmailSSOButtonComponent from './component';

interface Props {
  setIsSigningIn(signingIn: boolean): void;
  navigation: any;
}

const EmailSSOButton = (props: Props) => {
  const onPress = () => {
    props.navigation.navigate('EmailSignIn');
  };

  return <EmailSSOButtonComponent onPress={onPress} />;
};

export default EmailSSOButton;