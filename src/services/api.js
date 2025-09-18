import axios from "axios";
import { toast } from "react-hot-toast";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now(),
    };

    // Log requests in development
    if (import.meta.env.VITE_DEBUG_LOGS === "true") {
      console.log("API Request:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (import.meta.env.VITE_DEBUG_LOGS === "true") {
      console.log("API Response:", {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  (error) => {
    console.error("API Error:", {
      status: error.response?.status,
      message: error.response?.data?.error || error.message,
      url: error.config?.url,
    });

    // Handle specific error cases
    if (error.response?.status === 429) {
      toast.error("Too many requests. Please slow down.");
    } else if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.");
    } else if (error.code === "NETWORK_ERROR") {
      toast.error("Network error. Check your connection.");
    }

    return Promise.reject(error);
  }
);

// API Methods

/**
 * Health check
 */
export const getHealth = async () => {
  const response = await api.get("/health");
  return response.data;
};

/**
 * Session Management
 */
export const createSession = async () => {
  const response = await api.post("/api/session/create");
  return response.data;
};

export const getSession = async (sessionId) => {
  const response = await api.get(`/api/session/${sessionId}`);
  return response.data;
};

export const clearSession = async (sessionId) => {
  const response = await api.delete(`/api/session/${sessionId}`);
  return response.data;
};

export const getSessionStats = async (sessionId) => {
  const response = await api.get(`/api/session/${sessionId}/stats`);
  return response.data;
};

export const exportSession = async (sessionId, format = "json") => {
  const response = await api.get(`/api/session/${sessionId}/export`, {
    params: { format },
    responseType: format === "json" ? "json" : "blob",
  });
  return response.data;
};

/**
 * Chat Management
 */
export const sendChatMessage = async (sessionId, message, signal) => {
  const response = await api.post(
    "/api/chat/send",
    {
      sessionId,
      message,
    },
    {
      signal, // For request cancellation
    }
  );
  return response.data;
};

export const getChatHistory = async (sessionId) => {
  const response = await api.get(`/api/chat/history/${sessionId}`);
  return response.data;
};

/**
 * Utility function to test API connectivity
 */
export const testConnection = async () => {
  try {
    const health = await getHealth();
    return {
      success: true,
      status: health.status,
      services: health.services,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Utility function to validate session
 */
export const validateSession = async (sessionId) => {
  try {
    const session = await getSession(sessionId);
    return {
      valid: true,
      session,
    };
  } catch (error) {
    return {
      valid: false,
      error: error.response?.data?.error || error.message,
    };
  }
};

export default api;
