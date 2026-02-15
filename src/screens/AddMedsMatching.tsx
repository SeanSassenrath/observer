import React, {useEffect} from 'react';
import {Layout, Text, useStyleSheet} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {usePostHog} from 'posthog-react-native';
import {captureAddFlowEvent} from '../analytics/posthog';

import {
  AddMedsMatchingScreenRouteProp,
  AddMedsMatchingScreenNavigationProp,
} from '../types';

interface Props {
  navigation: AddMedsMatchingScreenNavigationProp;
  route: AddMedsMatchingScreenRouteProp;
}

const AddMedsMatchingScreen = (props: Props) => {
  const styles = useStyleSheet(themedStyles);
  const posthog = usePostHog();
  const {route} = props;
  const {medsFail, medsSuccess} = route.params;
  const navigation = useNavigation();
  // const [barWidth, setBarWidth] = useState(0);

  // const incrementBarWidth = () => {
  //   setBarWidth(barWidth + 1);
  // };

  const chooseNavigator = () => {
    if (medsFail.length > 0) {
      navigation.navigate('UnrecognizedFiles', {
        medsFail: medsFail,
      });
    } else {
      navigation.navigate('AddMedsSuccess');
    }
  };

  useEffect(() => {
    captureAddFlowEvent(posthog, 'add_meditation_matching', {
      matched_count: medsSuccess.length,
      unmatched_count: medsFail.length,
    });
    setTimeout(() => {
      chooseNavigator();
    }, 3000);
  }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (barWidth >= 100) {
  //       clearInterval(interval);
  //       chooseNavigator();
  //     } else {
  //       incrementBarWidth();
  //     }
  //   }, 20);

  //   console.log('interval', interval);

  //   return () => clearInterval(interval);
  // }, [barWidth]);

  return (
    <Layout level="4" style={styles.screenContainer}>
      <View style={styles.mainContainer}>
        <View>
          <Text category="h5" style={styles.actionTitle}>
            Adding Meditations
          </Text>
          <Text category="s1" style={styles.actionDescription}>
            Matching each file to its correct Meditation...
          </Text>
          <View>
            {/* <View
              style={{
                borderRadius: 50,
                height: 4,
                width: `${barWidth}%`,
                backgroundColor: '#9147BB',
                marginTop: 10,
              }}
            /> */}
          </View>
        </View>
      </View>
      <View style={styles.mainContainer} />
    </Layout>
  );
};

const themedStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  mainContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
  },
  actionTitle: {
    marginVertical: 10,
    textAlign: 'center',
  },
  actionDescription: {
    textAlign: 'center',
  },
});

export default AddMedsMatchingScreen;
