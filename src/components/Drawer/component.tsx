import React from 'react';
import {
  Dimensions,
  Modal,
  ModalProps,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

const dimens = Dimensions.get('screen');
const screenwWidth = dimens.width;

interface Props extends ModalProps {
  children?: React.ReactNode;
  onClosePress(): void;
}

export const Drawer = (props: Props) => {
  const {children, visible, onClosePress} = props;

  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <Pressable onPress={onClosePress}>
        <View style={styles.background} />
      </Pressable>
      <View style={styles.container}>{children}</View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  background: {
    height: '100%',
    width: screenwWidth,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  container: {
    backgroundColor: '#260752',
    width: screenwWidth,
    position: 'absolute',
    bottom: 0,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    shadowColor: '#9147BB',
  },
});
