import React from 'react';
import {Layout, Icon, Text, useStyleSheet} from '@ui-kitten/components';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {sortBy, values} from 'lodash';

import Button from '../components/Button';
import {
  AddMedsMatchingScreenNavigationProp,
  AddMedsMatchingScreenRouteProp,
} from '../types';
import {useNavigation} from '@react-navigation/native';
import {successGreen} from '../constants/colors';

const SuccessIcon = (props: any) => (
  <Icon
    {...props}
    style={iconStyles.successIcon}
    fill={successGreen}
    name="checkmark-circle-2-outline"
  />
);

const iconStyles = StyleSheet.create({
  successIcon: {
    height: 50,
    width: 50,
  },
});

interface Props {
  navigation: AddMedsMatchingScreenNavigationProp;
  route: AddMedsMatchingScreenRouteProp;
}

const AddMedsSuccessScreen = (props: Props) => {
  const styles = useStyleSheet(themedStyles);

  const {route} = props;
  const {medsFail, medsSuccess} = route.params;
  const medsSuccessList = values(medsSuccess);
  const sortedMedsSuccessList = sortBy(medsSuccessList, 'name');

  const navigation = useNavigation();

  const onNextPress = async () => {
    if (medsFail.length > 0) {
      navigation.navigate('AddMedsFix', {
        medsFail: medsFail,
      });
    } else {
      //@ts-ignore
      navigation.navigate('TabNavigation', {screen: 'Home'});
    }
  };

  return (
    <Layout level="4" style={styles.rootContainer}>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.topContainer}>
            <SuccessIcon />
            <Text category="h5" style={styles.errorTitle}>
              {medsSuccessList.length} Meditations Added
            </Text>
            <Text category="s1" style={styles.errorDescription}>
              These meditations have been added successfully
            </Text>
          </View>
          <View style={styles.mainContainer}>
            {sortedMedsSuccessList.map((med: any) => (
              <View key={med.name} style={styles.medContainer}>
                <Text category="h6" style={styles.medName}>
                  {med.name}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.scrollContentSpacer} />
        </ScrollView>
        <Layout level="2" style={styles.bottom}>
          <Button onPress={onNextPress} size="large" style={styles.nextButton}>
            Continue
          </Button>
        </Layout>
      </SafeAreaView>
    </Layout>
  );
};

const themedStyles = StyleSheet.create({
  scrollView: {
    height: '100%',
    paddingBottom: 160,
  },
  topContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 60,
    paddingTop: 40,
  },
  errorIconBig: {
    height: 50,
    width: 50,
  },
  errorTitle: {
    paddingVertical: 10,
  },
  errorDescription: {
    paddingVertical: 5,
    opacity: 0.9,
    textAlign: 'center',
  },
  mainContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  medContainer: {
    marginVertical: 20,
  },
  medName: {
    textAlign: 'center',
    color: 'color-primary-100',
  },
  unsupportedFileViewContainer: {
    marginBottom: 80,
    width: 380,
  },
  autocompleteInput: {
    marginTop: 10,
    width: 380,
  },
  autocompleteDropdown: {
    width: 380,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  bottom: {
    paddingBottom: 40,
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
    position: 'absolute',
    width: '100%',
    height: 140,
    bottom: 0,
  },
  container: {
    flex: 1,
  },
  countBackground: {
    borderRadius: 50,
    flexDirection: 'row',
    height: 10,
  },
  countForeground: {
    borderRadius: 50,
    backgroundColor: 'color-primary-500',
    height: 10,
    width: '20%',
  },
  countText: {
    paddingBottom: 10,
  },
  description: {
    marginTop: 10,
    opacity: 0.75,
  },
  middle: {
    flex: 7,
    paddingHorizontal: 20,
  },
  modalBottom: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  modalButton: {
    marginTop: 20,
    width: 300,
  },
  modalContainer: {
    justifyContent: 'space-between',
    height: 400,
    width: 350,
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  modalTop: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  modalHeader: {
    width: '100%',
  },
  modalFile: {
    marginVertical: 20,
    opacity: 0.75,
    width: '100%',
  },
  nextButton: {
    color: 'white',
    marginBottom: 16,
  },
  noResults: {
    marginTop: 10,
    textAlign: 'center',
  },
  noResultsContainer: {
    marginTop: 20,
    opacity: 0.75,
  },
  rootContainer: {
    flex: 1,
  },
  scrollContentSpacer: {
    height: 200,
  },
  searchBar: {
    backgroundColor: 'rgba(48,55,75,0.6)',
    marginVertical: 16,
  },
  top: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    textAlign: 'center',
  },
  topContentContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  topText: {
    color: 'color-danger-400',
    marginLeft: 10,
  },
  unsupportedFileContainer: {
    borderRadius: 8,
    marginBottom: 20,
    paddingVertical: 16,
  },
  unsupportedFileName: {
    lineHeight: 24,
    opacity: 0.75,
  },
});

export default AddMedsSuccessScreen;
