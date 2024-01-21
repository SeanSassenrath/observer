import {Button, Icon, Layout, Modal, Text} from '@ui-kitten/components/ui';
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useStyleSheet} from '@ui-kitten/components';
import messaging from '@react-native-firebase/messaging';

import _Button from '../Button';
import {brightWhite} from '../../constants/colors';
import {Action, Noun, notificationModalSendEvent} from '../../analytics';

import {setSeenNotificationModalInAsyncStorage} from '../../utils/asyncStorageNotifs';
import {DateTime} from 'luxon';
import Toast from 'react-native-toast-message';

const BellIcon = () => (
  <Icon style={themedStyles.bellIcon} fill={brightWhite} name="bell" />
);

interface Props {
  isVisible: boolean;
  onClose(): void;
}

const NotificationModal = (props: Props) => {
  const {isVisible, onClose} = props;
  const styles = useStyleSheet(themedStyles);

  const setSeenNotifModal = async () => {
    const now = DateTime.now().toString();
    await notificationModalSendEvent(Action.VIEW, Noun.ON_MOUNT);
    await setSeenNotificationModalInAsyncStorage(now);
  };

  const onEnablePress = async () => {
    const authorizationStatus = await messaging().requestPermission();

    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      await notificationModalSendEvent(Action.ENABLE, Noun.BUTTON);
      console.log('Permission status:', authorizationStatus);
    } else if (authorizationStatus === messaging.AuthorizationStatus.DENIED) {
      await notificationModalSendEvent(Action.DENIED, Noun.BUTTON);
      console.log('Permission status:', authorizationStatus);
    }

    setSeenNotifModal();
    onClose();

    Toast.show({
      type: 'success',
      text1: 'Notifications enabled',
      position: 'bottom',
      bottomOffset: 100,
    });
  };

  const onClosePress = async () => {
    await notificationModalSendEvent(Action.SKIP, Noun.BUTTON);
    setSeenNotifModal();
    onClose();
  };

  return (
    <Modal
      animationType={'slide'}
      visible={isVisible}
      backdropStyle={styles.backdrop}
      onBackdropPress={onClosePress}>
      <Layout level="2" style={styles.rootContainer}>
        <Layout level="2" style={styles.iconContainer}>
          <View style={styles.bellContainerOutside2}>
            <View style={styles.bellContainerOutside}>
              <View style={styles.bellContainerInside}>
                <BellIcon />
              </View>
            </View>
          </View>
        </Layout>
        <Layout level="2">
          <Text category="h6" style={styles.modalText}>
            Enable Notifications
          </Text>
          <Text category="p1" style={styles.modalText}>
            Enable notifications to receive meditation reminders and streak
            warnings.
          </Text>
          <_Button onPress={onEnablePress} style={styles.primaryButton}>
            Enable Notifications
          </_Button>
          <Button onPress={onClosePress} appearance="ghost" status="basic">
            Skip
          </Button>
        </Layout>
      </Layout>
    </Modal>
  );
};

const themedStyles = StyleSheet.create({
  bellContainerInside: {
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    width: 80,
    backgroundColor: 'rgba(187,111,221, 0.3)',
  },
  bellContainerOutside: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    backgroundColor: 'rgba(187,111,221, 0.2)',
    height: 95,
    width: 95,
  },
  bellContainerOutside2: {
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: 'rgba(187,111,221, 0.1)',
    height: 105,
    justifyContent: 'center',
    opacity: 0.9,
    width: 105,
  },
  bellIcon: {
    opacity: 0.95,
    height: 60,
    width: 60,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  modalText: {
    textAlign: 'center',
    marginBottom: 10,
  },
  primaryButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  rootContainer: {
    borderRadius: 10,
    height: 380,
    justifyContent: 'space-between',
    padding: 20,
    width: 350,
  },
});

export default NotificationModal;
