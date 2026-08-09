/**
 * AuthContext.jsx
 * ---------------
 * React Context for global authentication state in Findora.
 *
 * Future responsibilities:
 *  - Store the currently logged-in user object and JWT token
 *  - Expose login(), logout(), and register() helper functions
 *  - Persist auth state to localStorage so sessions survive page reload
 *  - Provide loading state while verifying token on app startup
 *
 * Usage:
 *   const { user, login, logout } = useContext(AuthContext);
 */

import { createContext } from 'react';

// Create the context with a default value of null (no user logged in)
export const AuthContext = createContext(null);

/**
 * AuthProvider
 * Wrap the component tree with this provider to make auth state
 * available to all child components.
 *
 * TODO: Implement state, effects, and handler functions here.
 */
export function AuthProvider({ children }) {
  // TODO: const [user, setUser] = useState(null);
  // TODO: const [loading, setLoading] = useState(true);

  // TODO: useEffect(() => { /* verify token on mount */ }, []);

  // TODO: const login    = async (credentials) => { ... };
  // TODO: const logout   = ()                  => { ... };
  // TODO: const register = async (userData)    => { ... };

  const value = {
    user: null,      // TODO: replace with real state
    login: () => {},
    logout: () => {},
    register: () => {},
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
