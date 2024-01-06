import firestore from '@react-native-firebase/firestore';
import {User} from '../contexts/userData';

export const fbSendFeedback = async (
  user: User,
  subject: string,
  feedback: string,
) => {
  return firestore()
    .collection('feedback')
    .add({
      date: new Date().toString(),
      email: user.profile.email,
      subject,
      feedback,
      status: 'Unresolved',
    })
    .then(() => {
      console.log('FB send feedback success');
      return true;
    })
    .catch(e => {
      console.log('FB send feedback failed', e);
      return false;
    });
};
