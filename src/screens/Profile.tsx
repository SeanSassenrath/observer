import {useNavigation} from '@react-navigation/native';
import {Icon, Popover, Text} from '@ui-kitten/components';
import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ProfileScreenNavigationProp, ProfileScreenRouteProp} from '../types';
import {SignOut} from '../fb/auth';

const brightWhite = '#fcfcfc';

const BackIcon = (props: any) => (
  <Icon
    {...props}
    style={iconStyles.backIcon}
    fill={brightWhite}
    name="arrow-back-outline"
  />
);

const MoreMenuIcon = (props: any) => (
  <Icon
    {...props}
    style={iconStyles.backIcon}
    fill={brightWhite}
    name="more-vertical-outline"
  />
);

interface Props {
  navigation: ProfileScreenNavigationProp;
  route: ProfileScreenRouteProp;
}

const Profile = (props: Props) => {
  const {route} = props;

  console.log('userId', route.params.userId);

  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const onBackPress = () => {
    navigation.goBack();
  };

  const renderMoreMenuButton = () => (
    <Pressable onPress={() => setIsMoreMenuOpen(true)}>
      <MoreMenuIcon />
    </Pressable>
  );

  return (
    <View style={styles.rootContainer}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <Pressable onPress={onBackPress}>
            <BackIcon />
          </Pressable>
          <Popover
            anchor={renderMoreMenuButton}
            visible={isMoreMenuOpen}
            placement={'left'}
            onBackdropPress={() => setIsMoreMenuOpen(false)}>
            <View style={styles.popoverContainer}>
              <Pressable onPress={SignOut}>
                <Text category="s1">Sign Out</Text>
              </Pressable>
            </View>
          </Popover>
        </View>
        <View style={styles.main} />
      </SafeAreaView>
    </View>
  );
};

const iconStyles = StyleSheet.create({
  backIcon: {
    height: 40,
    width: 40,
  },
});

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#0B0E18',
  },
  safeArea: {
    flex: 1,
  },
  topBar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  popoverContainer: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  main: {
    flex: 9,
  },
});

export default Profile;
