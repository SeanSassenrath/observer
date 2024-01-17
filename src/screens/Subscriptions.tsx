import React, {useEffect} from 'react';
import {Layout, Text} from '@ui-kitten/components/ui';
import {SafeAreaView, StyleSheet} from 'react-native';
import Purchases from 'react-native-purchases';

const SubscriptionsScreen = () => {
  console.log('Test');

  const fetchOfferings = async () => {
    console.log(' ');
    console.log('Fetching offerings');
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null) {
        console.log('HERE >>>', offerings.current);
        // Display current offering with offerings.current
      }
    } catch (e) {
      console.log('Fetching offerings error', e);
    }
  };

  useEffect(() => {
    fetchOfferings();
  }, []);

  return (
    <Layout style={styles.rootContainer}>
      <SafeAreaView style={styles.rootContainer}>
        <Layout style={styles.contentContainer}>
          <Text>Test</Text>
        </Layout>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 20,
  },
  rootContainer: {
    flex: 1,
  },
});

export default SubscriptionsScreen;
