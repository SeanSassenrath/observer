import {useNavigation} from '@react-navigation/native';
import {
  Button,
  Divider,
  Icon,
  Input,
  Layout,
  Modal,
  Text,
  // Toggle,
} from '@ui-kitten/components';
import React, {useContext, useEffect, useState} from 'react';
import {
  // AppState,
  Image,
  // Linking,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import Toast from 'react-native-toast-message';
// import messaging from '@react-native-firebase/messaging';

import {ProfileScreenNavigationProp, ProfileScreenRouteProp} from '../types';
import {deleteUser, signOut} from '../fb/auth';
import {getUserProfile} from '../utils/profile';
import UserContext, {User, initialUserState} from '../contexts/userData';
import {brightWhite} from '../constants/colors';
import {fbUpdateUser} from '../fb/user';
import _Button from '../components/Button';
// import {Action, Noun, profileNotifEnabledSendEvent} from '../analytics';

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // const [isNotifEnabled, setIsNotifEnabled] = useState(false);

  useEffect(() => {
    const _userProfile = getUserProfile(userId, user);

    if (_userProfile) {
      setUserProfile(_userProfile);
      setName(_userProfile.profile.displayName);
    }

    // updateIsNotifEnabled();

    // const subscription = AppState.addEventListener('change', nextAppState => {
    //   if (nextAppState === 'active') {
    //     updateIsNotifEnabled();
    //   }
    // });

    return () => {
      // subscription.remove();
    };
  }, [user, userId, userProfile]);

  const onBackPress = () => {
    navigation.goBack();
  };

  const onFeedbackPress = () => {
    navigation.navigate('Feedback');
  };

  const onSignOut = async () => {
    const isSuccessfulSignOut = await signOut();
    if (isSuccessfulSignOut) {
      setUser(initialUserState);
      navigation.navigate('SignIn');
    }
  };

  const onDeleteConfirm = async () => {
    const isUserDeleted = await deleteUser();

    if (isUserDeleted) {
      setUser(initialUserState);
      navigation.navigate('SignIn');
    }
  };

  const onCancelDeletePress = () => {
    setIsDeleteModalOpen(false);
  };

  // const updateIsNotifEnabled = async () => {
  //   const authorizationStatus = await messaging().hasPermission();

  //   if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
  //     setIsNotifEnabled(true);
  //   } else if (authorizationStatus === messaging.AuthorizationStatus.DENIED) {
  //     setIsNotifEnabled(false);
  //   }
  // };

  // const onNotifToggleChange = async () => {
  //   const authorizationStatus = await messaging().hasPermission();

  //   if (authorizationStatus === messaging.AuthorizationStatus.NOT_DETERMINED) {
  //     await messaging().requestPermission();
  //   } else if (!isNotifEnabled) {
  //     await profileNotifEnabledSendEvent(Action.ENABLE, Noun.BUTTON, {
  //       isEnabled: true,
  //     });
  //     Linking.openSettings();
  //   } else if (isNotifEnabled) {
  //     await profileNotifEnabledSendEvent(Action.DENIED, Noun.BUTTON, {
  //       isEnabled: false,
  //     });
  //     Linking.openSettings();
  //   }
  // };

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
        {/* <View style={styles.toggleRowContainer}>
          <Text category="s1">Enable Notifications</Text>
          <Toggle
            checked={isNotifEnabled}
            status="primary"
            onChange={onNotifToggleChange}
          />
        </View> */}
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
        <Button
          status="danger"
          appearance="outline"
          onPress={() => setIsDeleteModalOpen(true)}
          style={styles.deleteButton}>
          Delete Account
        </Button>
      </View>
      <Modal
        animationType={'slide'}
        visible={isDeleteModalOpen}
        backdropStyle={styles.modalBackdrop}
        onBackdropPress={onCancelDeletePress}>
        <Layout level="2" style={styles.modalRootContainer}>
          <Layout level="2">
            <Text category="h5" style={styles.modalText}>
              Delete Account
            </Text>
            <Text category="s1" style={styles.modalText}>
              Are you sure you want to delete your account? All your saved
              meditation data will be permanently lost.
            </Text>
            <_Button
              onPress={onDeleteConfirm}
              status="danger"
              style={styles.modalPrimaryButton}>
              Delete My Account
            </_Button>
            <Button
              onPress={onCancelDeletePress}
              appearance="outline"
              status="basic"
              style={styles.modalCancel}>
              Cancel
            </Button>
          </Layout>
        </Layout>
      </Modal>
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
    flex: 2,
    marginBottom: 20,
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
  },
  deleteButton: {
    borderRadius: 50,
    marginBottom: 40,
    marginTop: 20,
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
  modalBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalCancel: {
    borderRadius: 50,
  },
  modalText: {
    textAlign: 'center',
    marginBottom: 10,
  },
  modalPrimaryButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  modalRootContainer: {
    borderRadius: 10,
    height: 290,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    width: 350,
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
    flex: 6,
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
