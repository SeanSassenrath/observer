import React from 'react';
import {Image, Pressable, StyleSheet} from 'react-native';
import {Layout, Text, useStyleSheet} from '@ui-kitten/components';
import {MeditationBase} from '../../types';

interface Props {
  onPress(): void;
  meditation?: MeditationBase;
  meditationDate?: string;
}

export const MedNotesPreviewComponent = (props: Props) => {
  const {meditation, meditationDate, onPress} = props;
  const styles = useStyleSheet(themedStyles);

  return (
    <Pressable onPress={onPress}>
      <Layout style={styles.contentContainer}>
        <Layout style={styles.meditationContentContainer}>
          <Image
            source={meditation ? meditation.backgroundImage : ''}
            style={imageStyles.image}
          />
          <Layout style={styles.meditationContainer}>
            <Layout style={styles.meditationMetaDataContainer}>
              <Text
                numberOfLines={1}
                category="s1"
                style={styles.meditationName}>
                {meditation ? meditation.name : ''}
              </Text>
              <Text category="s1">{meditationDate}</Text>
            </Layout>
            <Text category="s1" style={styles.expandPress}>
              See Meditation Notes
            </Text>
          </Layout>
        </Layout>
      </Layout>
    </Pressable>
  );
};

const themedStyles = StyleSheet.create({
  contentContainer: {
    backgroundColor: 'transparent',
    padding: 20,
  },
  expandPress: {
    color: 'color-primary-300',
    opacity: 0.9,
  },
  image: {
    borderRadius: 10,
    height: 80,
    marginRight: 16,
    width: 120,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(90, 90, 90, 0.2)',
  },
  meditationContentContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    flex: 0,
  },
  meditationContainer: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'space-between',
  },
  meditationMetaDataContainer: {
    backgroundColor: 'transparent',
    marginBottom: 10,
    opacity: 0.8,
  },
  meditationName: {
    marginBottom: 4,
  },
});

const imageStyles = StyleSheet.create({
  image: {
    borderRadius: 10,
    height: 80,
    marginRight: 16,
    width: 120,
    overflow: 'hidden',
  },
});
