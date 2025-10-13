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
  totalBalance: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  categories: Category[];
};

export type BudgetCategory = Omit<Budget, "categories"> & {
  categories: {
    id: number;
    name: string;
    emoji: string;
    limitAmount: number;
    totalExpenses: number;
  }[];
};

export type BudgetCreate = {
  month: number;
  year: number;
  stableIncome: number;
};

export type Category = {
  id: number;
  name: string;
  emoji: string;
  color: string;
  limitAmount?: number;
  budgetId: number;
  createdAt: string;
  updatedAt: string;
  transactions: Transaction[];
};

export type CategoryCreate = {
  name: string;
  emoji: string;
  color: string;
};

export type TransactionType = "expense" | "income";

export type Transaction = {
  id: number;
  amount: number;
  type: TransactionType;
  name: string;
  date: string;
  categoryId: number;
  categoryName?: string;
  categoryEmoji?: string;
  budgetId: number;
  createdAt: string;
  updatedAt: string;
};

export type TransactionCreate = {
  name: string;
  type: string;
  amount: number;
  date: Date;
  categoryId?: number;
};
