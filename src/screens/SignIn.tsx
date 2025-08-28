import React, {useContext, useEffect, useState} from 'react';
import {
  Image,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  Layout,
  Modal,
  Spinner,
  Text,
  useStyleSheet,
} from '@ui-kitten/components';

import AppleSSOButton from '../components/AppleSSOButton';
import GoogleSSOButton from '../components/GoogleSSOButton';
import EmailSSOButton from '../components/EmailSSOButton';
import UserContext from '../contexts/userData';

const privacyPolicyUrl =
  'https://www.privacypolicies.com/live/0f561bf7-489c-4c02-830e-c8b276e128f9';

const SignInScreen = () => {
  const {user} = useContext(UserContext);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigation = useNavigation();
  const styles = useStyleSheet(themedStyles);

  useEffect(() => {
    redirectUser();
  }, [user.uid]);

  const redirectUser = () => {
    if (!user.uid) {
      return;
    } else {
      return setTimeout(() => {
        setIsSigningIn(false);

        if (!user.termsAgreement) {
          navigation.navigate('TermsAgreement');
        } else {
          //@ts-ignore
          navigation.navigate('TabNavigation', {screen: 'Home'});
        }
      }, 1000);
    }
  };

  const onPrivacyPolicyPress = async () => {
    await Linking.openURL(privacyPolicyUrl);
  };

  return (
    <Layout level="2" style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <View style={styles.headerImageBackground}>
              <Image
                source={require('../assets/app-icon.png')}
                style={imageStyles.headerImage}
              />
            </View>
          </View>
          <View style={styles.heroContainer}>
            <View style={styles.textContainer}>
              <Text category="s2" style={styles.textDescription}>
                Create an account to start your journey.
              </Text>
            </View>
          </View>
          <View style={styles.bottomContainer}>
            <View style={styles.buttonsContainer}>
              <GoogleSSOButton setIsSigningIn={setIsSigningIn} />
              {Platform.OS === 'ios' ? (
                <AppleSSOButton setIsSigningIn={setIsSigningIn} />
              ) : null}
              <EmailSSOButton setIsSigningIn={setIsSigningIn} navigation={navigation} />
            </View>
          </View>
          <Pressable onPress={onPrivacyPolicyPress}>
            <Text style={styles.privacyPolicy} category="s2">
              Privacy Policy
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <Modal visible={isSigningIn} backdropStyle={styles.backdrop}>
        <View style={styles.modalContainer}>
          <Spinner />
          <Text category="h6" style={styles.modalText}>
            Signing you in...
          </Text>
        </View>
      </Modal>
    </Layout>
  );
};

const imageStyles = StyleSheet.create({
  headerImage: {
    width: 80,
    height: 80,
  },
});

const themedStyles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  buttonsContainer: {
    flex: 5,
    alignItems: 'center',
    paddingTop: 16,
  },
  bottomContainer: {
    flex: 3,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  disclaimer: {
    marginBottom: 30,
    marginTop: 20,
  },
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
  headerImageBackground: {
    backgroundColor: 'transparent',
    shadowColor: 'rgba(160, 139, 247, 1)',
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  heroContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 3,
  },
  modalContainer: {
    width: 240,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    padding: 40,
  },
  modalText: {
    marginTop: 20,
  },
  privacyPolicy: {
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  textContainer: {
    alignItems: 'center',
  },
  textHeaderContainer: {
    marginBottom: 16,
  },
  textHeader: {
    textAlign: 'center',
  },
  textHeaderPrimary: {
    marginTop: 4,
    textAlign: 'center',
  },
  textDescription: {
    lineHeight: 23,
    textAlign: 'center',
    maxWidth: 300,
    opacity: 0.7,
  },
});

export default SignInScreen;
