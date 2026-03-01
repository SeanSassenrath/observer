import PostHog from 'posthog-react-native';

export const captureAddFlowEvent = (
  posthog: PostHog,
  event: string,
  properties?: Record<string, any>,
) => {
  posthog.capture(event, {flow: 'add_meditation', ...properties});
};

export const capturePlayFlowEvent = (
  posthog: PostHog,
  event: string,
  properties?: Record<string, any>,
) => {
  posthog.capture(event, {flow: 'play_meditation', ...properties});
};

export const captureFeatureFlagExposure = (
  posthog: PostHog,
  flagKey: string,
  flagValue: boolean,
) => {
  posthog.capture('feature_flag_exposure', {flag: flagKey, value: flagValue});
};

export const capturePlaylistFlowEvent = (
  posthog: PostHog,
  event: string,
  properties?: Record<string, any>,
) => {
  posthog.capture(event, {flow: 'playlist', ...properties});
};
