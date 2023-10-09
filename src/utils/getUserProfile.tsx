import {UserUid, User} from '../contexts/userData';

export const getUserProfile = (
  userIdParam: UserUid,
  currentUser: User,
  otherUsers?: User[] | undefined,
) => {
  console.log('userIdParam', userIdParam);
  console.log('currentUser?.uid', currentUser?.uid);
  if (userIdParam === currentUser?.uid) {
    return currentUser;
  } else {
    console.log(otherUsers);
  }
};
