/**
 * Tests for Firebase auth helpers.
 * Tests the wrapper functions that handle sign-in, sign-up, password reset, etc.
 */

import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  isEmailVerified,
  getCurrentUser,
  signOut,
  deleteUser,
} from '../../src/fb/auth';

// Get references to the mock functions
const mockAuth = auth() as any;
const mockCrashlytics = crashlytics() as any;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('signInWithEmailAndPassword', () => {
  it('returns success with user on valid credentials', async () => {
    const mockUser = {uid: 'test-123', email: 'test@test.com'};
    mockAuth.signInWithEmailAndPassword.mockResolvedValue({user: mockUser});

    const result = await signInWithEmailAndPassword('test@test.com', 'password123');

    expect(result.success).toBe(true);
    expect(result.user).toEqual(mockUser);
    expect(mockAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
      'test@test.com',
      'password123',
    );
    expect(mockCrashlytics.log).toHaveBeenCalledWith('Email sign-in attempt');
  });

  it('returns error for wrong password', async () => {
    mockAuth.signInWithEmailAndPassword.mockRejectedValue({
      code: 'auth/wrong-password',
      message: 'Wrong password',
    });

    const result = await signInWithEmailAndPassword('test@test.com', 'wrong');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Incorrect password. Please try again.');
    expect(result.errorCode).toBe('auth/wrong-password');
  });

  it('returns error for user not found', async () => {
    mockAuth.signInWithEmailAndPassword.mockRejectedValue({
      code: 'auth/user-not-found',
      message: 'User not found',
    });

    const result = await signInWithEmailAndPassword('nobody@test.com', 'pass');

    expect(result.success).toBe(false);
    expect(result.error).toBe('No account found with this email address.');
  });

  it('returns error for too many requests', async () => {
    mockAuth.signInWithEmailAndPassword.mockRejectedValue({
      code: 'auth/too-many-requests',
      message: 'Too many requests',
    });

    const result = await signInWithEmailAndPassword('test@test.com', 'pass');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Too many failed attempts. Please try again later.');
  });

  it('returns error when no user returned', async () => {
    mockAuth.signInWithEmailAndPassword.mockResolvedValue({user: null});

    const result = await signInWithEmailAndPassword('test@test.com', 'pass');

    expect(result.success).toBe(false);
    expect(result.error).toBe('No user returned from sign-in');
  });

  it('records error to crashlytics on failure', async () => {
    const error = {code: 'auth/wrong-password', message: 'Wrong'};
    mockAuth.signInWithEmailAndPassword.mockRejectedValue(error);

    await signInWithEmailAndPassword('test@test.com', 'wrong');

    expect(mockCrashlytics.recordError).toHaveBeenCalledWith(error);
  });
});

describe('createUserWithEmailAndPassword', () => {
  it('returns success and sends verification email', async () => {
    const mockUser = {
      uid: 'new-uid',
      email: 'new@test.com',
      sendEmailVerification: jest.fn(() => Promise.resolve()),
    };
    mockAuth.createUserWithEmailAndPassword.mockResolvedValue({user: mockUser});
    mockAuth.currentUser = mockUser;

    const result = await createUserWithEmailAndPassword('new@test.com', 'pass123');

    expect(result.success).toBe(true);
    expect(result.user).toEqual(mockUser);
    expect(mockCrashlytics.setUserId).toHaveBeenCalledWith('new-uid');
  });

  it('returns error for existing email', async () => {
    mockAuth.createUserWithEmailAndPassword.mockRejectedValue({
      code: 'auth/email-already-in-use',
      message: 'Email in use',
    });

    const result = await createUserWithEmailAndPassword('existing@test.com', 'pass');

    expect(result.success).toBe(false);
    expect(result.error).toBe('An account with this email already exists.');
    expect(result.errorCode).toBe('auth/email-already-in-use');
  });

  it('returns error for weak password', async () => {
    mockAuth.createUserWithEmailAndPassword.mockRejectedValue({
      code: 'auth/weak-password',
      message: 'Weak password',
    });

    const result = await createUserWithEmailAndPassword('test@test.com', '12');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Password should be at least 6 characters.');
  });

  it('returns error when no user returned', async () => {
    mockAuth.createUserWithEmailAndPassword.mockResolvedValue({user: null});

    const result = await createUserWithEmailAndPassword('test@test.com', 'pass123');

    expect(result.success).toBe(false);
    expect(result.error).toBe('No user returned from sign-up');
  });
});

describe('sendPasswordResetEmail', () => {
  it('returns success for valid email', async () => {
    mockAuth.sendPasswordResetEmail.mockResolvedValue(undefined);

    const result = await sendPasswordResetEmail('test@test.com');

    expect(result.success).toBe(true);
    expect(mockAuth.sendPasswordResetEmail).toHaveBeenCalledWith('test@test.com');
  });

  it('returns error for unknown email', async () => {
    mockAuth.sendPasswordResetEmail.mockRejectedValue({
      code: 'auth/user-not-found',
      message: 'User not found',
    });

    const result = await sendPasswordResetEmail('nobody@test.com');

    expect(result.success).toBe(false);
    expect(result.error).toBe('No account found with this email address.');
  });

  it('returns error for invalid email format', async () => {
    mockAuth.sendPasswordResetEmail.mockRejectedValue({
      code: 'auth/invalid-email',
      message: 'Invalid email',
    });

    const result = await sendPasswordResetEmail('not-an-email');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Please enter a valid email address.');
  });
});

describe('sendEmailVerification', () => {
  it('returns success when user exists', async () => {
    const mockUser = {sendEmailVerification: jest.fn(() => Promise.resolve())};
    mockAuth.currentUser = mockUser;

    const result = await sendEmailVerification();

    expect(result.success).toBe(true);
    expect(mockUser.sendEmailVerification).toHaveBeenCalled();
  });

  it('returns error when no user signed in', async () => {
    mockAuth.currentUser = null;

    const result = await sendEmailVerification();

    expect(result.success).toBe(false);
    expect(result.error).toBe('No user is currently signed in.');
  });
});

describe('isEmailVerified', () => {
  it('returns true when email is verified', () => {
    mockAuth.currentUser = {emailVerified: true};
    expect(isEmailVerified()).toBe(true);
  });

  it('returns false when email is not verified', () => {
    mockAuth.currentUser = {emailVerified: false};
    expect(isEmailVerified()).toBe(false);
  });

  it('returns false when no user', () => {
    mockAuth.currentUser = null;
    expect(isEmailVerified()).toBe(false);
  });
});

describe('getCurrentUser', () => {
  it('returns current user', () => {
    const user = {uid: 'test'};
    mockAuth.currentUser = user;
    expect(getCurrentUser()).toEqual(user);
  });
});

describe('signOut', () => {
  it('returns true on success', async () => {
    mockAuth.signOut.mockResolvedValue(undefined);
    const result = await signOut();
    expect(result).toBe(true);
  });

  it('returns false on failure', async () => {
    mockAuth.signOut.mockRejectedValue(new Error('Sign out failed'));
    const result = await signOut();
    expect(result).toBe(false);
  });
});

describe('deleteUser', () => {
  it('returns true on success', async () => {
    const mockUser = {delete: jest.fn(() => Promise.resolve())};
    mockAuth.currentUser = mockUser;

    const result = await deleteUser();
    expect(result).toBe(true);
  });

  it('returns false on failure', async () => {
    const mockUser = {delete: jest.fn(() => Promise.reject(new Error('fail')))};
    mockAuth.currentUser = mockUser;

    const result = await deleteUser();
    expect(result).toBe(false);
  });
});
