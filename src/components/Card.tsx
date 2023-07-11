import React from 'react';
import {ImageBackground, Pressable, StyleSheet} from 'react-native';
import {Layout, Text} from '@ui-kitten/components';

import {
  MeditationFormattedDuration,
  MeditationId,
  MeditationName,
} from '../types';

interface CardProps {
  backgroundImage?: any;
  isFirstCard?: boolean;
  formattedDuration: MeditationFormattedDuration;
  meditationId: MeditationId;
  level?: string;
  name: MeditationName;
  onPress(id: MeditationId): void;
  isMini?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
}

export const CardV1 = (props: CardProps) => (
  <Pressable
    key={props.meditationId}
    onPress={() => props.onPress(props.meditationId)}>
    <Layout level={props.level} style={styles.card}>
      <Layout level={props.level} style={styles.nameContainer}>
        <Text category="s1">{props.name}</Text>
      </Layout>
      <Layout level={props.level} style={styles.formattedDurationContainer}>
        <Text category="s2">{`${props.formattedDuration}m`}</Text>
      </Layout>
    </Layout>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    flexDirection: 'row',
    height: 140,
    marginRight: 20,
    padding: 18,
    width: 200,
  },
  formattedDurationContainer: {
    alignItems: 'flex-end',
    flex: 2,
    justifyContent: 'flex-end',
  },
  nameContainer: {
    alignItems: 'flex-start',
    flex: 8,
    justifyContent: 'flex-end',
  },
});

export const CardV3 = (props: CardProps) => (
  <Pressable onPress={() => props.onPress(props.meditationId)}>
    <Layout level={props.level} style={{...stylesV2.card}}>
      <Layout level={props.level} style={stylesV2.formattedDurationContainer}>
        <Text category="s2">{`${props.formattedDuration}m`}</Text>
      </Layout>
      <Layout level={props.level} style={stylesV2.nameContainer}>
        <Text category="s1">{props.name}</Text>
      </Layout>
    </Layout>
  </Pressable>
);

const stylesV2 = StyleSheet.create({
  card: {
    borderRadius: 10,
    height: 140,
    marginRight: 20,
    width: 200,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.7)',
  },
  formattedDurationContainer: {
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 18,
  },
  nameContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
    flex: 1,
    padding: 18,
  },
});

interface CardStyleProps {
  isMini?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
}

const getCardStyles = (props: CardStyleProps) => {
  if (props.isMini) {
    if (props.isSelected) {
      return stylesV4.miniSelectedCard;
    } else if (props.isDisabled) {
      return stylesV4.miniDisabledCard;
    } else {
      return stylesV4.miniCard;
    }
  } else {
    if (props.isDisabled) {
      return stylesV4.disabledCard;
    } else {
      return stylesV4.card;
    }
  }
};

const getCardNameStyles = (props: CardStyleProps) => {
  if (props.isDisabled) {
    return stylesV4.disabledNameContainer;
  } else {
    return stylesV4.nameContainer;
  }
};

export const CardV4 = (props: CardProps) => (
  <Pressable
    key={props.meditationId}
    onPress={() => props.onPress(props.meditationId)}>
    <ImageBackground
      source={props.backgroundImage}
      style={getCardStyles(props)}>
      <Layout level={props.level} style={stylesV4.formattedDurationContainer}>
        <Text category="s2">{`${props.formattedDuration}m`}</Text>
      </Layout>
    </ImageBackground>
    <Layout level="4" style={getCardNameStyles(props)}>
      <Text category="s1">{props.name}</Text>
    </Layout>
  </Pressable>
);

const stylesV4 = StyleSheet.create({
  card: {
    borderRadius: 10,
    height: 140,
    marginRight: 20,
    width: 200,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(90, 90, 90, 0.9)',
  },
  disabledCard: {
    borderRadius: 10,
    height: 140,
    marginRight: 20,
    width: 200,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(90, 90, 90, 0.9)',
    opacity: 0.4,
  },
  miniCard: {
    borderRadius: 10,
    height: 100,
    marginRight: 20,
    width: 140,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(90, 90, 90, 0.9)',
  },
  miniSelectedCard: {
    borderRadius: 10,
    height: 100,
    marginRight: 20,
    width: 140,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#CBF6A1',
  },
  miniDisabledCard: {
    borderRadius: 10,
    height: 100,
    marginRight: 20,
    width: 140,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(90, 90, 90, 0.9)',
    opacity: 0.4,
  },
  formattedDurationContainer: {
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 12,
    flex: 1,
  },
  nameContainer: {
    justifyContent: 'flex-end',
    paddingTop: 18,
    paddingHorizontal: 8,
    paddingBottom: 6,
    width: 200,
  },
  disabledNameContainer: {
    justifyContent: 'flex-end',
    paddingTop: 18,
    paddingHorizontal: 8,
    paddingBottom: 6,
    width: 200,
    opacity: 0.4,
  },
});

interface EmptyCardProps {
  isMini?: boolean;
}

export const EmptyCard = (props: EmptyCardProps) => (
  <Layout
    level="1"
    style={
      props.isMini ? emptyCardStyles.emptyCardMini : emptyCardStyles.emptyCard
    }
  />
);

const emptyCardStyles = StyleSheet.create({
  card: {
    borderRadius: 10,
    height: 140,
    marginRight: 20,
    padding: 18,
    width: 200,
  },
  emptyCard: {
    borderRadius: 10,
    height: 140,
    marginRight: 20,
    opacity: 0.6,
    padding: 18,
    width: 200,
  },
  emptyCardMini: {
    borderRadius: 10,
    height: 100,
    marginRight: 20,
    opacity: 0.6,
    padding: 18,
    width: 140,
  },
  formattedDurationContainer: {
    alignItems: 'flex-end',
  },
  nameContainer: {
    justifyContent: 'flex-end',
    flex: 1,
  },
});
