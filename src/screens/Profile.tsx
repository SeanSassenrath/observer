import {useNavigation} from '@react-navigation/native';
import {
  Button,
  Divider,
  Icon,
  Input,
  Layout,
  Text,
  Toggle,
} from '@ui-kitten/components';
import React, {useContext, useEffect, useState} from 'react';
import {
  AppState,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import Toast from 'react-native-toast-message';
import messaging from '@react-native-firebase/messaging';

import {ProfileScreenNavigationProp, ProfileScreenRouteProp} from '../types';
import {signOut} from '../fb/auth';
import {getUserProfile} from '../utils/profile';
import UserContext, {User, initialUserState} from '../contexts/userData';
import {brightWhite} from '../constants/colors';
import {fbUpdateUser} from '../fb/user';
import {Action, Noun, profileNotifEnabledSendEvent} from '../analytics';
import {getIsSubscribed} from '../utils/user/user';
import {useFetchOffering} from '../hooks/useFetchOffering';

const EMPTY_STRING = '';

const BackIcon = (props: any) => (
  <Icon
    {...props}
    style={iconStyles.backIcon}
    fill={brightWhite}
    name="arrow-back-outline"
  />
);

const RightArrow = (props: any) => (
  <Icon
    {...props}
    style={iconStyles.rightArrow}
    fill={brightWhite}
    name="arrow-ios-forward-outline"
  />
);

const EditIcon = () => (
  <Icon style={iconStyles.editIcon} fill={brightWhite} name="edit-outline" />
);

const UserIcon = () => (
  <Icon style={iconStyles.userIcon} fill={brightWhite} name="person" />
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
  const [name, setName] = useState(EMPTY_STRING);
  const [isNotifEnabled, setIsNotifEnabled] = useState(false);

  const offering = useFetchOffering();

  const isSubscribed = getIsSubscribed(user);

  useEffect(() => {
    const _userProfile = getUserProfile(userId, user);

    if (_userProfile) {
      setUserProfile(_userProfile);
      setName(_userProfile.profile.displayName);
    }

    updateIsNotifEnabled();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        updateIsNotifEnabled();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [user, userId, userProfile]);

  const onBackPress = () => {
    navigation.goBack();
  };

  const onFeedbackPress = () => {
    navigation.navigate('Feedback');
  };

  const onSubscriptionPress = () => {
    if (!isSubscribed) {
      navigation.navigate('Purchase', {offering});
    } else {
      Linking.openURL('App-prefs:APPLE_ACCOUNT&path=SUBSCRIPTIONS');
    }
  };

  const onSignOut = async () => {
    const isSuccessfulSignOut = await signOut();
    if (isSuccessfulSignOut) {
      setUser(initialUserState);
      navigation.navigate('SignIn');
    }
  };

  const updateIsNotifEnabled = async () => {
    const authorizationStatus = await messaging().hasPermission();

    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      setIsNotifEnabled(true);
    } else if (authorizationStatus === messaging.AuthorizationStatus.DENIED) {
      setIsNotifEnabled(false);
    }
  };

  const onNotifToggleChange = async () => {
    const authorizationStatus = await messaging().hasPermission();

    if (authorizationStatus === messaging.AuthorizationStatus.NOT_DETERMINED) {
      await messaging().requestPermission();
    } else if (!isNotifEnabled) {
      await profileNotifEnabledSendEvent(Action.ENABLE, Noun.BUTTON, {
        isEnabled: true,
      });
      Linking.openSettings();
    } else if (isNotifEnabled) {
      await profileNotifEnabledSendEvent(Action.DENIED, Noun.BUTTON, {
        isEnabled: false,
      });
      Linking.openSettings();
    }
  };

  const onChangeText = (updatedName: string) => {
    setName(updatedName);
  };

  const onBlur = async () => {
    await fbUpdateUser(user.uid, {
      'profile.displayName': name,
    });

    setUser({
      ...user,
      profile: {
        ...user.profile,
        displayName: name,
      },
    });
  };

  //https://elazizi.com/posts/how-to-build-an-image-picker-in-react-native/
  const onAvatarPress = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      cropperCircleOverlay: true,
    }).then(async image => {
      const filePathArray = image.path.split('/');
      const fileName = filePathArray.slice(-1);
      const refString = `${user.uid}/profilePicture/${fileName}`;

      const ref = storage().ref(refString);

      Toast.show({
        type: 'info',
        text1: 'Adding photo',
        text2: 'Please wait',
        position: 'bottom',
        bottomOffset: 100,
        autoHide: false,
      });

      await ref.putFile(image.path);

      const url = await ref.getDownloadURL();

      await fbUpdateUser(user.uid, {
        'profile.photoURL': url,
      });

      setUser({
        ...user,
        profile: {
          ...user.profile,
          photoURL: url,
        },
      });

      Toast.hide();

      Toast.show({
        type: 'success',
        text1: 'Photo added',
        text2: 'Nicely done!',
        position: 'bottom',
        bottomOffset: 100,
        visibilityTime: 3000,
      });
    });
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
            ) : (
              <UserIcon />
            )}
            <Pressable onPress={onAvatarPress} style={styles.editIconContainer}>
              <View>
                <EditIcon />
              </View>
            </Pressable>
          </View>
          <View style={styles.nameContainer}>
            <Input
              value={name}
              placeholder="Display Name"
              onBlur={onBlur}
              onChangeText={onChangeText}
              style={styles.input}
              textStyle={styles.inputText}
            />
          </View>
        </View>
        {isSubscribed ? (
          <View style={styles.toggleRowContainer}>
            <Text category="s1">Enable Notifications</Text>
            <Toggle
              checked={isNotifEnabled}
              status="primary"
              onChange={onNotifToggleChange}
            />
          </View>
        ) : null}
        {/* <View style={styles.waveContainer}>
          <Wave />
        </View> */}
        <View style={styles.profileAction}>
          <Divider style={styles.divider} />
          <Pressable onPress={onFeedbackPress}>
            <View style={styles.profileActionContent}>
              <View>
                <Text category="s1">Send Feedback</Text>
              </View>
              <View>
                <RightArrow />
              </View>
            </View>
          </Pressable>
          <Divider style={styles.divider} />
          <Pressable onPress={onSubscriptionPress}>
            <View style={styles.profileActionContent}>
              <View>
                <Text category="s1">
                  {isSubscribed
                    ? 'Manage Subscription'
                    : 'Purchase Subscription'}
                </Text>
              </View>
              <View>
                <RightArrow />
              </View>
            </View>
          </Pressable>
          <Divider style={styles.divider} />
        </View>
      </View>
      <View style={styles.bottomContainer}>
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
  editIcon: {
    height: 40,
    width: 40,
  },
  rightArrow: {
    height: 30,
    width: 30,
  },
  userIcon: {
    height: 60,
    width: 60,
  },
});

const styles = StyleSheet.create({
  bottomContainer: {
    flex: 1,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  divider: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginVertical: 20,
  },
  editIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    height: 100,
    position: 'absolute',
    width: 100,
    backgroundColor: 'rgba(48,55,75,0.6)',
  },
  input: {
    borderRadius: 10,
    borderColor: 'transparent',
    paddingVertical: 10,
    width: '100%',
  },
  inputText: {
    paddingVertical: 8,
    fontSize: 18,
    borderRadius: 20,
  },
  nameContainer: {
    flex: 1,
  },
  nameStatus: {
    opacity: 0.3,
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
    paddingHorizontal: 20,
    paddingTop: 40,
    marginBottom: 20,
  },
  main: {
    flex: 7,
    paddingHorizontal: 20,
  },
  profileAction: {
    opacity: 0.8,
  },
  profileActionContent: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  signOutButton: {
    borderRadius: 50,
  },
  toggleRowContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  waveContainer: {
    overflow: 'hidden',
    height: 180,
    backgroundColor: 'transparent',
  },
});

export default Profile;
