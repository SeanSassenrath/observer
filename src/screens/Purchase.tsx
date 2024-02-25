import {Layout, Text} from '@ui-kitten/components';
import React, {useContext, useState} from 'react';
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

import _Button from '../components/Button';
import {useNavigation} from '@react-navigation/native';
import {PurchaseScreenRouteProp} from '../types';
import Purchases from 'react-native-purchases';
import {ENTITLEMENT_ID} from '../constants/purchase';
import PurchaseModal from '../components/PurchaseModal';
import UserContext from '../contexts/userData';

interface Props {
  route: PurchaseScreenRouteProp;
}

const Purchase = (props: Props) => {
  const {user, setUser} = useContext(UserContext);

  const {route} = props;
  const {offering} = route.params;
  const annualPriceString = offering.annual?.product.priceString;
  const annualPrice = offering.annual?.product.price;
  const monthlyPrice = annualPrice
    ? Math.round((annualPrice / 12) * 100) / 100
    : '';
  const purchasePackage = offering.annual;

  const [isPurchasing, setIsPurchasing] = useState(false);

  const navigation = useNavigation();

  const onPurchase = async () => {
    if (!purchasePackage) {
      return;
    }

    setIsPurchasing(true);

    try {
      const purchaseResult = await Purchases.purchasePackage(purchasePackage);
      console.log('Purchase Result', purchaseResult.customerInfo.entitlements);

      if (
        typeof purchaseResult.customerInfo.entitlements.active[
          ENTITLEMENT_ID
        ] !== 'undefined'
      ) {
        setUser({
          ...user,
          isSubscribed: true,
        });
        navigation.navigate('AddMeditations');
      }
    } catch (e: any) {
      if (!e.userCancelled) {
        Alert.alert('Error purchasing package', e.message);
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const onLimitedVersionPress = () => {
    navigation.navigate('LimitedVersion');
  };

  return (
    <Layout level="2" style={styles.rootContainer}>
      <SafeAreaView style={styles.rootContainer}>
        <View style={styles.topContainer}>
          <Text category="h5" style={styles.headerText}>
            Let's get started!
          </Text>
          <Text category="s1" style={styles.priceText}>
            {`First 7 days free, then $${monthlyPrice}/month billed at ${annualPriceString} annually`}
          </Text>
        </View>
        <View style={styles.midContainer}>
          <View style={styles.featureList}>
            <View style={styles.featureContainer}>
              <View style={styles.checkContainer}>
                <Image
                  source={require('../assets/check-mark.png')}
                  style={styles.check}
                />
              </View>
              <Text category="s1" style={styles.featureText}>
                All of your Dr. Joe Dispenza meditations in one place
              </Text>
            </View>
            <View style={styles.featureContainer}>
              <View style={styles.checkContainer}>
                <Image
                  source={require('../assets/check-mark.png')}
                  style={styles.check}
                />
              </View>
              <Text category="s1" style={styles.featureText}>
                Enhanced meditation player with seamless breathwork
              </Text>
            </View>
            <View style={styles.featureContainer}>
              <View style={styles.checkContainer}>
                <Image
                  source={require('../assets/check-mark.png')}
                  style={styles.check}
                />
              </View>
              <Text category="s1" style={styles.featureText}>
                Data insights on your meditation practice (history, streaks,
                thinkbox)
              </Text>
            </View>
            <View style={styles.featureContainer}>
              <View style={styles.checkContainer}>
                <Image
                  source={require('../assets/check-mark.png')}
                  style={styles.check}
                />
              </View>
              <Text category="s1" style={styles.featureText}>
                And more...
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <_Button size="large" onPress={onPurchase}>
            Start my free trial
          </_Button>
          <Pressable onPress={onLimitedVersionPress}>
            <Text category="s1" style={styles.limitedText}>
              Continue with the limited version
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
      <PurchaseModal isVisible={isPurchasing} />
    </Layout>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    flex: 2,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  check: {
    height: 40,
    width: 40,
  },
  checkContainer: {
    flex: 2,
  },
  featureContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  featureList: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 300,
    flex: 1,
  },
  featureText: {
    flex: 8,
  },
  headerText: {
    marginBottom: 20,
  },
  midContainer: {
    alignItems: 'center',
    flex: 5,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  limitedText: {
    marginTop: 30,
    opacity: 0.8,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  priceText: {
    textAlign: 'center',
  },
  rootContainer: {
    flex: 1,
  },
  topContainer: {
    alignItems: 'center',
    flex: 3,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});

export default Purchase;
