import {User} from '../../contexts/userData';

export const getUserMeditationInstanceCounts = (user: User) =>
  user && user.meditationUserData && user.meditationUserData.meditationCounts;

export const getUserHasMeditated = (user: User) => {
  const userMeditationInstanceCounts = getUserMeditationInstanceCounts(user);
  return !!(
    userMeditationInstanceCounts &&
    Object.keys(userMeditationInstanceCounts).length > 0
  );
};

export const getUserSawBreathOnboarding = (user: User) =>
  user && user.onboarding && user.onboarding.hasSeenBreathworkOnboarding;

export const getIsSubscribed = (user: User) => !!(user && user.isSubscribed);
