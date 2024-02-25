import {Layout, Text} from '@ui-kitten/components';
import React from 'react';
import {Image, Pressable, SafeAreaView, StyleSheet, View} from 'react-native';

import _Button from '../components/Button';
import {useNavigation} from '@react-navigation/native';

const Purchase = () => {
  const navigation = useNavigation();

  const onLimitedVersionPress = () => {
    navigation.navigate('LimitedVersion');
  };

  return (
    <Layout level="2" style={styles.rootContainer}>
      <SafeAreaView style={styles.rootContainer}>
        <View style={styles.topContainer}>
          <Text category="h5" style={styles.headerText}>
            Let's get started!
          </Text>
          <Text category="s1" style={styles.priceText}>
            First 7 days free, then $2.91/month (billed $34.99 annually)
          </Text>
        </View>
        <View style={styles.midContainer}>
          <View style={styles.featureList}>
            <View style={styles.featureContainer}>
              <View style={styles.checkContainer}>
                <Image
                  source={require('../assets/check-mark.png')}
                  style={styles.check}
                />
              </View>
              <Text category="s1" style={styles.featureText}>
                All of your Dr. Joe Dispenza meditations in one place
              </Text>
            </View>
            <View style={styles.featureContainer}>
              <View style={styles.checkContainer}>
                <Image
                  source={require('../assets/check-mark.png')}
                  style={styles.check}
                />
              </View>
              <Text category="s1" style={styles.featureText}>
                Enhanced meditation player with seamless breathwork
              </Text>
            </View>
            <View style={styles.featureContainer}>
              <View style={styles.checkContainer}>
                <Image
                  source={require('../assets/check-mark.png')}
                  style={styles.check}
                />
              </View>
              <Text category="s1" style={styles.featureText}>
                Data insights on your meditation practice (history, streaks,
                thinkbox)
              </Text>
            </View>
            <View style={styles.featureContainer}>
              <View style={styles.checkContainer}>
                <Image
                  source={require('../assets/check-mark.png')}
                  style={styles.check}
                />
              </View>
              <Text category="s1" style={styles.featureText}>
                And more...
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <_Button size="large">Start my free trial</_Button>
          <Pressable onPress={onLimitedVersionPress}>
            <Text category="s1" style={styles.limitedText}>
              Continue with the limited version
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    flex: 2,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  check: {
    height: 40,
    width: 40,
  },
  checkContainer: {
    flex: 2,
  },
  featureContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  featureList: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 300,
    flex: 1,
  },
  featureText: {
    flex: 8,
  },
  headerText: {
    marginBottom: 20,
  },
  midContainer: {
    alignItems: 'center',
    flex: 5,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  limitedText: {
    marginTop: 30,
    opacity: 0.8,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  priceText: {
    textAlign: 'center',
  },
  rootContainer: {
    flex: 1,
  },
  topContainer: {
    alignItems: 'center',
    flex: 3,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});

export default Purchase;
