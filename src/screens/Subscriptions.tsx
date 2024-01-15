import {Layout, Text} from '@ui-kitten/components/ui';
import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

const SubscriptionsScreen = () => {
  console.log('Test');

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
