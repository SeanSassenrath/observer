import firestore from '@react-native-firebase/firestore';
import { UnsupportedFileData } from '../types';

export const fbAddUnsupportedFiles = async (
  files: UnsupportedFileData[],
) => {
  return firestore()
    .collection('unsupportedFiles')
    .add({ files })
    .then(() => {
      console.log('FB add unsupported files success');
      return true;
    })
    .catch((e) => {
      console.log('FB add unsupported files failed', e);
      return false;
    })
}
