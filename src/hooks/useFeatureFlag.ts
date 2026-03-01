import {useFeatureFlag as usePostHogFeatureFlag} from 'posthog-react-native';

export function useFeatureFlag(flag: string, defaultValue = false): boolean {
  const value = usePostHogFeatureFlag(flag);
  // PostHog returns undefined while loading — use default until resolved
  if (value === undefined) {
    return defaultValue;
  }
  return Boolean(value);
}
