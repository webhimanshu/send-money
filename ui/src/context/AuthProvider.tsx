import { createContext, useContext, useState } from "react";

interface User {
    firstName: string;
    lastName: string;
    email: string;
}

interface AuthContext {
  token: string | null;
  logout: ()=> void;
  login: (token: string, user: User) => void;
  user: User | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  });

  const login = (token: string, user: User)=> {
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  const logout = ()=> {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  }
  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated: Boolean(token)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if(!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx;
};
