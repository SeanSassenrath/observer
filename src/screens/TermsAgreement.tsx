import React, {useContext, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Layout, Text} from '@ui-kitten/components/ui';
import {useNavigation} from '@react-navigation/native';

import Button from '../components/Button';
import {fbUpdateUser} from '../fb/user';
import UserContext from '../contexts/userData';
import {termsAgreement} from '../constants/termsAgreement';

const TermsAgreement = () => {
  const {user} = useContext(UserContext);
  const [isEnabled, setIsEnabled] = useState(false);
  const navigation = useNavigation();

  const onContinuePress = async () => {
    const now = new Date();
    const updatedUser = {
      ...user,
      termsAgreement: {
        hasAccepted: true,
        date: now,
      },
    };
    await fbUpdateUser(user.uid, updatedUser)
      .then(() => {
        if (user.betaAgreement?.hasAccepted) {
          // @ts-ignore
          navigation.navigate('TabNavigation', {screen: 'Home'});
        } else {
          navigation.navigate('PurchaseOnboarding');
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: any) => {
    const paddingToBottom = 100;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  return (
    <Layout level="2" style={styles.rootContainer}>
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.heroContainer}>
            <Text category="h4" style={styles.header}>
              Terms and Conditions Agreement
            </Text>
            <Text category="s1" style={styles.disclaimer}>
              Please review and accept before proceeding.
            </Text>
            <Layout level="1" style={styles.faqBackground}>
              <ScrollView
                onScroll={({nativeEvent}) => {
                  if (isCloseToBottom(nativeEvent)) {
                    setIsEnabled(true);
                  }
                }}
                scrollEventThrottle={300}>
                <Text>{termsAgreement}</Text>
              </ScrollView>
            </Layout>
          </View>
          <View style={styles.bottomContainer}>
            <Button
              disabled={!isEnabled}
              onPress={onContinuePress}
              size="large"
              style={styles.button}>
              I Agree
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 20,
  },
  button: {
    marginVertical: 16,
    width: 300,
  },
  buttonTest: {
    marginTop: 16,
    width: 300,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  disclaimer: {
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: '600',
  },
  faqBackground: {
    borderRadius: 16,
    paddingHorizontal: 20,
    marginVertical: 30,
    flex: 1,
  },
  faqItem: {
    lineHeight: 26,
    marginVertical: 12,
    opacity: 0.9,
    textDecorationLine: 'underline',
  },
  header: {
    marginVertical: 20,
    textAlign: 'center',
  },
  headerContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  helpIcon: {
    height: 32,
    opacity: 0.9,
    width: 32,
  },
  heroContainer: {
    alignItems: 'center',
    flex: 9,
    justifyContent: 'center',
  },
  rootContainer: {
    flex: 1,
  },
});

export default TermsAgreement;
