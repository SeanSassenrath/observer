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

      console.log('fb get meditation: docs', docs);

      return ({
        lastDocument: docs[docs.length - 1],
        meditationHistory: meditationHistory,
      })
    })
}
