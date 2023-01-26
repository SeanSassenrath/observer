import React, { useContext } from 'react';
import { Pressable, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Avatar, Icon, Layout, Text, useStyleSheet } from '@ui-kitten/components';
import UserContext from '../contexts/userData';

interface HomeTopBarProps {
  onVoidPress(): void,
}

export const HomeTopBar = ({ onVoidPress }: HomeTopBarProps) => {
  const { user } = useContext(UserContext);
  const styles = useStyleSheet(themedStyles);

  return (
    <Layout style={styles.topBarContainer} level='4'>
      <Pressable onPress={onVoidPress}>
        <Layout style={styles.topBarVoidContainer}>
          <Text category='s2' style={styles.topBarVoidText}>2k in the void</Text>
        </Layout>
      </Pressable>
      <Layout style={styles.topBarActionItemsContainer} level='4'>
        { user.profile && user.profile.photoURL
          ? <Pressable>
              <Avatar source={{ uri: user.profile.photoURL }} />
            </Pressable>
          : null
        }
      </Layout>
    </Layout>
  )
}

const themedStyles = StyleSheet.create({
  searchIcon: {
    height: 25,
    width: 25,
  },
  topBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    backgroundColor: 'color-primary-700',
    borderColor: 'color-primary-800',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarVoidText: {
    opacity: 0.8,
  }
})
