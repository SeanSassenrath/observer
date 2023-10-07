import React from 'react';
import {Button, Text} from '@ui-kitten/components';
import {ImageBackground, ModalProps, StyleSheet, View} from 'react-native';
import {Drawer} from '../Drawer/component';

interface Props extends ModalProps {
  onClosePress(): void;
}

export const WaveDrawer = (props: Props) => {
  const {visible, onClosePress} = props;

  console.log('visibile >>>', visible);

  return (
    <Drawer visible={visible} onClosePress={onClosePress}>
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
    </Drawer>
  );
};

const styles = StyleSheet.create({
  closeButtonContainer: {
    flexDirection: 'column-reverse',
    flex: 1,
  },
  contentContainer: {
    height: 540,
    bottom: 0,
    paddingBottom: 60,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
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
