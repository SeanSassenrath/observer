import firestore from '@react-native-firebase/firestore';
import { UserUid } from '../contexts/userData';

export const fbUpdateUser = (
  userId: UserUid,
  update: any,
) => {
  return firestore()
    .collection('users')
    .doc(userId)
    .update(update)
    .then(() => {
      console.log('FB User update success:', update);
    })
    .catch((e) => {
      console.log('FB User update failed:', update);
    })
}
