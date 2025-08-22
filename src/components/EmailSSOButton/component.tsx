import {StyleSheet} from 'react-native';
import {Text, Icon} from '@ui-kitten/components';

import Button from '../Button';

const softBlack = '#1B1C22';

interface Props {
  onPress(): void;
}

const EmailSSOButtonComponent = (props: Props) => (
  <Button
    onPress={props.onPress}
    size="large"
    status="control"
    style={styles.button}>
    <>
      <Icon name="email-outline" width={24} height={24} fill={softBlack} />
      <Text status="basic" category="s1" style={styles.ssoText}>
        Sign in with Email
      </Text>
    </>
  </Button>
);

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
    opacity: 0.95,
    width: 300,
    height: 20,
  },
  ssoText: {
    color: softBlack,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default EmailSSOButtonComponent;
