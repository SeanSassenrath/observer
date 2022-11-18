import React from 'react';
import { ImageBackground, SafeAreaView, StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components/ui';

const InsightScreen = () => (
  <Layout style={styles.rootContainer}>
    <SafeAreaView style={styles.contentContainer}>
      <ImageBackground source={require('../assets/stars.png')} style={styles.contentContainer}>
      <Text category='h6'>Insight Screen</Text>
      </ImageBackground>
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

export default InsightScreen;
