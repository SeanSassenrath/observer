import React, { useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
// import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut } from 'react-native-reanimated';

import UserContext from '../contexts/userData';
import FtuxContext from '../contexts/ftuxData';
import FullUserLoadedContext from '../contexts/fullUserLoaded';

const LoadingScreen = () => {
  const { user } = useContext(UserContext);
  const { fullUserLoaded } = useContext(FullUserLoadedContext);
  const { hasSeenFtux } = useContext(FtuxContext);
  const navigation = useNavigation();

  useEffect(() => {
    if (fullUserLoaded) {
      showLoadingMessage();
    }
  }, [fullUserLoaded])

  const showLoadingMessage = async () => {
    // await _showLoadingMessage();

    if (!user.hasBetaAccess) {
      navigation.navigate('BetaCheck');
      return;
    } else if (!hasSeenFtux) {
      navigation.navigate('AddFilesTutorial1');
      return;
    } else {
      navigation.navigate('TabNavigation');
      return;
    }
  }

  // const _showLoadingMessage = () => new Promise(
  //   resolve => (setTimeout(() => {
  //     resolve(null);
  //   }, 2000)
  // ));

  return (
    <Layout style={styles.container}>
      <SafeAreaView style={styles.container}>
        <Layout style={styles.contentContainer}>
          {/* <Animated.View
            key={'uniqueKey'}
            entering={FadeInDown.duration(400)}
          >
            <Text category='s1' style={styles.description} status='control'>
              What is the greatest expression of myself that I can be today?
            </Text>
          </Animated.View> */}
        </Layout>
      </SafeAreaView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 40,
  },
  description: {
    textAlign: 'center',
  }
})

export default LoadingScreen;
