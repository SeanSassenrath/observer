import auth from '@react-native-firebase/auth';

export const signOut = async () => {
  return auth()
    .signOut()
    .then(() => {
      console.log('User signed out');
      return true;
    })
    .catch(e => {
      console.log('User sign out failed', e);
      return false;
    });
};
