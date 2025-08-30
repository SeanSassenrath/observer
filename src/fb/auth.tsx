import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';

// Types for auth responses
export interface AuthResult {
  success: boolean;
  user?: any;
  error?: string;
  errorCode?: string;
}

export interface AuthError {
  code: string;
  message: string;
}

// Helper function to get user-friendly error messages
const getAuthErrorMessage = (error: AuthError): string => {
  switch (error.code) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    default:
      return error.message || 'An unexpected error occurred.';
  }
};

// Email/Password Sign In
export const signInWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  try {
    crashlytics().log('Email sign-in attempt');
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    const { user } = userCredential;

    if (user) {
      crashlytics().setUserId(user.uid);
      crashlytics().log('Email sign-in success');
      
      return {
        success: true,
        user: user,
      };
    } else {
      return {
        success: false,
        error: 'No user returned from sign-in',
      };
    }
  } catch (error: any) {
    crashlytics().recordError(error);
    console.log('Email sign-in failed:', error);
    
    return {
      success: false,
      error: getAuthErrorMessage(error),
      errorCode: error.code,
    };
  }
};

// Email/Password Sign Up
export const createUserWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  try {
    crashlytics().log('Email sign-up attempt');
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const { user } = userCredential;

    if (user) {
      crashlytics().setUserId(user.uid);
      crashlytics().log('Email sign-up success');
      
      // Send email verification
      await sendEmailVerification();
      
      return {
        success: true,
        user: user,
      };
    } else {
      return {
        success: false,
        error: 'No user returned from sign-up',
      };
    }
  } catch (error: any) {
    crashlytics().recordError(error);
    console.log('Email sign-up failed:', error);
    
    return {
      success: false,
      error: getAuthErrorMessage(error),
      errorCode: error.code,
    };
  }
};

// Send Password Reset Email
export const sendPasswordResetEmail = async (email: string): Promise<AuthResult> => {
  try {
    crashlytics().log('Password reset email attempt');
    await auth().sendPasswordResetEmail(email);
    crashlytics().log('Password reset email sent');
    
    return {
      success: true,
    };
  } catch (error: any) {
    crashlytics().recordError(error);
    console.log('Password reset failed:', error);
    
    return {
      success: false,
      error: getAuthErrorMessage(error),
      errorCode: error.code,
    };
  }
};

// Send Email Verification
export const sendEmailVerification = async (): Promise<AuthResult> => {
  try {
    const user = auth().currentUser;
    if (!user) {
      return {
        success: false,
        error: 'No user is currently signed in.',
      };
    }

    crashlytics().log('Email verification attempt');
    await user.sendEmailVerification();
    crashlytics().log('Email verification sent');
    
    return {
      success: true,
    };
  } catch (error: any) {
    crashlytics().recordError(error);
    console.log('Email verification failed:', error);
    
    return {
      success: false,
      error: getAuthErrorMessage(error),
      errorCode: error.code,
    };
  }
};

// Check if user's email is verified
export const isEmailVerified = (): boolean => {
  const user = auth().currentUser;
  return user?.emailVerified || false;
};

// Get current user
export const getCurrentUser = () => {
  return auth().currentUser;
};

// Existing functions (keeping backward compatibility)
export const signOut = async () => {
  return auth()
    .signOut()
    .then(() => {
      console.log('User signed out');
      return true;
    })
    .catch(e => {
      console.log('User sign out failed', e);
      return false;
    });
};

export const deleteUser = async () => {
  const user = auth().currentUser;

  return user
    ?.delete()
    .then(() => {
      console.log('User delete success');
      return true;
    })
    .catch(e => {
      console.log('User delete failed', e);
      return false;
    });
};
