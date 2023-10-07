import React, {useContext} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {Avatar, Icon, Layout, useStyleSheet} from '@ui-kitten/components';

import UserContext from '../contexts/userData';
import StreakPill from './StreakPill';
import {getUserStreakData} from '../utils/streaks';
import {Wave} from './Wave/component';

const brightWhite = '#fcfcfc';

interface HomeTopBarProps {
  onAvatarPress(): void;
  onStreaksPress(): void;
  onAddMeditationsPress(): void;
  onWavePress(): void;
}

export const HomeTopBar = ({
  onAvatarPress,
  onStreaksPress,
  onAddMeditationsPress,
  onWavePress,
}: HomeTopBarProps) => {
  const {user} = useContext(UserContext);
  const styles = useStyleSheet(themedStyles);

  const streakData = getUserStreakData(user);

  const UserIcon = () => (
    <Icon style={styles.userIcon} fill={brightWhite} name="person" />
  );

  const PlusIcon = () => (
    <Icon style={styles.plusIcon} fill={brightWhite} name="plus-outline" />
  );

  return (
    <Layout style={styles.container}>
      <Layout style={styles.rowContainer}>
        <Pressable onPress={onStreaksPress}>
          <StreakPill streaks={streakData} />
        </Pressable>
        <Layout style={styles.topBarActionItemsContainer}>
          <Pressable onPress={onAddMeditationsPress}>
            <Layout style={styles.plusIconContainer}>
              <PlusIcon />
            </Layout>
          </Pressable>
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
      <Layout style={styles.waveContainer}>
        <Pressable onPress={onWavePress} style={styles.wavePress}>
          <Wave />
        </Pressable>
      </Layout>
    </Layout>
  );
};

const themedStyles = StyleSheet.create({
  plusIconContainer: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 20,
    width: 40,
    height: 40,
  },
  plusIcon: {
    height: 30,
    width: 30,
  },
  searchIcon: {
    height: 25,
    width: 25,
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 60,
    marginBottom: 20,
    backgroundColor: 'transparent',
    // backgroundColor: '#020306',
  },
  rowContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topBarActionItemsContainer: {
    backgroundColor: 'transparent',
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
  waveContainer: {
    overflow: 'hidden',
    flex: 1,
    height: 160,
    // backgroundColor: '#020306',
    backgroundColor: 'transparent',
  },
  wavePress: {
    flex: 1,
  },
});
