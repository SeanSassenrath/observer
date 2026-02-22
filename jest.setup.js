// Jest setup file - mocks for native modules

// AsyncStorage mock
jest.mock('@react-native-async-storage/async-storage', () => {
  const store = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn((key) => Promise.resolve(store[key] || null)),
      setItem: jest.fn((key, value) => {
        store[key] = value;
        return Promise.resolve();
      }),
      removeItem: jest.fn((key) => {
        delete store[key];
        return Promise.resolve();
      }),
      clear: jest.fn(() => {
        Object.keys(store).forEach((key) => delete store[key]);
        return Promise.resolve();
      }),
      getAllKeys: jest.fn(() => Promise.resolve(Object.keys(store))),
    },
  };
});

// Firebase Auth mock (singleton so tests can inspect calls)
jest.mock('@react-native-firebase/auth', () => {
  const mockUser = {
    uid: 'test-uid',
    email: 'test@example.com',
    emailVerified: false,
    sendEmailVerification: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve()),
  };

  const authInstance = {
    signInWithEmailAndPassword: jest.fn(() =>
      Promise.resolve({user: mockUser}),
    ),
    createUserWithEmailAndPassword: jest.fn(() =>
      Promise.resolve({user: mockUser}),
    ),
    sendPasswordResetEmail: jest.fn(() => Promise.resolve()),
    signOut: jest.fn(() => Promise.resolve()),
    currentUser: mockUser,
    onAuthStateChanged: jest.fn(),
  };

  return {
    __esModule: true,
    default: jest.fn(() => authInstance),
  };
});

// Firebase Firestore mock
jest.mock('@react-native-firebase/firestore', () => {
  const collectionMock = {
    doc: jest.fn(() => ({
      get: jest.fn(() => Promise.resolve({exists: false, data: () => null})),
      set: jest.fn(() => Promise.resolve()),
      update: jest.fn(() => Promise.resolve()),
      delete: jest.fn(() => Promise.resolve()),
    })),
    add: jest.fn(() => Promise.resolve({id: 'mock-doc-id'})),
    where: jest.fn(() => collectionMock),
    orderBy: jest.fn(() => collectionMock),
    limit: jest.fn(() => collectionMock),
    get: jest.fn(() => Promise.resolve({docs: [], empty: true})),
  };

  return {
    __esModule: true,
    default: jest.fn(() => ({
      collection: jest.fn(() => collectionMock),
    })),
  };
});

// Firebase Analytics mock
jest.mock('@react-native-firebase/analytics', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    logEvent: jest.fn(() => Promise.resolve()),
    logScreenView: jest.fn(() => Promise.resolve()),
    setUserId: jest.fn(() => Promise.resolve()),
  })),
}));

// Firebase Crashlytics mock (singleton so tests can inspect calls)
jest.mock('@react-native-firebase/crashlytics', () => {
  const instance = {
    log: jest.fn(),
    recordError: jest.fn(),
    setUserId: jest.fn(),
    setAttribute: jest.fn(),
  };
  return {
    __esModule: true,
    default: jest.fn(() => instance),
  };
});

// Firebase Messaging mock
jest.mock('@react-native-firebase/messaging', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    requestPermission: jest.fn(() => Promise.resolve(1)),
    getToken: jest.fn(() => Promise.resolve('mock-token')),
  })),
}));

// React Native Track Player mock
jest.mock('react-native-track-player', () => ({
  __esModule: true,
  default: {
    setupPlayer: jest.fn(() => Promise.resolve()),
    add: jest.fn(() => Promise.resolve()),
    play: jest.fn(() => Promise.resolve()),
    pause: jest.fn(() => Promise.resolve()),
    stop: jest.fn(() => Promise.resolve()),
    reset: jest.fn(() => Promise.resolve()),
    skip: jest.fn(() => Promise.resolve()),
    skipToNext: jest.fn(() => Promise.resolve()),
    seekTo: jest.fn(() => Promise.resolve()),
    getProgress: jest.fn(() =>
      Promise.resolve({position: 0, duration: 0, buffered: 0}),
    ),
    getActiveTrack: jest.fn(() => Promise.resolve(null)),
    getActiveTrackIndex: jest.fn(() => Promise.resolve(null)),
    getState: jest.fn(() => Promise.resolve('none')),
    getQueue: jest.fn(() => Promise.resolve([])),
    updateOptions: jest.fn(() => Promise.resolve()),
    addEventListener: jest.fn(() => ({remove: jest.fn()})),
    destroy: jest.fn(() => Promise.resolve()),
  },
  useProgress: jest.fn(() => ({position: 0, duration: 0, buffered: 0})),
  usePlaybackState: jest.fn(() => ({state: 'none'})),
  useActiveTrack: jest.fn(() => null),
  State: {
    None: 'none',
    Playing: 'playing',
    Paused: 'paused',
    Stopped: 'stopped',
    Buffering: 'buffering',
    Ready: 'ready',
  },
  Capability: {
    Play: 'play',
    Pause: 'pause',
    SkipToNext: 'skip-to-next',
    SkipToPrevious: 'skip-to-previous',
    SeekTo: 'seek-to',
  },
  Event: {
    PlaybackState: 'playback-state',
    PlaybackTrackChanged: 'playback-track-changed',
    PlaybackQueueEnded: 'playback-queue-ended',
    RemotePlay: 'remote-play',
    RemotePause: 'remote-pause',
  },
  RepeatMode: {Off: 0, Track: 1, Queue: 2},
  AppKilledPlaybackBehavior: {ContinuePlayback: 'continue', StopPlaybackAndRemoveNotification: 'stop'},
}));

// Document Picker mock
jest.mock('react-native-document-picker', () => ({
  __esModule: true,
  default: {
    pick: jest.fn(() => Promise.resolve([])),
    pickSingle: jest.fn(() => Promise.resolve({})),
    isCancel: jest.fn(() => false),
  },
  types: {
    audio: 'audio/*',
    allFiles: '*/*',
  },
}));

// React Native mock additions
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// PostHog mock
jest.mock('posthog-react-native', () => ({
  usePostHog: jest.fn(() => ({
    capture: jest.fn(),
    identify: jest.fn(),
  })),
  PostHogProvider: ({children}) => children,
}));

// React Native Gesture Handler mock
jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({children}) => children,
  Swipeable: 'Swipeable',
  DrawerLayout: 'DrawerLayout',
  State: {},
  PanGestureHandler: 'PanGestureHandler',
  TapGestureHandler: 'TapGestureHandler',
}));

// Toast mock
jest.mock('react-native-toast-message', () => ({
  __esModule: true,
  default: {
    show: jest.fn(),
    hide: jest.fn(),
  },
}));
