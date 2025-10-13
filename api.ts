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
  BudgetCategory,
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
  return data;
};

export const getBudgetByDate = async (
  jwt: string,
  month: number,
  year: number
): Promise<BudgetCategory> => {
  const response = await fetch(
    `${baseUrl}/budgets?month=${month}&year=${year}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    }
  );

  console.log("Fetching budget for", month, year);
  console.log("Response status:", response.status, response.statusText);

  if (!response.ok) {
    throw new Error("Failed to fetch budget");
  }

  const data = await response.json();
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
  return data;
};

export const createCategory = async (
  jwt: string,
  category: CategoryCreate
): Promise<Category> => {
  const response = await fetch(`${baseUrl}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(category),
  });

  if (!response.ok) {
    throw new Error("Failed to create category");
  }

  const data = await response.json();
  return data;
};

export const addCategoryToBudget = async (
  jwt: string,
  category: { budgetId: number; categoryId: number; limitAmount: number }
): Promise<void> => {
  const { budgetId, ...categoryWithoutBudgetId } = category;
  console.log("Adding category to budget:", categoryWithoutBudgetId);
  const response = await fetch(`${baseUrl}/budgets/${budgetId}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(categoryWithoutBudgetId),
  });

  if (!response.ok) {
    throw new Error("Failed to add category to budget");
  }
};

export const getCategories = async (jwt: string): Promise<Category[]> => {
  const response = await fetch(`${baseUrl}/categories`, {
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
  return data;
};

export const getCategoriesByBudget = async (
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
  return data;
};

export const getTransactionsByBudget = async (
  jwt: string,
  budgetId: number,
  limit: number | undefined = undefined
): Promise<Transaction[]> => {
  const response = await fetch(
    `${baseUrl}/budgets/${budgetId}/transactions${
      limit ? `?take=${limit}` : ""
    }`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    }
  );

  if (!response.ok) {
    console.error(
      "Error fetching transactions:",
      response.status,
      response.statusText
    );
    throw new Error("Failed to fetch transactions");
  }

  const data = await response.json();
  return data;
};

export const getTransactions = async (
  jwt: string,
  limit: number | undefined = undefined
): Promise<Transaction[]> => {
  const response = await fetch(
    `${baseUrl}/transactions${limit ? `?take=${limit}` : ""}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    }
  );

  if (!response.ok) {
    console.error(
      "Error fetching transactions:",
      response.status,
      response.statusText
    );
    throw new Error("Failed to fetch transactions");
  }

  const data = await response.json();
  return data;
};

export const createTransaction = async (
  jwt: string,
  transaction: TransactionCreate
): Promise<Transaction> => {
  const response = await fetch(`${baseUrl}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(transaction),
  });

  console.log("Creating transaction:", transaction);
  console.log("Response status:", response.status, response.statusText);

  if (!response.ok) {
    const errorData = await response.json();

    if (
      errorData.code === "BUDGET_NOT_FOUND" ||
      errorData.code === "CATEGORY_NOT_FOUND_IN_BUDGET"
    ) {
      throw new Error(errorData.message);
    } else {
      throw new Error("Failed to create transaction");
    }
  }

  const data = await response.json();
  return data;
};
