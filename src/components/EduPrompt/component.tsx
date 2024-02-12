import React from 'react';
import {StyleSheet} from 'react-native';
import {Layout, Text} from '@ui-kitten/components';
import Animated, {
  FadeIn,
  SlideInDown,
  SlideInUp,
} from 'react-native-reanimated';
import _Button from '../Button';

const brightWhite = '#fcfcfc';

interface Props {
  description: string;
  descriptionAction?: string;
  onPress(): void;
  renderIcon?(props: any): JSX.Element;
  title: string;
  top?: boolean;
}

interface IconProps {
  style: any;
  fill: string;
}

export const EduPromptComponent = (props: Props) => {
  const {description, descriptionAction, onPress, renderIcon, title, top} =
    props;

  const Icon = (iconProps: IconProps) =>
    renderIcon ? renderIcon(iconProps) : <></>;

  return (
    <Animated.View
      key={'eduContainer'}
      entering={FadeIn.duration(600)}
      style={styles.container}>
      <Animated.View
        key={'eduPromptContainer'}
        entering={top ? SlideInUp.duration(1000) : SlideInDown.duration(1000)}
        style={
          top
            ? styles.animatedPromptContainerTop
            : styles.animatedPromptContainer
        }>
        <Layout level="1" style={styles.promptContainer}>
          <Layout style={styles.promptHeader}>
            <Icon style={styles.icon} fill={brightWhite} />
            <Text category="h5">{title}</Text>
          </Layout>
          <Text category="s1" style={styles.promptDescription}>
            {description}
          </Text>
          {descriptionAction ? (
            <Text category="s1" style={styles.promptDescription}>
              {descriptionAction}
            </Text>
          ) : null}
          <_Button onPress={onPress} style={styles.promptButton}>
            Got it
          </_Button>
        </Layout>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedPromptContainer: {
    position: 'absolute',
    bottom: 40,
    width: 350,
  },
  animatedPromptContainerTop: {
    position: 'absolute',
    top: 100,
    width: 350,
  },
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    height: '100%',
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
  },
  icon: {
    height: 32,
    marginRight: 8,
    width: 32,
  },
  promptButton: {
    marginTop: 24,
  },
  promptContainer: {
    padding: 20,
    borderRadius: 8,
  },
  promptDescription: {
    lineHeight: 24,
    marginTop: 20,
  },
  promptHeader: {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
});
