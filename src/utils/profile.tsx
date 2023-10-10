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

export const getTotalMeditationCount = (currentUser: User) => {
  const meditationCounts =
    currentUser &&
    currentUser.meditationUserData &&
    currentUser.meditationUserData.meditationCounts;

  if (meditationCounts) {
    let count = 0;

    for (const key in meditationCounts) {
      const meditation = meditationCounts[key];
      count += meditation.count;
    }

    return count;
  }
};
