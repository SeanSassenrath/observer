import React from 'react';
import {Button, Text} from '@ui-kitten/components';
import {
  Dimensions,
  ImageBackground,
  Modal,
  ModalProps,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

const dimens = Dimensions.get('screen');
const screenwWidth = dimens.width;

interface Props extends ModalProps {
  onClosePress(): void;
}

export const WaveDrawer = (props: Props) => {
  const {visible, onClosePress} = props;

  console.log('visibile >>>', visible);

  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <Pressable onPress={onClosePress}>
        <View style={styles.background} />
      </Pressable>
      <View style={styles.contentContainer}>
        <View style={styles.imgContainer}>
          <ImageBackground
            source={require('../../assets/wave-preview.jpg')}
            style={styles.img}
          />
        </View>
        <View style={styles.textContainer}>
          <Text category="h5" style={styles.title}>
            Coherence Wave
          </Text>
          <Text category="h6" style={styles.description}>
            The Coherence Wave gives you feedback on your practice. The more you
            meditate, the more coherent and less wavy it becomes. The less you
            meditate, the less coherent more wavy it becomes.
          </Text>
        </View>
        <View style={styles.closeButtonContainer}>
          <Button
            appearance="ghost"
            size="large"
            status="basic"
            onPress={onClosePress}>
            Close
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  closeButtonContainer: {
    flexDirection: 'column-reverse',
    flex: 1,
  },
  background: {
    height: '100%',
    width: screenwWidth,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  contentContainer: {
    backgroundColor: '#1B0444',
    height: 560,
    width: screenwWidth,
    position: 'absolute',
    bottom: 0,
    paddingBottom: 60,
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
  description: {
    fontWeight: 'normal',
  },
  img: {
    width: '100%',
    height: 180,
  },
  imgContainer: {
    backgroundColor: '#020306',
    height: 200,
    justifyContent: 'flex-end',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  textContainer: {
    padding: 20,
  },
  title: {
    paddingBottom: 20,
  },
});
