import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components/ui';

const LearnScreen = () => (
  <Layout style={styles.rootContainer}>
    <SafeAreaView style={styles.contentContainer}>
      <Text category='h6'>Learn Screen</Text>
    </SafeAreaView>
  </Layout>
)

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    flex: 1,
  }
})

export default LearnScreen;