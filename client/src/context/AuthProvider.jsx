import { useState, useEffect, useCallback, useRef } from "react";

import api from "../services/api";
import AuthContext from "./AuthContext";

const getDeviceId = () => {
  let deviceId = localStorage.getItem("mini_erp_device_id");

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("mini_erp_device_id", deviceId);
  }

  return deviceId;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const tokenRef = useRef(null);
  const refreshPromiseRef = useRef(null);
  const restorePromiseRef = useRef(null);

  // Keep React state and the token reference synchronized.
  const updateAccessToken = useCallback((token) => {
    tokenRef.current = token;
    setAccessToken(token);
  }, []);

  // Refresh the access token using the HttpOnly cookie.
  const refreshAccessToken = useCallback(async () => {
    if (!refreshPromiseRef.current) {
      const request = (async () => {
        const response = await api.post("/auth/refresh");

        const newToken = response.data.accessToken;

        if (!newToken) {
          throw new Error("Access token missing");
        }

        updateAccessToken(newToken);

        return newToken;
      })();

      refreshPromiseRef.current = request;

      const clearPromise = () => {
        if (refreshPromiseRef.current === request) {
          refreshPromiseRef.current = null;
        }
      };

      request.then(clearPromise, clearPromise);
    }

    return refreshPromiseRef.current;
  }, [updateAccessToken]);

  // Configure automatic token attachment and refreshing.
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      if (tokenRef.current) {
        config.headers.Authorization = `Bearer ${tokenRef.current}`;
      }

      return config;
    });

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        const authEndpoints = [
          "/auth/login",
          "/auth/register",
          "/auth/refresh",
          "/auth/forgot-password",
          "/auth/reset-password",
        ];

        const isAuthEndpoint = authEndpoints.some((endpoint) =>
          originalRequest?.url?.includes(endpoint),
        );

        if (
          error.response?.status !== 401 ||
          !originalRequest ||
          originalRequest._retry ||
          isAuthEndpoint
        ) {
          return Promise.reject(error);
        }
        originalRequest._retry = true;

        try {
          const newToken = await refreshAccessToken();

          originalRequest.headers = originalRequest.headers || {};

          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          return api(originalRequest);
        } catch (refreshError) {
          updateAccessToken(null);
          setUser(null);

          return Promise.reject(refreshError);
        }
      },
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [refreshAccessToken, updateAccessToken]);

  // Restore an existing session when the application opens.
  const restoreSession = useCallback(() => {
    if (restorePromiseRef.current) {
      return restorePromiseRef.current;
    }

    const request = (async () => {
      try {
        const token = await refreshAccessToken();

        const response = await api.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.user);
      } catch {
        updateAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();

    restorePromiseRef.current = request;

    const clearPromise = () => {
      if (restorePromiseRef.current === request) {
        restorePromiseRef.current = null;
      }
    };

    request.then(clearPromise, clearPromise);

    return request;
  }, [refreshAccessToken, updateAccessToken]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // Login using email address or mobile number.
  const login = async ({ identifier, password }) => {
    const deviceId = getDeviceId();

    const response = await api.post("/auth/login", {
      identifier: identifier.trim(),
      password,
      deviceId,
    });

    updateAccessToken(response.data.accessToken);
    setUser(response.data.user);

    return response.data;
  };

  // Logout.
  const logout = async () => {
    try {
      if (tokenRef.current) {
        await api.post("/auth/logout");
      }
    } finally {
      updateAccessToken(null);
      setUser(null);
    }
  };

  // Send a heartbeat every 30 seconds.
  useEffect(() => {
    if (!accessToken) return;

    const sendHeartbeat = async () => {
      try {
        await api.post("/auth/heartbeat");
      } catch (error) {
        // Do not log out for temporary network failures.
        if (error.response?.status === 401) {
          updateAccessToken(null);
          setUser(null);
        }
      }
    };

    const interval = setInterval(sendHeartbeat, 30000);

    return () => clearInterval(interval);
  }, [accessToken, updateAccessToken]);

  const contextValue = {
    user,
    accessToken,
    loading,
    isAuthenticated: Boolean(user && accessToken),
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};;;
