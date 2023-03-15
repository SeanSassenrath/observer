import firestore from '@react-native-firebase/firestore';
import { User, UserUid } from '../contexts/userData';

export const fbGetUser = async (userId: UserUid) => {
  return firestore()
    .collection('users')
    .doc(userId)
    .get()
    .then(document => {
      console.log('FB get user success');
      return document
    })
    .catch((e) => {
      console.log('FB get user failed', e);
    })
}

export const fbAddUser = async (
  userId: UserUid,
  user: User,
) => {
  return firestore()
    .collection('users')
    .doc(userId)
    .set(user)
    .then(() => {
      console.log('FB add user success');
      return true;
    })
    .catch((e) => {
      console.log('FB add user failed', e);
    })
}

export const fbUpdateUser = async (
  userId: UserUid,
  update: any,
) => {
  return firestore()
    .collection('users')
    .doc(userId)
    .update(update)
    .then(() => {
      console.log('FB update user success:', update);
      return true;
    })
    .catch((e) => {
      console.log('FB update user failed:', update);
      return false;
    })
}
