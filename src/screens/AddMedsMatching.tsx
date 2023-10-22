import React, {useEffect} from 'react';
import {Text, useStyleSheet} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {darkBg} from '../constants/colors';
import {
  AddMedsMatchingScreenRouteProp,
  AddMedsMatchingScreenNavigationProp,
} from '../types';
import {values} from 'lodash';

interface Props {
  navigation: AddMedsMatchingScreenNavigationProp;
  route: AddMedsMatchingScreenRouteProp;
}

const AddMedsMatchingScreen = (props: Props) => {
  const styles = useStyleSheet(themedStyles);
  const {route} = props;
  const {medsFail, medsSuccess} = route.params;
  const navigation = useNavigation();
  const medsSuccessList = values(medsSuccess);

  useEffect(() => {
    console.log('medsFail', medsFail);
    console.log('medsSuccess', medsSuccess);

    setTimeout(() => {
      if (medsSuccessList.length > 0) {
        navigation.navigate('AddMedsSuccess', {
          medsSuccess: medsSuccess,
          medsFail: medsFail,
        });
      }
    }, 4000);
  }, []);

  return (
    <View style={styles.screenContainer}>
      <View style={styles.mainContainer}>
        <View>
          <Text category="h5" style={styles.actionTitle}>
            Adding Meditations
          </Text>
          <Text category="s1" style={styles.actionDescription}>
            Matching each file to its correct Meditation
          </Text>
        </View>
      </View>
      <View style={styles.mainContainer} />
    </View>
  );
};

const themedStyles = StyleSheet.create({
  screenContainer: {
    backgroundColor: darkBg,
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
