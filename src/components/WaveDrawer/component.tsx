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
        <ImageBackground
          source={require('../../assets/wave-preview.jpg')}
          style={styles.img}
        />
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  contentContainer: {
    backgroundColor: '#020306',
    height: 560,
    width: screenwWidth,
    position: 'absolute',
    bottom: 0,
    paddingBottom: 60,
  },
  description: {
    fontWeight: 'normal',
  },
  img: {
    width: '100%',
    height: 200,
  },
  textContainer: {
    padding: 20,
  },
  title: {
    paddingBottom: 20,
  },
});
