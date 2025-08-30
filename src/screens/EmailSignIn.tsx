import React, {useContext, useEffect, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  Icon,
  Input,
  Layout,
  Modal,
  Spinner,
  Text,
  useStyleSheet,
} from '@ui-kitten/components';
import auth from '@react-native-firebase/auth';

import Button from '../components/Button';
import UserContext from '../contexts/userData';

const EmailSignInScreen = () => {
  const {user} = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignIn = async () => {
    setError('');
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSigningIn(true);

    try {
      if (isSignUp) {
        await auth().createUserWithEmailAndPassword(email, password);
      } else {
        await auth().signInWithEmailAndPassword(email, password);
      }
    } catch (authError: any) {
      setIsSigningIn(false);
      
      switch (authError.code) {
        case 'auth/user-not-found':
          setError('No account found with this email address');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password');
          break;
        case 'auth/email-already-in-use':
          setError('An account with this email already exists');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later.');
          break;
        default:
          setError('Something went wrong. Please try again.');
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!validateEmail(email)) {
      setError('Please enter your email address first');
      return;
    }

    try {
      await auth().sendPasswordResetEmail(email);
      setError('Password reset email sent! Check your inbox.');
    } catch (authError: any) {
      if (authError.code === 'auth/user-not-found') {
        setError('No account found with this email address');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleSignUpMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
  };

  const renderPasswordIcon = (props: any) => (
    <Pressable onPress={togglePasswordVisibility}>
      <Icon
        {...props}
        name={showPassword ? 'eye-off' : 'eye'}
      />
    </Pressable>
  );

  return (
    <Layout level="2" style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-back" width={24} height={24} fill="#FFF" />
            </Pressable>
          </View>

          <View style={styles.heroContainer}>
            <View style={styles.textContainer}>
              <Text category="h5" style={styles.textHeader}>
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Text>
              <Text category="s2" style={styles.textDescription}>
                {isSignUp 
                  ? 'Enter your email and create a password to get started.'
                  : 'Enter your email and password to continue.'
                }
              </Text>
            </View>
          </View>

          <View style={styles.formContainer}>
            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              style={styles.input}
              status={error && !validateEmail(email) ? 'danger' : 'basic'}
            />

            <Input
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              accessoryRight={renderPasswordIcon}
              autoCapitalize="none"
              autoComplete={isSignUp ? 'password-new' : 'password'}
              style={styles.input}
              status={error && password.length < 6 ? 'danger' : 'basic'}
            />

            {error ? (
              <Text status="danger" category="c1" style={styles.errorText}>
                {error}
              </Text>
            ) : null}

            <Button
              size="large"
              onPress={handleSignIn}
              disabled={isSigningIn}
              style={styles.signInButton}>
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>

            {!isSignUp && (
              <Pressable onPress={handleForgotPassword} style={styles.forgotPasswordContainer}>
                <Text style={styles.forgotPassword} category="s2">
                  Forgot Password?
                </Text>
              </Pressable>
            )}

            <View style={styles.switchModeContainer}>
              <Text category="s2" style={styles.switchModeText}>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </Text>
              <Pressable onPress={toggleSignUpMode}>
                <Text style={styles.switchModeLink} category="s2">
                  {isSignUp ? 'Sign In' : 'Create Account'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>

      <Modal visible={isSigningIn} backdropStyle={styles.backdrop}>
        <View style={styles.modalContainer}>
          <Spinner />
          <Text category="h6" style={styles.modalText}>
            {isSignUp ? 'Creating your account...' : 'Signing you in...'}
          </Text>
        </View>
      </Modal>
    </Layout>
  );
};

const themedStyles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 20,
    padding: 10,
    zIndex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  errorText: {
    marginBottom: 16,
    textAlign: 'center',
  },
  formContainer: {
    flex: 2,
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  forgotPassword: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    opacity: 0.7,
  },
  forgotPasswordContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  heroContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  input: {
    marginBottom: 16,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
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
  signInButton: {
    marginBottom: 16,
  },
  switchModeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchModeLink: {
    marginLeft: 4,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  switchModeText: {
    opacity: 0.7,
  },
  textContainer: {
    alignItems: 'center',
  },
  textDescription: {
    lineHeight: 23,
    textAlign: 'center',
    maxWidth: 300,
    opacity: 0.7,
    marginTop: 8,
  },
  textHeader: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default EmailSignInScreen;