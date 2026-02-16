import firestore from '@react-native-firebase/firestore';
import {User} from '../contexts/userData';

export interface MeditationSubmission {
  fileName: string | null;
  fileSize: number | null;
  fileType: string | null;
  suggestedName: string;
  suggestedArtist: string;
  submittedBy: string;
  submitterEmail: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'duplicate';
}

export const fbSubmitMeditationRequest = async (
  user: User,
  submission: {
    fileName: string | null;
    fileSize: number | null;
    fileType: string | null;
    suggestedName: string;
    suggestedArtist: string;
  },
) => {
  const doc: MeditationSubmission = {
    ...submission,
    submittedBy: user.uid,
    submitterEmail: user.profile?.email || '',
    submittedAt: new Date().toISOString(),
    status: 'pending',
  };

  return firestore()
    .collection('submissions')
    .add(doc)
    .then(() => {
      console.log('FB submission success');
      return true;
    })
    .catch(e => {
      console.log('FB submission failed', e);
      return false;
    });
};
