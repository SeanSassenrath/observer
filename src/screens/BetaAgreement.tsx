import {useContext, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Layout, Text} from '@ui-kitten/components/ui';
import {useNavigation} from '@react-navigation/native';

import Button from '../components/Button';
import {betaAgreement} from '../constants/betaAgreement';
import {fbUpdateUser} from '../fb/user';
import UserContext from '../contexts/userData';

const BetaAgreement = () => {
  const {user} = useContext(UserContext);
  const [isEnabled, setIsEnabled] = useState(false);
  const navigation = useNavigation();

  const onContinuePress = async () => {
    const now = new Date();
    const updatedUser = {
      ...user,
      betaAgreement: {
        hasAccepted: true,
        date: now,
      },
    };
    await fbUpdateUser(user.uid, updatedUser)
      .then(() => {
        navigation.navigate('AddMeditations');
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
    <Layout level="4" style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Layout level="4" style={styles.contentContainer}>
          <Layout level="4" style={styles.heroContainer}>
            <Text category="h4" style={styles.header}>
              Beta Agreement
            </Text>
            <Text category="s1" style={styles.disclaimer}>
              Please review and accept before proceeding.
            </Text>
            <Layout level="2" style={styles.faqBackground}>
              <ScrollView
                onScroll={({nativeEvent}) => {
                  if (isCloseToBottom(nativeEvent)) {
                    setIsEnabled(true);
                  }
                }}
                scrollEventThrottle={300}>
                <Text>{betaAgreement}</Text>
              </ScrollView>
            </Layout>
          </Layout>
          <Layout level="4" style={styles.bottomContainer}>
            <Button
              disabled={!isEnabled}
              onPress={onContinuePress}
              size="large"
              style={styles.button}>
              I Agree
            </Button>
          </Layout>
        </Layout>
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
});

export default BetaAgreement;
