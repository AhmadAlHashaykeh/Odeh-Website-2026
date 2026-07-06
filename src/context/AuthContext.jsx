import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError, clearStoredToken, getStoredToken, setUnauthorizedHandler } from '../api/client';
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
} from '../api/auth';

const LOGIN_PATH = '/admin/login';

function extractPermissions(data) {
  if (!data.permissions || typeof data.permissions !== 'object') {
    return null;
  }

  return data.permissions;
}

function getUserInitials(fullName) {
  if (!fullName || typeof fullName !== 'string') {
    return 'AD';
  }

  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return 'AD';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);
  const isLoggingOutRef = useRef(false);

  const applySession = useCallback((session) => {
    setUser(session.user);
    setRole(session.role ?? session.user?.role ?? null);
    setPermissions(session.permissions ?? null);
  }, []);

  const clearSession = useCallback(() => {
    clearStoredToken();
    setUser(null);
    setRole(null);
    setPermissions(null);
  }, []);

  const handleUnauthorized = useCallback(() => {
    if (isLoggingOutRef.current) {
      return;
    }

    clearSession();

    if (window.location.pathname.startsWith('/admin') && window.location.pathname !== LOGIN_PATH) {
      navigate(LOGIN_PATH, { replace: true });
    }
  }, [clearSession, navigate]);

  const bootstrapSession = useCallback(async () => {
    const token = getStoredToken();

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await getCurrentUser();
      applySession({
        user: response.data.user,
        role: response.data.role ?? response.data.user.role ?? null,
        permissions: extractPermissions(response.data),
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearSession();
      } else {
        clearSession();
      }
    } finally {
      setLoading(false);
    }
  }, [applySession, clearSession]);

  useEffect(() => {
    setUnauthorizedHandler(handleUnauthorized);
    bootstrapSession();

    return () => {
      setUnauthorizedHandler(null);
    };
  }, [bootstrapSession, handleUnauthorized]);

  const login = useCallback(async (email, password) => {
    const response = await loginRequest({ email, password });

    applySession({
      user: response.data.user,
      role: response.data.role ?? response.data.user.role ?? null,
      permissions: extractPermissions(response.data),
    });

    return response;
  }, [applySession]);

  const logout = useCallback(async () => {
    isLoggingOutRef.current = true;

    try {
      if (getStoredToken()) {
        await logoutRequest();
      }
    } catch {
      // Local session is cleared even if the API call fails.
    } finally {
      clearSession();
      isLoggingOutRef.current = false;
      navigate(LOGIN_PATH, { replace: true });
    }
  }, [clearSession, navigate]);

  const value = useMemo(
    () => ({
      user,
      role,
      permissions,
      loading,
      authenticated: Boolean(user),
      initials: getUserInitials(user?.fullName),
      login,
      logout,
    }),
    [user, role, permissions, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
