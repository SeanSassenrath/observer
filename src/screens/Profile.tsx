import {Icon} from '@ui-kitten/components';
import React from 'react';
import {StyleSheet, View} from 'react-native';

const brightWhite = '#fcfcfc';

const BackIcon = (props: any) => (
  <Icon
    {...props}
    style={iconStyles}
    fill={brightWhite}
    name="arrow-back-outline"
  />
);

const Profile = () => {
  return (
    <View>
      <View style={styles.topBar}>
        <BackIcon />
      </View>
    </View>
  );
};

const iconStyles = StyleSheet.create({
  backIcon: {
    height: 32,
    width: 32,
  },
});

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
  },
});

export default Profile;
