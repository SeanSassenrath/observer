import PostHog from 'posthog-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {POSTHOG_API_KEY} from '@env';

/**
 * Shared PostHog client instance for use outside React components.
 * The PostHogProvider in Stack.tsx also uses this client so there's
 * a single instance throughout the app.
 */
export const posthogClient = new PostHog(POSTHOG_API_KEY, {
  host: 'https://us.i.posthog.com',
  customStorage: AsyncStorage,
});
