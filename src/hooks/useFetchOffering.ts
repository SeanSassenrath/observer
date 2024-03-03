import {useContext, useEffect, useState} from 'react';
import Purchases, {PurchasesOffering} from 'react-native-purchases';
import UserContext from '../contexts/userData';

export const useFetchOffering = () => {
  const [offering, setOffering] = useState({} as PurchasesOffering);
  const {user} = useContext(UserContext);

  useEffect(() => {
    fetchOfferings();
  }, []);

  const fetchOfferings = async () => {
    if (user.isSubscribed) {
      return;
    }

    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null) {
        console.log('Offerings', offerings.current);
        setOffering(offerings.current);
      }
    } catch (e) {
      console.log('error', e);
    }
  };

  return offering;
};
