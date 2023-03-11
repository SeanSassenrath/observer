import firestore from '@react-native-firebase/firestore';
import { User } from '../contexts/userData';

const betaUserListId = 'be7Enl9EJK74NcI0Zxtz'

export const fbFetchBetaUserList = () =>
  firestore()
    .collection('betaUsers')
    .doc(betaUserListId)
    .get()
    .then(documentSnapshot => {
      if (documentSnapshot.exists) {
        return documentSnapshot.data();
      }
    })
    .catch((e) => {
      console.log('beta user list not fetched', e)
    });

export const fbSetUserBetaAccessState = (user: User) => {
  console.log('User in fb beta user list', user);
  return firestore()
    .collection('users')
    .doc(user.uid)
    .update({
      hasBetaAccess: true,
    })
    .then(() => {
      console.log('user beta access field updated')
    })
    .catch((e) => {
      console.log('user beta access field not updated', e)
    });
}
