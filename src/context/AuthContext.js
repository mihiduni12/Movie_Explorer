import { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

/**
 * DEMO authentication: TMDb has no user login for this scope, so any username
 * (3+ chars) with a password (4+ chars) is accepted and the session is kept in
 * localStorage. Replace `login` with a real API call for production.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('user', null);

  const login = (username, password) => {
    if (username.trim().length < 3) return 'Username must be at least 3 characters.';
    if (password.length < 4) return 'Password must be at least 4 characters.';
    setUser({ username: username.trim() });
    return null; // no error
  };
  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
