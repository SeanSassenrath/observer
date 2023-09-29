import React, {useContext} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {Avatar, Icon, Layout, useStyleSheet} from '@ui-kitten/components';

import UserContext from '../contexts/userData';
import StreakPill from './StreakPill';
import {getUserStreakData} from '../utils/streaks';

const brightWhite = '#fcfcfc';

interface HomeTopBarProps {
  onAvatarPress(): void;
  onStreaksPress(): void;
}

export const HomeTopBar = ({
  onAvatarPress,
  onStreaksPress,
}: HomeTopBarProps) => {
  const {user} = useContext(UserContext);
  const styles = useStyleSheet(themedStyles);

  const streakData = getUserStreakData(user);

  const UserIcon = () => (
    <Icon style={styles.userIcon} fill={brightWhite} name="person" />
  );

  return (
    <Layout style={styles.topBarContainer} level="4">
      <Pressable onPress={onStreaksPress}>
        <StreakPill streaks={streakData} />
      </Pressable>
      <Layout style={styles.topBarActionItemsContainer} level="4">
        <Pressable onPress={onAvatarPress}>
          {user.profile && user.profile.photoURL ? (
            <Avatar source={{uri: user.profile.photoURL}} />
          ) : (
            <Layout style={styles.userIconContainer}>
              <UserIcon />
            </Layout>
          )}
        </Pressable>
      </Layout>
    </Layout>
  );
};

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
  },
  userIconContainer: {
    alignItems: 'center',
    borderRadius: 50,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  userIcon: {
    height: 25,
    width: 25,
  },
});
