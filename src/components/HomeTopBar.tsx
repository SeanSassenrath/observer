import React from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Avatar, Icon, Layout, Text } from '@ui-kitten/components';

const SearchIcon = (props: any) => (
  <Icon {...props} style={styles.searchIcon} fill='#b2b2b2' name='search' />
);

export const HomeTopBar = () => (
  <Layout style={styles.topBarContainer}>
    <Layout level='4' style={styles.topBarVoidContainer}>
      <Text category='s2' style={styles.topBarVoidText}>2k in the void</Text>
    </Layout>
    <Layout style={styles.topBarActionItemsContainer}>
      <Layout level='2' style={styles.topBarSearchContainer}>
        <TouchableWithoutFeedback>
          <SearchIcon />
        </TouchableWithoutFeedback>
      </Layout>
      <Avatar source={require('../assets/avatar.jpeg')} />
    </Layout>
  </Layout>
)

const styles = StyleSheet.create({
  searchIcon: {
    height: 25,
    width: 25,
  },
  topBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginBottom: 20,
  },
  topBarActionItemsContainer: {
    flexDirection: 'row',
  },
  topBarSearchContainer: {
    alignItems: 'center',
    borderRadius: 50,
    justifyContent: 'center',
    marginHorizontal: 18,
    padding: 8,
  },
  topBarVoidContainer: {
    borderRadius: 25,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  topBarVoidText: {
    opacity: 0.7,
  }
})
