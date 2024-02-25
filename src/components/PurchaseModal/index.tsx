import {Layout, Modal, Spinner, Text} from '@ui-kitten/components/ui';
import React from 'react';
import {StyleSheet} from 'react-native';
import {useStyleSheet} from '@ui-kitten/components';

interface Props {
  isVisible: boolean;
}

const PurchaseModal = (props: Props) => {
  const {isVisible} = props;
  const styles = useStyleSheet(themedStyles);

  return (
    <Modal
      animationType={'slide'}
      visible={isVisible}
      backdropStyle={styles.backdrop}>
      <Layout level="2" style={styles.rootContainer}>
        <Layout level="2">
          <Text category="h5" style={styles.modalText}>
            Purchase in progress...
          </Text>
          <Layout level="2" style={styles.spinnerContainer}>
            <Spinner size="large" />
          </Layout>
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
  rootContainer: {
    borderRadius: 10,
    height: 200,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    width: 350,
  },
  spinnerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default PurchaseModal;
