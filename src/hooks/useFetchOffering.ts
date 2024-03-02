import {useEffect, useState} from 'react';
import Purchases, {PurchasesOffering} from 'react-native-purchases';

export const useFetchOffering = () => {
  const [offering, setOffering] = useState({} as PurchasesOffering);

  useEffect(() => {
    fetchOfferings();
  }, []);

  const fetchOfferings = async () => {
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
