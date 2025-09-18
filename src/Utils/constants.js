// App Configuration
export const APP_CONFIG = {
  name: "RAG News Chatbot",
  version: "1.0.0",
  description: "AI-powered news assistant using RAG pipeline",
  author: "Voosh Assignment",
  repository: "https://github.com/your-username/rag-news-chatbot",
};

// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  socketURL: import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
};

// Socket Events
export const SOCKET_EVENTS = {
  // Connection events
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",
  RECONNECT: "reconnect",
  RECONNECT_ATTEMPT: "reconnect_attempt",
  RECONNECT_ERROR: "reconnect_error",
  RECONNECT_FAILED: "reconnect_failed",

  // Session events
  JOIN_SESSION: "join_session",
  SESSION_HISTORY: "session_history",
  SESSION_CLEARED: "session_cleared",

  // Message events
  SEND_MESSAGE: "send_message",
  NEW_MESSAGE: "new_message",
  BOT_TYPING: "bot_typing",

  // Utility events
  ERROR: "error",
  PING: "ping",
  PONG: "pong",
};

// Message Types
export const MESSAGE_TYPES = {
  USER: "user",
  BOT: "bot",
  SYSTEM: "system",
  ERROR: "error",
};

// Connection Status
export const CONNECTION_STATUS = {
  CONNECTED: "connected",
  CONNECTING: "connecting",
  DISCONNECTED: "disconnected",
  RECONNECTING: "reconnecting",
  ERROR: "error",
};

// UI Constants
export const UI_CONFIG = {
  maxMessageLength: 1000,
  minMessageLength: 3,
  typingIndicatorDelay: 500,
  autoScrollDelay: 100,
  toastDuration: 4000,
  animationDuration: 300,
};

// Theme Configuration
export const THEME_CONFIG = {
  default: "auto",
  options: ["light", "dark", "auto"],
  storageKey: "rag-chat-theme",
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  SERVER_ERROR: "Server error. Please try again later.",
  SESSION_ERROR: "Session error. Please refresh the page.",
  MESSAGE_TOO_LONG: `Message too long. Please keep it under ${UI_CONFIG.maxMessageLength} characters.`,
  MESSAGE_TOO_SHORT: `Message too short. Please enter at least ${UI_CONFIG.minMessageLength} characters.`,
  EMPTY_MESSAGE: "Please enter a message.",
  CONNECTION_FAILED: "Failed to connect to chat server.",
  SEND_FAILED: "Failed to send message. Please try again.",
  RATE_LIMITED: "Too many requests. Please slow down.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  SESSION_CREATED: "New chat session created!",
  SESSION_CLEARED: "Chat history cleared.",
  MESSAGE_SENT: "Message sent successfully.",
  RECONNECTED: "Reconnected to chat server.",
  EXPORTED: "Chat exported successfully.",
  COPIED: "Copied to clipboard!",
};

// Feature Flags
export const FEATURES = {
  ENABLE_SOCKET: import.meta.env.VITE_ENABLE_SOCKET !== "false",
  ENABLE_EXPORT: import.meta.env.VITE_ENABLE_EXPORT !== "false",
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
  ENABLE_VOICE_INPUT: import.meta.env.VITE_ENABLE_VOICE_INPUT === "true",
  ENABLE_NOTIFICATIONS: import.meta.env.VITE_ENABLE_NOTIFICATIONS !== "false",
  DEBUG_LOGS: import.meta.env.VITE_DEBUG_LOGS === "true",
};

// Chat Suggestions
export const CHAT_SUGGESTIONS = [
  "What are the latest AI developments?",
  "Tell me about recent tech news",
  "What's happening in business today?",
  "Any updates on climate change?",
  "Latest developments in space exploration",
  "Recent political news and updates",
  "What's new in healthcare and medicine?",
  "Current events in sports",
  "Entertainment and celebrity news",
  "Financial markets and economic news",
];

// Quick Emojis
export const QUICK_EMOJIS = [
  "😊",
  "🤔",
  "👍",
  "❤️",
  "😂",
  "🔥",
  "💡",
  "👀",
  "🎉",
  "👏",
];

// File Export Formats
export const EXPORT_FORMATS = {
  JSON: "json",
  CSV: "csv",
  TXT: "txt",
};

// Local Storage Keys
export const STORAGE_KEYS = {
  SESSION_ID: "rag-chat-session-id",
  SESSION_HISTORY: "rag-chat-session-history",
  USER_PREFERENCES: "rag-chat-preferences",
  THEME: "rag-chat-theme",
  LAST_ACTIVE: "rag-chat-last-active",
};

// Date/Time Formats
export const DATE_FORMATS = {
  MESSAGE_TIME: "HH:mm",
  MESSAGE_DATE: "MMM dd, yyyy",
  FULL_DATE: "MMM dd, yyyy HH:mm",
  EXPORT_FILENAME: "yyyy-MM-dd-HHmm",
};

// Animation Variants
export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
};

export default {
  APP_CONFIG,
  API_CONFIG,
  SOCKET_EVENTS,
  MESSAGE_TYPES,
  CONNECTION_STATUS,
  UI_CONFIG,
  THEME_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  FEATURES,
  CHAT_SUGGESTIONS,
  QUICK_EMOJIS,
  EXPORT_FORMATS,
  STORAGE_KEYS,
  DATE_FORMATS,
  ANIMATION_VARIANTS,
};
