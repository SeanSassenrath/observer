import React from 'react';
import {Layout, Text, useStyleSheet} from '@ui-kitten/components';
import {Image, StyleSheet} from 'react-native';

import {UserStreaks} from '../../contexts/userData';

interface Props {
  streaks: UserStreaks;
}

export const StreakPillComponent = (props: Props) => {
  const {streaks} = props;
  const styles = useStyleSheet(themedStyles);

  const days = streaks.current === 1 ? 'day' : 'days';
  const isActive = streaks.current && streaks.current > 0;

  return (
    <Layout level="4">
      <Layout
        style={
          isActive
            ? {...styles.pillContainer, ...styles.active}
            : styles.pillContainer
        }>
        <Image
          style={imageStyles.image}
          source={require('../../assets/fire.png')}
        />
        <Text category="s1">{`${streaks.current} ${days}`}</Text>
      </Layout>
    </Layout>
  );
};

const imageStyles = StyleSheet.create({
  image: {
    height: 24,
    width: 24,
    marginRight: 6,
  },
});

const themedStyles = StyleSheet.create({
  pillContainer: {
    alignItems: 'center',
    borderRadius: 100,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  active: {
    backgroundColor: 'color-primary-600',
  },
});
