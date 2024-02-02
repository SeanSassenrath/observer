import {Button, Layout, Modal, Text} from '@ui-kitten/components';
import React from 'react';
import {StyleSheet} from 'react-native';

import _Button from '../Button';

interface Props {
  isVisible: boolean;
  onCancel(): void;
  onContinue(): void;
}

export const MeditationPlayerCancelModal = (props: Props) => {
  const {isVisible, onContinue, onCancel} = props;

  return (
    <Modal
      visible={isVisible}
      backdropStyle={styles.backdrop}
      onBackdropPress={onContinue}>
      <Layout level="3" style={styles.modalContainer}>
        <Layout level="3" style={styles.modalContentContainer}>
          <Text category="h6" style={styles.modalContextHeader}>
            Cancel Meditation
          </Text>
          <Text category="s1" style={styles.modalContextText}>
            If you cancel this meditation your session will not be recorded.
          </Text>
        </Layout>
        <_Button onPress={onContinue} style={styles.modalButton}>
          Keep Meditating
        </_Button>
        <Button
          appearance="ghost"
          size="medium"
          status="basic"
          onPress={onCancel}
          style={styles.modalButton}>
          Cancel Meditation
        </Button>
      </Layout>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalButton: {
    marginTop: 20,
  },
  modalContentContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalContainer: {
    borderRadius: 16,
    padding: 20,
    width: 350,
  },
  modalContextHeader: {
    lineHeight: 22,
    marginVertical: 20,
    opacity: 0.9,
  },
  modalContextText: {
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.9,
  },
  modalDescription: {
    lineHeight: 22,
    marginVertical: 26,
    textAlign: 'center',
  },
  modalHeader: {
    alignItems: 'center',
  },
});
