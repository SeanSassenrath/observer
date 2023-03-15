import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { UserUid } from '../contexts/userData';
import { MeditationInstance } from '../types';

export const fbGetMeditationHistory = async (
  userId: UserUid,
  lastDocument?: FirebaseFirestoreTypes.DocumentData,
) => {
  return firestore()
    .collection('users')
    .doc(userId)
    .collection('meditationHistory')
    .orderBy('creationTime', 'desc')
    .limit(20)
    .get()
    .then((meditationInstances) => {
      const docs = meditationInstances.docs;
      const meditationHistory = docs.map(doc => doc.data());
      console.log('FB get meditation history success:', meditationHistory);

      return ({
        lastDocument: docs[docs.length - 1],
        meditationHistory: meditationHistory,
      })
    })
    .catch((e) => {
      console.log('FB get meditation history failed:', e);
    })
}

export const fbAddMeditationHistory = async (
  userId: UserUid,
  meditationInstance: MeditationInstance,
) => {
  return firestore()
    .collection('users')
    .doc(userId)
    .collection('meditationHistory')
    .add(meditationInstance)
    .then(() => {
      console.log('FB add meditation history success:', meditationInstance);
    })
    .catch((e) => {
      console.log('FB add meditation history success:', e);
    })
}
