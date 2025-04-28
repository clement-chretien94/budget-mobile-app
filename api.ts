import { User, UserConnect, UserCreate } from "./types";

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
  return data;
};
