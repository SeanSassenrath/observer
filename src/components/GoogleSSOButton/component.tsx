import { Image, StyleSheet } from 'react-native';
import { Text } from '@ui-kitten/components';

import Button from '../Button';

const softBlack = '#1B1C22';

interface Props {
  onPress(): void;
}

const GoogleSSOButtonComponent = (props: Props) => (
  <Button
    onPress={props.onPress}
    size='large'
    status='control'
    style={styles.button}
  >
    <>
      <Image
        source={require('../../assets/google-icon.png')}
        style={styles.ssoLogo}
      />
      <Text
        status='basic'
        category='s1'
        style={styles.ssoText}
      >
        Sign in with Google
      </Text>
    </>
  </Button>
)

const styles = StyleSheet.create({
  button: {
    marginVertical: 16,
    opacity: 0.95,
    width: 300,
    height: 20,
  },
  ssoLogo: {
    height: 28,
    width: 28,
  },
  ssoText: {
    color: softBlack,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
})

export default GoogleSSOButtonComponent;
