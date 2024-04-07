import React, {useContext, useEffect, useState} from 'react';
import {AppState, FlatList, SafeAreaView, StyleSheet} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {Icon, Layout, Text, useStyleSheet} from '@ui-kitten/components';

import {TopMeditations} from '../components/TopMeditations';
import {TimeInMeditationChart} from '../components/TimeInMeditationChart';
import UserContext from '../contexts/userData';
import {meditationBaseMap} from '../constants/meditation-data';
import {Streaks} from '../components/Streaks';
import {
  checkStreakData,
  getUserStreakData,
  makeFbStreakUpdate,
  updateUserStreakData,
} from '../utils/streaks';
import {getMeditationCounts} from '../utils/meditation';
import {EduPromptComponent} from '../components/EduPrompt/component';
import {fbUpdateUser} from '../fb/user';
import MedNotesPreview from '../components/MedNotesPreview';
import {MeditationBase, MeditationInstance} from '../types';
import MeditationNotesDrawer from '../components/MeditationNotesDrawer';
import MeditationHistoryContext from '../contexts/meditationHistory';
import {
  fbGetMeditationHistory,
  fbGetMoreMeditationHistory,
} from '../fb/meditationHistory';
import {TotalOverview} from '../components/TotalOverview';
import {
  getLastMeditationInstance,
  getMeditationFromId,
} from '../utils/meditations/meditations';

const InsightIcon = (props: any) => (
  <Icon {...props} name="pie-chart-outline" />
);

const InsightScreen = () => {
  const styles = useStyleSheet(themedStyles);
  const {user, setUser} = useContext(UserContext);
  const {meditationHistory, setMeditationHistory} = useContext(
    MeditationHistoryContext,
  );
  const [hasNoMoreHistory, setHasNoMoreHistory] = useState(false);
  const [isNotesModalVisible, setIsNotesModalVisible] = useState(false);
  const [selectedMeditation, setSelectedMeditation] = useState(
    {} as MeditationBase,
  );
  const [selectedMeditationInstance, setSelectedMeditationInstance] = useState(
    {} as MeditationInstance,
  );
  // const navigation = useNavigation();
  const isFocused = useIsFocused();
  // const offering = useFetchOffering();
  const streakData = getUserStreakData(user);
  const lastMeditationInstance = getLastMeditationInstance(meditationHistory);
  const lastMeditation =
    lastMeditationInstance &&
    getMeditationFromId(lastMeditationInstance.meditationBaseId);

  const fetchMeditationHistory = async () => {
    const _meditationHistory = await fbGetMeditationHistory(user.uid);

    setMeditationHistory({
      meditationInstances: _meditationHistory.meditationInstances,
      lastDocument: _meditationHistory.lastDocument,
    });
  };

  const fetchMoreMeditationHistory = async () => {
    const _meditationHistory = await fbGetMoreMeditationHistory(
      user.uid,
      meditationHistory.lastDocument,
    );

    if (_meditationHistory.meditationInstances.length <= 0) {
      setHasNoMoreHistory(true);
    } else {
      setMeditationHistory({
        meditationInstances: [
          ...(meditationHistory.meditationInstances as MeditationInstance[]),
          ..._meditationHistory.meditationInstances,
        ],
        lastDocument: _meditationHistory.lastDocument,
      });
    }
  };

  const updateStreaks = async () => {
    const userId = user.uid;
    const userStreakData = getUserStreakData(user);

    if (userStreakData && lastMeditation) {
      const checkedStreakData = checkStreakData(userStreakData, lastMeditation);

      console.log('   ');
      console.log(
        'checkedStreakData.current - Insights',
        checkedStreakData.current,
      );
      console.log('userStreakData.current - Insights', userStreakData.current);
      console.log('   ');

      if (checkedStreakData.current !== userStreakData.current) {
        const updatedUser = updateUserStreakData(user, checkedStreakData);
        const fbUpdate = makeFbStreakUpdate(checkedStreakData);
        setUser(updatedUser);
        await fbUpdateUser(userId, fbUpdate);
      }
    }
  };

  useEffect(() => {
    if (!meditationHistory.meditationInstances) {
      fetchMeditationHistory();
    }
  }, [isFocused]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        updateStreaks();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const fetchMoreMeditationData = () => {
    if (
      hasNoMoreHistory ||
      (meditationHistory.meditationInstances &&
        meditationHistory.meditationInstances.length < 20)
    ) {
      return;
    }

    fetchMoreMeditationHistory();
  };

  const meditationCounts = getMeditationCounts(user);

  // const onStartTrialPress = () => {
  //   navigation.navigate('Purchase', {offering});
  // };

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
    console.log('HERE >>> Meditation', meditation);
    console.log('HERE >>> meditationInstance', meditationInstance);
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
      <Layout style={styles.listItem} key={index}>
        <MedNotesPreview
          meditation={meditation}
          meditationInstance={item}
          onPress={() => onMeditationInstancePress(meditation, item)}
        />
      </Layout>
    );
  };

  const renderHeader = () => (
    <Layout style={styles.headerContainer}>
      <Layout style={styles.topSpacer}>
        <Streaks current={streakData.current} longest={streakData.longest} />
        <TimeInMeditationChart
          meditationHistory={meditationHistory.meditationInstances || []}
          style={styles.timeInMeditationChart}
        />
        <TotalOverview />
        <TopMeditations meditationCounts={meditationCounts} />
      </Layout>
      <Layout style={styles.historyContainer}>
        {meditationHistory &&
        meditationHistory.meditationInstances &&
        meditationHistory.meditationInstances.length > 0 ? (
          <Text category="h6" style={styles.header}>
            Meditation History
          </Text>
        ) : null}
      </Layout>
    </Layout>
  );

  const renderFooter = () => <Layout style={styles.footer} />;

  return (
    <Layout level="4" style={styles.rootContainer}>
      <SafeAreaView style={styles.screenContainer}>
        <FlatList
          data={meditationHistory.meditationInstances}
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
      <MeditationNotesDrawer
        visible={isNotesModalVisible}
        onClosePress={() => setIsNotesModalVisible(false)}
        meditation={selectedMeditation}
        meditationInstance={selectedMeditationInstance}
      />
    </Layout>
  );
};

const themedStyles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: 'transparent',
    flex: 1,
    flexDirection: 'column',
  },
  screenContainer: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  headerContainer: {
    backgroundColor: 'transparent',
  },
  contentContainer: {
    backgroundColor: 'transparent',
    flex: 9,
  },
  historyContainer: {
    backgroundColor: 'transparent',
  },
  historyHeader: {
    padding: 18,
  },
  listItem: {
    backgroundColor: 'rgba(48,55,75,0.6)',
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
    backgroundColor: 'transparent',
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
    backgroundColor: 'transparent',
    marginTop: 40,
  },
  timeContainer: {
    backgroundColor: 'transparent',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeAmountContainer: {
    backgroundColor: 'transparent',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeInMeditationChart: {
    backgroundColor: 'transparent',
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
    backgroundColor: 'transparent',
    paddingVertical: 20,
  },
  subscribeContainer: {
    backgroundColor: 'rgba(48,55,75, 0.6)',
    borderRadius: 10,
    marginBottom: 60,
    marginHorizontal: 20,
    padding: 20,
  },
  subscribeDescription: {
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  subscribeHeader: {
    textAlign: 'center',
  },
});

export default InsightScreen;
