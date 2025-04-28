export type AuthState = {
  isLoggedIn: boolean;
  user: User | null;
  jwtToken: string | undefined;
  isReady: boolean;
  logIn: ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => void;
  logOut: () => void;
  signUp: ({}: UserCreate) => void;
};

export type User = {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type UserCreate = {
  username: string;
  email: string;
  password: string;
};

export type UserConnect = {
  jwt: string;
  user: User;
};
