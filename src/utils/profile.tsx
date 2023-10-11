import {TIME_CHUNK} from '../constants/time';
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

export const getTotalMeditationTime = (currentUser: User) => {
  const totalMeditationTime =
    currentUser &&
    currentUser.meditationUserData &&
    currentUser.meditationUserData.totalMeditationTime;

  if (totalMeditationTime) {
    if (totalMeditationTime > TIME_CHUNK.DAY) {
      return `${
        Math.round((totalMeditationTime / TIME_CHUNK.DAY) * 100) / 100
      }d`;
    } else if (totalMeditationTime > TIME_CHUNK.HOUR) {
      return `${
        Math.round((totalMeditationTime / TIME_CHUNK.HOUR) * 100) / 100
      }h`;
    } else {
      return `${
        Math.round((totalMeditationTime / TIME_CHUNK.MINUTE) * 100) / 100
      }m`;
    }
  }
};
