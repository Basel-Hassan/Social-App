
import {
  createContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import { jwtDecode } from "jwt-decode";

type TokenPayload = {
  user: string;
};

type LoginContextType = {
  userLogin: string | null;
  setUserLogin: Dispatch<SetStateAction<string | null>>;
  userId: string;
};

export const LoginContext = createContext<LoginContextType>({
  userLogin: null,
  setUserLogin: () => {},
  userId: "",
});

export default function LoginContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [userLogin, setUserLogin] = useState<string | null>(() => {
    return localStorage.getItem("userToken");
  });

  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (!userLogin) {
      setUserId("");
      return;
    }

    try {
      const { user } = jwtDecode<TokenPayload>(userLogin);
      setUserId(user);
    } catch {
      setUserId("");
    }
  }, [userLogin]);

  return (
    <LoginContext.Provider
      value={{ userLogin, setUserLogin, userId }}
    >
      {children}
    </LoginContext.Provider>
  );
}
