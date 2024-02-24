import {Button, Layout, Modal, Text} from '@ui-kitten/components/ui';
import React from 'react';
import {StyleSheet} from 'react-native';
import {useStyleSheet} from '@ui-kitten/components';
import messaging from '@react-native-firebase/messaging';

import _Button from '../Button';
import {Action, Noun, notificationModalSendEvent} from '../../analytics';

import {setSeenNotificationModalInAsyncStorage} from '../../utils/asyncStorageNotifs';
import {DateTime} from 'luxon';
import Toast from 'react-native-toast-message';

interface Props {
  description: string;
  isVisible: boolean;
  onClose(): void;
}

const SubscribeModal = (props: Props) => {
  const {description, isVisible, onClose} = props;
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
        <Layout level="2">
          <Text category="h5" style={styles.modalText}>
            Become Unlimited
          </Text>
          <Text category="s1" style={styles.modalText}>
            {description}
          </Text>
          <_Button onPress={onEnablePress} style={styles.primaryButton}>
            Start 7 Day Free Trial
          </_Button>
          <Button onPress={onClosePress} appearance="ghost" status="basic">
            Close
          </Button>
        </Layout>
      </Layout>
    </Modal>
  );
};

const themedStyles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    height: 290,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    width: 350,
  },
});

export default SubscribeModal;
