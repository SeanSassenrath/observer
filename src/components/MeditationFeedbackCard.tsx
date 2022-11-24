import React, { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Layout, Text, useStyleSheet } from '@ui-kitten/components';

enum FeedbackScore {
  None,
  Bad,
  Ok,
  Good,
  Great,
}

export const MeditationFeedbackCard = () => {
  const [feedbackScore, setFeedbackScore] = useState(FeedbackScore.None);
  const styles = useStyleSheet(themedStyles);

  const setPressedScoreStyle = () => {
    switch (feedbackScore) {
      case FeedbackScore.Bad:
        return {
          backgroundColor: '#C55F41',
        }
      case FeedbackScore.Ok:
        return {
          backgroundColor: '#E7CD5C',
        }
      case FeedbackScore.Good:
        return {
          backgroundColor: '#2D9411',
        }
      case FeedbackScore.Great:
        return {
          backgroundColor: '#A1E66F',
        }
      default:
        return null;
    }
  }

  const setRatingCircleStyles = (_feedbackScore: FeedbackScore) => {
    if (_feedbackScore === feedbackScore) {
      return (
        {
          ...setPressedScoreStyle(),
          ...styles.ratingCircle
        }
      )
    } else {
      return styles.ratingCircle
    }
  }

  return (
    <Layout level='2' style={styles.container}>
      <Text category='s1'>How did your meditation go?</Text>
      <Layout level='2' style={styles.ratingsContainer}>
        <Layout level='2' style={styles.ratingContainer}>
          <Pressable onPress={() => setFeedbackScore(FeedbackScore.Bad)}>
            <Layout style={setRatingCircleStyles(FeedbackScore.Bad)}/>
          </Pressable>
          <Text category='s2' style={styles.ratingText}>Bad</Text>
        </Layout>
        <Layout level='2' style={styles.ratingContainer}>
          <Pressable onPress={() => setFeedbackScore(FeedbackScore.Ok)}>
            <Layout style={setRatingCircleStyles(FeedbackScore.Ok)} />
          </Pressable>
          <Text category='s2' style={styles.ratingText} >Ok</Text>
        </Layout>
        <Layout level='2' style={styles.ratingContainer}>
          <Pressable onPress={() => setFeedbackScore(FeedbackScore.Good)}>
            <Layout style={setRatingCircleStyles(FeedbackScore.Good)} />
          </Pressable>
          <Text category='s2' style={styles.ratingText} >Good</Text>
        </Layout>
        <Layout level='2' style={styles.ratingContainer}>
          <Pressable onPress={() => setFeedbackScore(FeedbackScore.Great)}>
            <Layout style={setRatingCircleStyles(FeedbackScore.Great)} />
          </Pressable>
          <Text category='s2' style={styles.ratingText} >Great</Text>
        </Layout>
      </Layout>
    </Layout>
  )
}

const themedStyles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 18,
    marginBottom: 60,
  },
  ratingsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingContainer: {
    flex: 1,
    alignItems: 'center',
  },
  ratingText: {
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.8,
  },
  ratingCircle: {
    height: 36,
    width: 36,
    borderRadius: 50,
    marginTop: 30,
    borderColor: 'gray',
    borderWidth: 1,
  }
})