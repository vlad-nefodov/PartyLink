import { createContext, useMemo, ReactNode, FC, useState, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { UseMutationResult, useMutation } from "react-query";
import { ILoginData, ITokensResponse } from "../services/authService/types";
import { authService } from "../services/authService/authService";

export interface IAuthUser {
  id: string
}
export interface IAuthContext {
  user?: IAuthUser,
  loginMutation: UseMutationResult<ITokensResponse, Error, ILoginData>,
  logoutMutation: UseMutationResult<void, Error, void>
}
export interface IAuthProviderProps {
  children: ReactNode
}

export const getUser = (token: string): IAuthUser | undefined => {
  if (token) {
    const base64 = token.split('.')[1];
    const payload = JSON.parse(atob(base64));
    return {
      id: payload.nameid
    }
  }
  return undefined;
}

export const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider: FC<IAuthProviderProps> = ({ children }) => {
  const [tokens, setTokens] = useLocalStorage<ITokensResponse>("tokens", {
    accessToken: "",
    refreshToken: ""
  });
  const [user, setUser] = useState<IAuthUser | undefined>(getUser(tokens.accessToken));

  useEffect(() => {
    setUser(getUser(tokens.accessToken));
  }, [tokens]);

  const loginMutation = useMutation<ITokensResponse, Error, ILoginData>("loginMutation", authService.login, {
    onSuccess: tokens => {
      setTokens(tokens);
    }
  });

  const logoutMutation = useMutation<void, Error, void>("logoutMutation", async () => {
    await authService.logout(tokens.refreshToken);
  }, {
    onSettled: () => {
      localStorage.removeItem("tokens");
      window.location.href = window.location.origin;
    }
  });

  const value = useMemo(() => ({
    user,
    loginMutation,
    logoutMutation
  }), [tokens, user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};