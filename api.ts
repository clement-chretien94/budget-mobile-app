import {
  Budget,
  User,
  UserConnect,
  UserCreate,
  BudgetCreate,
  Category,
  CategoryCreate,
  Transaction,
  TransactionCreate,
} from "./types";

const baseUrl = "http://192.168.1.21:3000";

export const createUser = async (user: UserCreate): Promise<User> => {
  const response = await fetch(`${baseUrl}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  const data = await response.json();
  console.log("User created:", data);
  return data;
};

export const connectUser = async (
  username: string,
  password: string
): Promise<UserConnect> => {
  const response = await fetch(`${baseUrl}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    console.log("Error connecting user", response.status, response.statusText);
    throw new Error("Failed to connect user");
  }

  const data = await response.json();
  console.log("User connected:", data);
  return data;
};

export const getConnectedUser = async (jwt: string): Promise<User> => {
  const response = await fetch(`${baseUrl}/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  const data = await response.json();
  console.log("User fetched:", data);
  //console.log("JWT: ", jwt);
  return data;
};

export const getCurrentBudget = async (jwt: string): Promise<Budget> => {
  const response = await fetch(`${baseUrl}/budgets/current`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch current budget");
  }

  const data = await response.json();
  console.log("Budget fetched:", data);
  return data;
};

export const createBudget = async (
  jwt: string,
  budget: BudgetCreate
): Promise<Budget> => {
  const response = await fetch(`${baseUrl}/budgets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(budget),
  });

  if (!response.ok) {
    throw new Error("Failed to create budget");
  }

  const data = await response.json();
  console.log("Budget created:", data);
  return data;
};

export const createCategory = async (
  jwt: string,
  category: CategoryCreate
): Promise<Category> => {
  const { budgetId, ...categoryWithoutBudgetId } = category;
  const response = await fetch(
    `${baseUrl}/budgets/${category.budgetId}/categories`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(categoryWithoutBudgetId),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create category");
  }

  const data = await response.json();
  console.log("Category created:", data);
  return data;
};

export const getCategories = async (
  jwt: string,
  budgetId: number
): Promise<Category[]> => {
  const response = await fetch(`${baseUrl}/budgets/${budgetId}/categories`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data = await response.json();
  console.log("Categories fetched:", data);
  return data;
};

export const getTransactions = async (
  jwt: string,
  budgetId: number
): Promise<Transaction[]> => {
  const response = await fetch(`${baseUrl}/budgets/${budgetId}/transactions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });

  if (!response.ok) {
    console.error(
      "Error fetching transactions:",
      response.status,
      response.statusText
    );
    throw new Error("Failed to fetch transactions");
  }

  const data = await response.json();
  console.log("Transactions fetched:", data);
  return data;
};

export const createTransaction = async (
  jwt: string,
  budgetId: number,
  transaction: TransactionCreate
): Promise<Transaction> => {
  const response = await fetch(`${baseUrl}/budgets/${budgetId}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(transaction),
  });

  if (!response.ok) {
    throw new Error("Failed to create transaction");
  }

  const data = await response.json();
  console.log("Transaction created:", data);
  return data;
};
