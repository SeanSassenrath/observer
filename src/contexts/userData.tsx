import { createContext } from 'react';

interface User {
  createdAt: number,
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  profileImg: string,
}

interface UserContext {
  user: User,
}

const userContext = {} as UserContext;

const UserContext = createContext(userContext);

export default UserContext;
