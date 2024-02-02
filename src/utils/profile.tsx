import {Duration} from 'luxon';

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

  console.log('TotalMedTime: ', totalMeditationTime);
  if (!totalMeditationTime) {
    return 'test';
  }
  // const dur = Duration.fromObject({seconds: Math.round(totalMeditationTime)});
  const dur = Duration.fromObject({seconds: totalMeditationTime})
    .rescale()
    .toObject();

  if (dur) {
    if (dur.days && dur.hours) {
      return `${dur.days}d  ${dur.hours}h`;
    } else if (dur.hours && dur.minutes) {
      return `${dur.hours}h  ${dur.minutes}m`;
    } else if (dur.minutes && dur.seconds) {
      return `${dur.minutes}m  ${dur.seconds}s`;
    } else if (dur.seconds) {
      return `${dur.seconds}s`;
    }
  }
};
