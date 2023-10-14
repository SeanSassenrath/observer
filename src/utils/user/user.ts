import {User} from '../../contexts/userData';

export const getUserMeditationInstanceCounts = (user: User) =>
  user && user.meditationUserData && user.meditationUserData.meditationCounts;
