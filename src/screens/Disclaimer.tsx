import {Layout, Text} from '@ui-kitten/components';
import React from 'react';
import {Image, SafeAreaView, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import _Button from '../components/Button';

const Disclaimer = () => {
  const navigation = useNavigation();

  const onPress = () => {
    // Update Firbase with confirmation
    navigation.navigate('PurchaseOnboarding');
  };

  return (
    <Layout level="2" style={styles.rootContainer}>
      <SafeAreaView style={styles.rootContainer}>
        <View style={styles.midContainer}>
          <View style={styles.headerContainer}>
            <Image
              source={require('../assets/app-icon.png')}
              style={imageStyles.appLogo}
            />
            <Text category="h4">Unlimited App</Text>
            <Text category="h4">Disclaimer</Text>
          </View>
          <View>
            <Text category="s1" style={styles.descriptionContainer}>
              The Unlimited App does not provide or sell any meditations. You
              must own meditation files to use this app.
            </Text>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <_Button onPress={onPress} size="large">
            Continue
          </_Button>
        </View>
      </SafeAreaView>
    </Layout>
  );
};

const imageStyles = StyleSheet.create({
  appLogo: {
    height: 100,
    width: 100,
    marginBottom: 20,
  },
});

const styles = StyleSheet.create({
  descriptionContainer: {
    marginBottom: 30,
    textAlign: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  rootContainer: {
    flex: 1,
  },
  midContainer: {
    alignItems: 'center',
    flex: 9,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  bottomContainer: {
    justifyContent: 'flex-start',
    flex: 1,
    paddingHorizontal: 20,
  },
});

export default Disclaimer;
