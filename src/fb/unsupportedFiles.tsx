import firestore from '@react-native-firebase/firestore';
import {UnknownFileData} from '../types';
import {User} from '../contexts/userData';

export const fbAddUnsupportedFiles = async (
  user: User,
  files: UnknownFileData[],
) => {
  return firestore()
    .collection('unsupportedFiles')
    .add({
      date: new Date().toString(),
      email: user.profile.email,
      files,
      status: 'Unresolved',
    })
    .then(() => {
      console.log('FB add unsupported files success');
      return true;
    })
    .catch(e => {
      console.log('FB add unsupported files failed', e);
      return false;
    });
};
