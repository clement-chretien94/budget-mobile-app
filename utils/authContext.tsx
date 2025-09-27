import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { SplashScreen, useRouter } from "expo-router";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { AuthState, User, UserConnect, UserCreate } from "../types";
import { connectUser, createUser, getConnectedUser } from "../api";

SplashScreen.preventAutoHideAsync();

const authStorageKey = "auth-key";
const authJWTSecureStorageKey = "auth_jwt_key";

export const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  user: null,
  jwtToken: undefined,
  isReady: false,
  logIn: ({}: { username: string; password: string }) => {},
  logOut: () => {},
  signUp: ({}: UserCreate) => {},
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [jwtToken, setJwtToken] = useState<string | undefined>(undefined);
  const router = useRouter();

  const storeAuthState = async (newState: { jwtToken: string | undefined }) => {
    try {
      if (newState.jwtToken) {
        await SecureStore.setItemAsync(
          authJWTSecureStorageKey,
          newState.jwtToken
        );
      } else {
        await SecureStore.deleteItemAsync(authJWTSecureStorageKey);
      }
    } catch (error) {
      console.log("Error saving", error);
    }
  };

  const logIn = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    try {
      const user: UserConnect = await connectUser(username, password);
      setIsLoggedIn(true);
      setUser(user.user);
      setJwtToken(user.jwt);
      storeAuthState({ jwtToken: user.jwt });
      router.replace("/");
    } catch (error) {
      console.log("Error connecting user", error);
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  // TODO: Delete the jwt token from the storage
  const logOut = () => {
    setIsLoggedIn(false);
    setUser(null);
    setJwtToken(undefined);
    storeAuthState({ jwtToken: undefined });
    router.replace("/login");
  };

  const signUp = async (user: UserCreate) => {
    try {
      await createUser(user);
      // If the user is created successfully, go to the login page
      router.replace("/login");
      // Optionally, you can also log the user in automatically after sign-up
      // logIn({ username: user.username, password: user.password });
    } catch (error) {
      console.log("Error creating user", error);
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  useEffect(() => {
    const getAuthFromStorage = async () => {
      // Simulate a delay, e.g., for an API request
      await new Promise((res) => setTimeout(() => res(null), 1000));

      try {
        const jwtTokenValue = await SecureStore.getItemAsync(
          authJWTSecureStorageKey
        );

        if (jwtTokenValue) {
          setJwtToken(jwtTokenValue);
          setIsLoggedIn(true);

          try {
            const user = await getConnectedUser(jwtTokenValue);
            setUser(user);
          } catch (error) {
            console.log("Error fetching user from storage", error);
            setIsLoggedIn(false);
            setUser(null);
            setJwtToken(undefined);
          }
        }
      } catch (error) {
        console.log("Error fetching from storage", error);
      }
      setIsReady(true);
    };
    getAuthFromStorage();
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, jwtToken, isReady, logIn, logOut, signUp }}
    >
      {children}
    </AuthContext.Provider>
  );
}
