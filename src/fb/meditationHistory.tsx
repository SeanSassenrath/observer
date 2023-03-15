import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { UserUid } from '../contexts/userData';
import { MeditationInstance } from '../types';

interface FbMeditationHistory {
  meditationInstances: MeditationInstance[],
  lastDocument: FirebaseFirestoreTypes.DocumentData,
}

export const fbGetMeditationHistory = (
  userId: UserUid,
  lastDocument?: FirebaseFirestoreTypes.DocumentData,
): FbMeditationHistory | any => {
  return firestore()
    .collection('users')
    .doc(userId)
    .collection('meditationHistory')
    .orderBy('creationTime', 'desc')
    .limit(20)
    .get()
    .then((meditationHistory) => {
      const docs = meditationHistory.docs;
      const meditationInstances = docs.map(doc => doc.data());
      console.log('FB get meditation history success:', meditationHistory);

      return ({
        lastDocument: docs[docs.length - 1],
        meditationInstances: meditationInstances,
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
