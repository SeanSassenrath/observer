import React from 'react';
import {Button, Layout, Text} from '@ui-kitten/components';
import {SafeAreaView, StyleSheet} from 'react-native';

const AddMeditationsScreen = () => {
  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Layout style={styles.top} />
        <Layout style={styles.middle}>
          <Text category="h5">Add Meditations</Text>
          <Text category="s1">
            Sub header text explaining what is going on in this screen
          </Text>
        </Layout>
        <Layout style={styles.bottom}>
          <Button size="large">Add Meditations</Button>
          <Button appearance="ghost" size="large" status="basic">
            Skip
          </Button>
        </Layout>
      </SafeAreaView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  addButton: {
    color: 'white',
  },
  bottom: {
    flex: 3,
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
  },
  middle: {
    flex: 4,
    paddingHorizontal: 20,
  },
  skipButton: {
    color: 'white',
  },
  top: {
    flex: 3,
    paddingHorizontal: 20,
  },
});

export default AddMeditationsScreen;
