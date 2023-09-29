import React, {useContext, useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {Icon, Layout, Text, useStyleSheet} from '@ui-kitten/components';

import {TopMeditations} from '../components/TopMeditations';
import {TimeInMeditationChart} from '../components/TimeInMeditationChart';
import UserContext from '../contexts/userData';
import {meditationBaseMap} from '../constants/meditation-data';
import {Streaks} from '../components/Streaks';
import {getUserStreakData} from '../utils/streaks';
import {getMeditationCounts} from '../utils/meditation';
import {EduPromptComponent} from '../components/EduPrompt/component';
import {fbUpdateUser} from '../fb/user';
import MedNotesPreview from '../components/MedNotesPreview';
import MeditationNotesModal from '../components/MeditationNotesModal';
import {MeditationBase, MeditationInstance} from '../types';

const InsightIcon = (props: any) => (
  <Icon {...props} name="pie-chart-outline" />
);

const InsightScreen = () => {
  const styles = useStyleSheet(themedStyles);
  const {user, setUser} = useContext(UserContext);
  const [meditationHistory, setMeditationHistory] = useState(
    [] as MeditationInstance[],
  );
  const [lastBatchDocument, setLastBatchDocument] = useState();
  const [hasNoMoreHistory, setHasNoMoreHistory] = useState(false);
  const [isNotesModalVisible, setIsNotesModalVisible] = useState(false);
  const [selectedMeditation, setSelectedMeditation] = useState(
    {} as MeditationBase,
  );
  const [selectedMeditationInstance, setSelectedMeditationInstance] = useState(
    {} as MeditationInstance,
  );
  const isFocused = useIsFocused();
  const streakData = getUserStreakData(user);

  useEffect(() => {
    firestore()
      .collection('users')
      .doc(user.uid)
      .collection('meditationHistory')
      .orderBy('creationTime', 'desc')
      .limit(20)
      .get()
      .then(meditationInstances => {
        const docs = meditationInstances.docs;
        setLastBatchDocument(docs[docs.length - 1] as any);
        const meditationHistoryFromFirebase = docs.map(doc => doc.data());
        setMeditationHistory(
          meditationHistoryFromFirebase as MeditationInstance[],
        );
      });
  }, [isFocused]);

  const fetchMoreMeditationData = () => {
    if (hasNoMoreHistory) {
      return;
    }

    firestore()
      .collection('users')
      .doc(user.uid)
      .collection('meditationHistory')
      .orderBy('creationTime', 'desc')
      .startAfter(lastBatchDocument)
      .limit(20)
      .get()
      .then(meditationInstances => {
        const docs = meditationInstances.docs;

        if (docs.length <= 0) {
          setHasNoMoreHistory(true);
        }

        setLastBatchDocument(docs[docs.length - 1] as any);
        const meditationHistoryFromFirebase = docs.map(doc => doc.data());
        setMeditationHistory([
          ...meditationHistory,
          ...meditationHistoryFromFirebase,
        ] as MeditationInstance[]);
      });
  };

  const meditationCounts = getMeditationCounts(user);

  const onEduClosePress = async () => {
    await fbUpdateUser(user.uid, {
      'onboarding.hasSeenInsightsOnboarding': true,
    });
    setUser({
      ...user,
      onboarding: {
        ...user.onboarding,
        hasSeenInsightsOnboarding: true,
      },
    });
  };

  const onMeditationInstancePress = (
    meditation: MeditationBase,
    meditationInstance: MeditationInstance,
  ) => {
    setSelectedMeditation(meditation);
    setSelectedMeditationInstance(meditationInstance);
    setIsNotesModalVisible(true);
  };

  interface ListItem {
    item: MeditationInstance;
    index: number;
  }

  const renderListItem = ({item, index}: ListItem) => {
    const meditation = meditationBaseMap[item.meditationBaseId];

    return (
      <Layout style={styles.listItem} level="2" key={index}>
        <MedNotesPreview
          meditation={meditation}
          meditationInstance={item}
          onPress={() => onMeditationInstancePress(meditation, item)}
        />
      </Layout>
    );
  };

  const renderHeader = () => (
    <Layout level="4">
      <Layout level="4" style={styles.topSpacer}>
        <Streaks current={streakData.current} longest={streakData.longest} />
        <TimeInMeditationChart
          meditationHistory={meditationHistory}
          style={styles.timeInMeditationChart}
        />
        <TopMeditations meditationCounts={meditationCounts} />
      </Layout>
      <Layout level="4">
        {meditationHistory.length > 0 ? (
          <Text category="h6" style={styles.header}>
            Meditation History
          </Text>
        ) : null}
      </Layout>
    </Layout>
  );

  const renderFooter = () => <Layout level="4" style={styles.footer} />;

  return (
    <Layout style={styles.rootContainer} level="4">
      <SafeAreaView style={styles.screenContainer}>
        <FlatList
          data={meditationHistory}
          renderItem={({item, index}) => renderListItem({item, index})}
          onEndReached={fetchMoreMeditationData}
          onEndReachedThreshold={0.8}
          ListHeaderComponent={renderHeader()}
          ListFooterComponent={renderFooter()}
        />
      </SafeAreaView>
      {!user.onboarding.hasSeenInsightsOnboarding ? (
        <EduPromptComponent
          description="Be your own scientist! View meditation data and learn from your practice."
          onPress={onEduClosePress}
          renderIcon={(props: any) => <InsightIcon {...props} />}
          title="Your Insights"
        />
      ) : null}
      <MeditationNotesModal
        visible={isNotesModalVisible}
        onBackdropPress={() => setIsNotesModalVisible(false)}
        meditation={selectedMeditation}
        meditationInstance={selectedMeditationInstance}
        showStartMeditation
      />
    </Layout>
  );
};

const themedStyles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  screenContainer: {
    flex: 1,
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  contentContainer: {
    flex: 9,
  },
  historyHeader: {
    padding: 18,
  },
  listItem: {
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  listItemText: {
    marginVertical: 2,
  },
  listItemBreathWorkText: {
    color: 'color-info-500',
  },
  listItemDate: {
    marginTop: 10,
  },
  listItemDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rootContainer: {
    flex: 1,
  },
  streaksCard: {
    borderRadius: 10,
    padding: 18,
  },
  streaksContainer: {
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  streaksHeader: {
    marginBottom: 10,
  },
  streaksDescription: {
    marginBottom: 8,
  },
  topSpacer: {
    marginTop: 40,
  },
  timeContainer: {
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeAmountContainer: {
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeInMeditationChart: {
    marginTop: 20,
  },
  header: {
    opacity: 0.8,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  timeAmount: {
    marginTop: 16,
  },
  firstItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  lastItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  footer: {
    paddingVertical: 20,
  },
});

export default InsightScreen;
