import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {Button, Icon, Layout, Modal, Text} from '@ui-kitten/components';
import React, {useContext, useEffect, useState} from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import {useStyleSheet} from '@ui-kitten/components';
import {usePostHog} from 'posthog-react-native';

import UserContext from '../contexts/userData';
import {useFeatureFlag} from '../hooks/useFeatureFlag';
import {brightWhite} from '../constants/colors';
import _Button from './Button';

const BETA_ENROLLED_KEY = '@beta_enrolled';
const BETA_DISMISSED_KEY = '@beta_dismissed';
const TELEGRAM_INVITE_URL = 'https://t.me/+PLACEHOLDER';

type ModalScreen = 'invite' | 'confirmation';

const SparklesIcon = () => (
  <Icon style={themedStyles.sparklesIcon} fill={brightWhite} name="star" />
);

const BetaInviteModal = () => {
  const {user} = useContext(UserContext);
  const posthog = usePostHog();
  const styles = useStyleSheet(themedStyles);
  const isEligible = useFeatureFlag('beta-invite');
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);
  const [hasEnrolled, setHasEnrolled] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);
  const [hasCompletedInviteFlow, setHasCompletedInviteFlow] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [screen, setScreen] = useState<ModalScreen>('invite');

  useEffect(() => {
    let isMounted = true;

    const loadStorageState = async () => {
      try {
        const [enrolledValue, dismissedValue] = await Promise.all([
          AsyncStorage.getItem(BETA_ENROLLED_KEY),
          AsyncStorage.getItem(BETA_DISMISSED_KEY),
        ]);

        if (!isMounted) {
          return;
        }

        setHasEnrolled(enrolledValue === 'true');
        setHasDismissed(dismissedValue === 'true');
      } catch (error) {
        console.error('Error loading beta invite state:', error);
      } finally {
        if (isMounted) {
          setHasLoadedStorage(true);
        }
      }
    };

    loadStorageState();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedStorage || !user.uid) {
      return;
    }

    if (hasCompletedInviteFlow) {
      return;
    }

    const shouldShowInvite = isEligible && !hasEnrolled && !hasDismissed;
    setIsVisible(shouldShowInvite);
    if (shouldShowInvite) {
      setScreen('invite');
    }
  }, [
    hasCompletedInviteFlow,
    hasDismissed,
    hasEnrolled,
    hasLoadedStorage,
    isEligible,
    user.uid,
  ]);

  useEffect(() => {
    if (isVisible && screen === 'invite') {
      posthog.capture('beta_invite_shown');
    }
  }, [isVisible, posthog, screen]);

  const onAcceptPress = async () => {
    const enrolledAt = new Date().toISOString();
    const betaEmail = auth().currentUser?.email ?? user.profile?.email ?? null;

    try {
      await AsyncStorage.setItem(BETA_ENROLLED_KEY, 'true');
      setHasCompletedInviteFlow(true);
      setHasEnrolled(true);
      posthog.identify(user.uid, {
        beta_enrolled: true,
        beta_email: betaEmail,
        beta_enrolled_at: enrolledAt,
      });
      posthog.capture('beta_invite_accepted', {
        beta_email: betaEmail,
      });
      setIsVisible(true);
      setScreen('confirmation');
    } catch (error) {
      console.error('Error accepting beta invite:', error);
    }
  };

  const onDismissPress = async () => {
    try {
      await AsyncStorage.setItem(BETA_DISMISSED_KEY, 'true');
      setHasCompletedInviteFlow(true);
      setHasDismissed(true);
      posthog.capture('beta_invite_dismissed');
      setIsVisible(false);
    } catch (error) {
      console.error('Error dismissing beta invite:', error);
    }
  };

  const onJoinTelegramPress = async () => {
    posthog.capture('beta_telegram_link_tapped');
    await Linking.openURL(TELEGRAM_INVITE_URL);
  };

  const onDonePress = () => {
    setIsVisible(false);
  };

  if (!hasLoadedStorage || !user.uid) {
    return null;
  }

  return (
    <Modal
      animationType={'slide'}
      visible={isVisible}
      backdropStyle={styles.backdrop}
      onBackdropPress={screen === 'invite' ? onDismissPress : onDonePress}>
      <Layout level="2" style={styles.rootContainer}>
        <Layout level="2" style={styles.iconContainer}>
          <View style={styles.iconRingOuter}>
            <View style={styles.iconRingMiddle}>
              <View style={styles.iconRingInner}>
                <SparklesIcon />
              </View>
            </View>
          </View>
        </Layout>
        {screen === 'invite' ? (
          <Layout level="2">
            <Text category="h5" style={styles.title}>
              Join the Beta
            </Text>
            <Text category="s1" style={styles.body}>
              You&apos;re one of our most dedicated meditators. Want early
              access to new features?
            </Text>
            <_Button onPress={onAcceptPress} style={styles.primaryButton}>
              Join the Beta
            </_Button>
            <Button
              appearance="ghost"
              status="basic"
              onPress={onDismissPress}
              style={styles.secondaryButton}>
              Not Now
            </Button>
          </Layout>
        ) : (
          <Layout level="2">
            <Text category="h5" style={styles.title}>
              You&apos;re in!
            </Text>
            <Text category="s1" style={styles.body}>
              Join our Telegram community for beta builds and to share feedback.
            </Text>
            <_Button
              onPress={onJoinTelegramPress}
              style={styles.primaryButton}>
              Join Telegram
            </_Button>
            <Button
              appearance="ghost"
              status="basic"
              onPress={onDonePress}
              style={styles.secondaryButton}>
              Done
            </Button>
          </Layout>
        )}
      </Layout>
    </Modal>
  );
};

const themedStyles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  body: {
    lineHeight: 24,
    marginBottom: 6,
    opacity: 0.85,
    textAlign: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconRingInner: {
    alignItems: 'center',
    backgroundColor: 'rgba(187,111,221, 0.3)',
    borderRadius: 100,
    height: 84,
    justifyContent: 'center',
    width: 84,
  },
  iconRingMiddle: {
    alignItems: 'center',
    backgroundColor: 'rgba(187,111,221, 0.2)',
    borderRadius: 100,
    height: 100,
    justifyContent: 'center',
    width: 100,
  },
  iconRingOuter: {
    alignItems: 'center',
    backgroundColor: 'rgba(187,111,221, 0.1)',
    borderRadius: 100,
    height: 114,
    justifyContent: 'center',
    width: 114,
  },
  primaryButton: {
    marginBottom: 12,
    marginTop: 24,
  },
  rootContainer: {
    borderRadius: 12,
    justifyContent: 'center',
    paddingBottom: 18,
    paddingHorizontal: 22,
    paddingTop: 28,
    width: 350,
  },
  secondaryButton: {
    marginBottom: 4,
  },
  sparklesIcon: {
    height: 42,
    width: 42,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default BetaInviteModal;
