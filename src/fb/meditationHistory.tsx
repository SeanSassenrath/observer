import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { UserUid } from '../contexts/userData';
import { MeditationInstance } from '../types';

export const fbGetMeditationHistory = (
  lastDocument?: FirebaseFirestoreTypes.DocumentData,
) => {
  return firestore()
    .collection('users')
    .doc()
    .collection('meditationHistory')
    .orderBy('creationTime', 'desc')
    .limit(20)
    .get()
    .then((meditationInstances) => {
      const docs = meditationInstances.docs;
      const meditationHistory = docs.map(doc => doc.data());

      return ({
        lastDocument: docs[docs.length - 1],
        meditationHistory: meditationHistory,
      })
    })
}
