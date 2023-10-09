import {useNavigation} from '@react-navigation/native';
import {Icon, Popover, Text} from '@ui-kitten/components';
import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ProfileScreenNavigationProp, ProfileScreenRouteProp} from '../types';
import {SignOut} from '../fb/auth';
import {Wave} from '../components/Wave/component';

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
        <View style={styles.main}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer} />
            <View style={styles.profileMetaContainer}>
              <View style={styles.nameContainer}>
                <Text style={styles.firstName} category="h5">
                  Alexandra
                </Text>
                <Text category="h5">Estrada</Text>
              </View>
              <View>
                <Text category="s2">Joined: 10/21/20</Text>
              </View>
            </View>
          </View>
          <View style={styles.profileMeditationsContainer}>
            <View style={styles.profileMeditationsSectionContainer}>
              <Text style={styles.profileMetaSectionLabel} category="s1">
                Meditations
              </Text>
              <Text category="h6">43</Text>
            </View>
            <View style={styles.profileMeditationsSectionContainer}>
              <Text style={styles.profileMetaSectionLabel} category="s1">
                Minutes Meditated
              </Text>
              <Text category="h6">1d 5hr</Text>
            </View>
          </View>
          <View style={styles.waveContainer}>
            <Wave />
          </View>
        </View>
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
    paddingHorizontal: 20,
  },
  profileHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 40,
  },
  avatarContainer: {
    backgroundColor: 'rgba(48,55,75,0.6)',
    borderRadius: 100,
    height: 100,
    marginRight: 20,
    width: 100,
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
