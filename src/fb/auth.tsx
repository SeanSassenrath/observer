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

export const deleteUser = async () => {
  const user = auth().currentUser;

  return user
    ?.delete()
    .then(() => {
      console.log('User delete success');
      return true;
    })
    .catch(e => {
      console.log('User delete failed', e);
      return false;
    });
};
