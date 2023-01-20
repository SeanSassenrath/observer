import React, { createContext } from 'react';

interface UserMetaData {
  creationTime: number,
  lastSignInTime: number,
}

interface User {
  displayName: string,
  email: string,
  metaData: UserMetaData,
  photoURL: string,
  uid: string,
}

interface UserContext {
  user: User,
  setUser: React.Dispatch<React.SetStateAction<User>>,
}

const initialUserContext = {} as UserContext;

const UserContext = createContext(initialUserContext);

export const initialUserState = {
  displayName: '',
  email: '',
  metaData: {
    creationTime: 0,
    lastSignInTime: 0,
  },
  photoURL: '',
  uid: '',
};

export default UserContext;
