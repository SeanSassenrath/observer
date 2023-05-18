import firestore from '@react-native-firebase/firestore';
import { UnsupportedFileData } from '../types';
import { User } from '../contexts/userData';

export const fbAddUnsupportedFiles = async (
  user: User,
  files: UnsupportedFileData[],
) => {
  return firestore()
    .collection('unsupportedFiles')
    .add({
      user: user.profile,
      files,
    })
    .then(() => {
      console.log('FB add unsupported files success');
      return true;
    })
    .catch((e) => {
      console.log('FB add unsupported files failed', e);
      return false;
    })
}
