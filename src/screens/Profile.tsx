import {useNavigation} from '@react-navigation/native';
import {Icon, Layout, Popover, Text} from '@ui-kitten/components';
import React, {useContext, useEffect, useState} from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';

import {ProfileScreenNavigationProp, ProfileScreenRouteProp} from '../types';
import {signOut} from '../fb/auth';
import {
  getTotalMeditationCount,
  getTotalMeditationTime,
  getUserProfile,
} from '../utils/profile';
import UserContext, {User, initialUserState} from '../contexts/userData';

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
    style={iconStyles.verticalIcon}
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
  const {userId} = route.params;

  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const {user, setUser} = useContext(UserContext);

  const [userProfile, setUserProfile] = useState({} as User);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  useEffect(() => {
    const _userProfile = getUserProfile(userId, user);

    if (_userProfile) {
      setUserProfile(_userProfile);
    }
  }, [user, userId, userProfile]);

  const totalMeditationCount = getTotalMeditationCount(userProfile);

  const totalMeditationTime = getTotalMeditationTime(userProfile);

  const onBackPress = () => {
    navigation.goBack();
  };

  const onSignOut = async () => {
    const isSuccessfulSignOut = await signOut();
    if (isSuccessfulSignOut) {
      console.log('User signed out!');
      setUser(initialUserState);
      navigation.navigate('SignIn');
    }
  };

  const renderMoreMenuButton = () => (
    <Pressable onPress={() => setIsMoreMenuOpen(true)}>
      <MoreMenuIcon />
    </Pressable>
  );

  return (
    <Layout level="4" style={styles.rootContainer}>
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
            <Pressable onPress={onSignOut}>
              <Text category="s1">Sign Out</Text>
            </Pressable>
          </View>
        </Popover>
      </View>
      <View style={styles.main}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {userProfile?.profile?.photoURL ? (
              <Image
                source={{uri: userProfile?.profile?.photoURL}}
                style={styles.avatar}
              />
            ) : null}
          </View>
          <View style={styles.profileMetaContainer}>
            <View style={styles.nameContainer}>
              <Text style={styles.firstName} category="h5">
                {userProfile?.profile?.firstName}
              </Text>
              <Text category="h5">{userProfile?.profile?.lastName}</Text>
            </View>
            {/* <View>
                <Text category="s2">Joined: 10/21/20</Text>
              </View> */}
          </View>
        </View>
        <View style={styles.profileMeditationsContainer}>
          <View style={styles.profileMeditationsSectionContainer}>
            <Text style={styles.profileMetaSectionLabel} category="s1">
              Meditations
            </Text>
            <Text category="h6">{totalMeditationCount}</Text>
          </View>
          <View style={styles.profileMeditationsSectionContainer}>
            <Text style={styles.profileMetaSectionLabel} category="s1">
              Time Meditated
            </Text>
            <Text category="h6">{totalMeditationTime}</Text>
          </View>
        </View>
        {/* <View style={styles.waveContainer}>
          <Wave />
        </View> */}
      </View>
    </Layout>
  );
};

const iconStyles = StyleSheet.create({
  backIcon: {
    height: 40,
    width: 40,
  },
  verticalIcon: {
    height: 34,
    width: 34,
  },
});

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  topBar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 40,
    marginBottom: 20,
  },
  popoverContainer: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  main: {
    flex: 9,
    paddingHorizontal: 20,
  },
  profileHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 40,
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(48,55,75,0.6)',
    borderRadius: 100,
    height: 100,
    marginRight: 20,
    width: 100,
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 100,
  },
  profileMetaContainer: {
    flexDirection: 'column',
  },
  nameContainer: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  firstName: {
    marginBottom: 4,
  },
  profileMeditationsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  profileMeditationsSectionContainer: {
    alignItems: 'center',
    borderRadius: 10,
    flex: 0.45,
    backgroundColor: 'rgba(48,55,75,0.6)',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  profileMetaSectionLabel: {
    marginBottom: 4,
  },
  waveContainer: {
    overflow: 'hidden',
    height: 180,
    backgroundColor: 'transparent',
  },
});

export default Profile;
