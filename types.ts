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

export type Budget = {
  id: number;
  month: number;
  year: number;
  stableIncome: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  transactions: Transaction[];
};

export type Category = {
  id: number;
  name: string;
  emoji: string;
  color: string;
  limitAmount?: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  transactions: Transaction[];
};

export type Transaction = {
  id: number;
  amount: number;
  description: string;
  type: string;
  date: string;
  categoryId: number;
  budgetId: number;
  createdAt: string;
  updatedAt: string;
};
