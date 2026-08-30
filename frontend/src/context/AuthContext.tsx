import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { authApi } from "@/api/authApi";
import { User, LoginPayload, RegisterPayload } from "@/types/auth";
import { STORAGE_KEYS } from "@/constants/storage";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;

  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] = useState<string | null>(
    localStorage.getItem(STORAGE_KEYS.TOKEN)
  );

  const [isLoading, setIsLoading] = useState(true);

const refreshUser = async () => {
  try {
    const response = await authApi.me();

    // Removed debug logs for security
    setUser(response.data);
  } catch (error) {
    logout();
  }
};

 useEffect(() => {
  async function initialize() {
    if (!token) {
      setIsLoading(false);
      return;
    }

    await refreshUser();
    setIsLoading(false);
  }

  initialize();
}, [token]);

const login = async (payload: LoginPayload) => {
  const response = await authApi.login(payload);

  const { token, user } = response.data;

  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

  setToken(token);
  setUser(user);
  setIsLoading(false);
};

  const register = async (payload: RegisterPayload) => {
    await authApi.register(payload);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);

    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }

  return context;
}