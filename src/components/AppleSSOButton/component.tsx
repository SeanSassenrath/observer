import { Image, StyleSheet } from 'react-native';
import { Text } from '@ui-kitten/components';

import Button from '../Button';

const softBlack = '#1B1C22';

interface Props {
  onPress(): void;
}

const AppleSSOButtonComponent = (props: Props) => (
  <Button
    onPress={props.onPress}
    size='large'
    status='control'
    style={styles.button}
  >
    <>
      <Image
        source={require('../../assets/apple-icon.png')}
        style={styles.ssoLogo}
      />
      <Text
        status='basic'
        category='s1'
        style={styles.ssoText}
      >
        Sign in with Apple
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
    height: 20,
    width: 20,
    marginTop: -2,
  },
  ssoText: {
    color: softBlack,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
})

export default AppleSSOButtonComponent;
