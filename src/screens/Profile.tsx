import {useNavigation} from '@react-navigation/native';
import {Button, Icon, Layout, Text} from '@ui-kitten/components';
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

  const onFeedbackPress = () => {
    navigation.navigate('Feedback');
  };

  const onSignOut = async () => {
    const isSuccessfulSignOut = await signOut();
    if (isSuccessfulSignOut) {
      console.log('User signed out!');
      setUser(initialUserState);
      navigation.navigate('SignIn');
    }
  };

  return (
    <Layout level="4" style={styles.rootContainer}>
      <View style={styles.topBar}>
        <Pressable onPress={onBackPress}>
          <BackIcon />
        </Pressable>
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
      <View style={styles.bottomContainer}>
        <View>
          <Button style={styles.feedbackButton} onPress={onFeedbackPress}>
            Send Feedback
          </Button>
        </View>
        <Button
          status="basic"
          appearance="outline"
          onPress={onSignOut}
          style={styles.signOutButton}>
          Sign Out
        </Button>
      </View>
    </Layout>
  );
};

const iconStyles = StyleSheet.create({
  backIcon: {
    height: 40,
    width: 40,
  },
});

const styles = StyleSheet.create({
  bottomContainer: {
    flex: 2,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  feedbackButton: {
    borderRadius: 50,
    marginBottom: 20,
  },
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
  main: {
    flex: 7,
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
  signOutButton: {
    borderRadius: 50,
  },
  waveContainer: {
    overflow: 'hidden',
    height: 180,
    backgroundColor: 'transparent',
  },
});

export default Profile;
