import {Layout, Text} from '@ui-kitten/components';
import React from 'react';
import {Image, SafeAreaView, StyleSheet, View} from 'react-native';

import _Button from '../components/Button';

const LimitedVersion = () => {
  return (
    <Layout level="2" style={styles.rootContainer}>
      <SafeAreaView style={styles.rootContainer}>
        <View style={styles.topContainer}>
          <Text category="h5" style={styles.headerText}>
            Limited Version
          </Text>
          <Text category="s1" style={styles.priceText}>
            Not ready to subscribe? Try out the basic features with the limited
            version.
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
                Add up to 2 meditations (including breathwork){' '}
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
                Standard meditation player
              </Text>
            </View>
            <View style={styles.featureContainerFaint}>
              <View style={styles.checkContainer}>
                <Image
                  source={require('../assets/check-mark.png')}
                  style={styles.check}
                />
              </View>
              <Text category="s1" style={styles.featureText}>
                NOT INCLUDED: Data insights on your meditation practice
                (history, streaks, thinkbox)
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <_Button size="large">Continue with limited version</_Button>
          <_Button
            size="large"
            appearance="outline"
            status="basic"
            style={styles.freeTrialButton}>
            Start free trial instead
          </_Button>
        </View>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    flex: 3,
    justifyContent: 'center',
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
  featureContainerFaint: {
    alignItems: 'center',
    flexDirection: 'row',
    opacity: 0.3,
  },
  featureList: {
    alignItems: 'center',
    justifyContent: 'space-around',
    width: 300,
    flex: 1,
  },
  featureText: {
    flex: 8,
  },
  freeTrialButton: {
    marginTop: 20,
  },
  headerText: {
    marginBottom: 20,
  },
  midContainer: {
    alignItems: 'center',
    flex: 4,
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
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});

export default LimitedVersion;
