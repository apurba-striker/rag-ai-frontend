import { v4 as uuidv4 } from "uuid";

const SESSION_STORAGE_KEY = "rag-chat-session-id";
const SESSION_HISTORY_KEY = "rag-chat-session-history";
const SESSION_PREFERENCES_KEY = "rag-chat-preferences";

/**
 * Generate a new session ID
 */
export const generateSessionId = () => {
  return uuidv4();
};

/**
 * Get stored session ID from localStorage
 */
export const getStoredSessionId = () => {
  try {
    return localStorage.getItem(SESSION_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to get session ID from localStorage:", error);
    return null;
  }
};

/**
 * Store session ID in localStorage
 */
export const storeSessionId = (sessionId) => {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    return true;
  } catch (error) {
    console.error("Failed to store session ID in localStorage:", error);
    return false;
  }
};

/**
 * Clear session ID from localStorage
 */
export const clearStoredSessionId = () => {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Failed to clear session ID from localStorage:", error);
    return false;
  }
};

/**
 * Validate session ID format
 */
export const isValidSessionId = (sessionId) => {
  if (!sessionId || typeof sessionId !== "string") {
    return false;
  }

  // UUID v4 format validation
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(sessionId);
};

/**
 * Get session history from localStorage (offline backup)
 */
export const getSessionHistory = (sessionId) => {
  try {
    const historyKey = `${SESSION_HISTORY_KEY}-${sessionId}`;
    const stored = localStorage.getItem(historyKey);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to get session history:", error);
    return [];
  }
};

/**
 * Store session history in localStorage (offline backup)
 */
export const storeSessionHistory = (sessionId, messages) => {
  try {
    const historyKey = `${SESSION_HISTORY_KEY}-${sessionId}`;
    localStorage.setItem(historyKey, JSON.stringify(messages));
    return true;
  } catch (error) {
    console.error("Failed to store session history:", error);
    return false;
  }
};

/**
 * Clear session history from localStorage
 */
export const clearSessionHistory = (sessionId) => {
  try {
    const historyKey = `${SESSION_HISTORY_KEY}-${sessionId}`;
    localStorage.removeItem(historyKey);
    return true;
  } catch (error) {
    console.error("Failed to clear session history:", error);
    return false;
  }
};

/**
 * Get user preferences
 */
export const getUserPreferences = () => {
  try {
    const stored = localStorage.getItem(SESSION_PREFERENCES_KEY);
    return stored
      ? JSON.parse(stored)
      : {
          theme: "auto",
          enableNotifications: true,
          enableSounds: false,
          autoScroll: true,
          compactMode: false,
        };
  } catch (error) {
    console.error("Failed to get user preferences:", error);
    return {};
  }
};

/**
 * Store user preferences
 */
export const storeUserPreferences = (preferences) => {
  try {
    const current = getUserPreferences();
    const updated = { ...current, ...preferences };
    localStorage.setItem(SESSION_PREFERENCES_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error("Failed to store user preferences:", error);
    return preferences;
  }
};

/**
 * Clear all session data
 */
export const clearAllSessionData = () => {
  try {
    // Get all localStorage keys that start with our prefixes
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.startsWith(SESSION_STORAGE_KEY) ||
          key.startsWith(SESSION_HISTORY_KEY))
      ) {
        keysToRemove.push(key);
      }
    }

    // Remove all session-related keys
    keysToRemove.forEach((key) => localStorage.removeItem(key));

    console.log("Cleared all session data");
    return true;
  } catch (error) {
    console.error("Failed to clear session data:", error);
    return false;
  }
};

/**
 * Get session metadata
 */
export const getSessionMetadata = (sessionId) => {
  const history = getSessionHistory(sessionId);

  return {
    sessionId,
    messageCount: history.length,
    lastActivity:
      history.length > 0 ? history[history.length - 1].timestamp : null,
    createdAt: history.length > 0 ? history[0].timestamp : null,
    userMessages: history.filter((m) => m.type === "user").length,
    botMessages: history.filter((m) => m.type === "bot").length,
  };
};

/**
 * Export session data
 */
export const exportSessionData = (sessionId, format = "json") => {
  const history = getSessionHistory(sessionId);
  const metadata = getSessionMetadata(sessionId);

  const exportData = {
    ...metadata,
    exportedAt: new Date().toISOString(),
    format,
    messages: history,
  };

  if (format === "json") {
    return JSON.stringify(exportData, null, 2);
  }

  // Add other formats as needed
  return exportData;
};
