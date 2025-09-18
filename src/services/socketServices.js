import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  connect(url = null) {
    const socketUrl =
      url || import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

    if (this.socket?.connected) {
      console.log("Socket already connected");
      return this.socket;
    }

    console.log("Connecting to socket server:", socketUrl);

    this.socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      forceNew: false,
    });

    this.setupEventListeners();
    return this.socket;
  }

  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit("connection_status", {
        status: "connected",
        socketId: this.socket.id,
      });
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      this.isConnected = false;
      this.emit("connection_status", { status: "disconnected", reason });

      if (reason === "io server disconnect") {
        // Server initiated disconnect, try to reconnect
        this.socket.connect();
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      this.reconnectAttempts++;
      this.emit("connection_status", {
        status: "error",
        error: error.message,
        attempts: this.reconnectAttempts,
      });
    });

    this.socket.on("reconnect", (attemptNumber) => {
      console.log("Socket reconnected after", attemptNumber, "attempts");
      this.isConnected = true;
      this.emit("connection_status", {
        status: "reconnected",
        attempts: attemptNumber,
      });
    });

    this.socket.on("reconnect_attempt", (attemptNumber) => {
      console.log("Socket reconnection attempt:", attemptNumber);
      this.emit("connection_status", {
        status: "reconnecting",
        attempts: attemptNumber,
      });
    });

    this.socket.on("reconnect_error", (error) => {
      console.error("Socket reconnection error:", error);
      this.emit("connection_status", {
        status: "reconnect_error",
        error: error.message,
      });
    });

    this.socket.on("reconnect_failed", () => {
      console.error("Socket reconnection failed");
      this.isConnected = false;
      this.emit("connection_status", { status: "reconnect_failed" });
    });
  }

  disconnect() {
    if (this.socket) {
      console.log("Disconnecting socket");
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
    }
  }

  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
      return true;
    }
    console.warn("Cannot emit event, socket not connected:", event);
    return false;
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);

      // Store listener for cleanup
      if (!this.listeners.has(event)) {
        this.listeners.set(event, new Set());
      }
      this.listeners.get(event).add(callback);

      // Return cleanup function
      return () => this.off(event, callback);
    }
    return null;
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);

      // Remove from stored listeners
      if (this.listeners.has(event)) {
        this.listeners.get(event).delete(callback);
        if (this.listeners.get(event).size === 0) {
          this.listeners.delete(event);
        }
      }
    }
  }

  once(event, callback) {
    if (this.socket) {
      this.socket.once(event, callback);
    }
  }

  // Chat-specific methods
  joinSession(sessionId) {
    return this.emit("join_session", sessionId);
  }

  sendMessage(sessionId, message) {
    return this.emit("send_message", { sessionId, message });
  }

  clearSession(sessionId) {
    return this.emit("clear_session", sessionId);
  }

  getSessionStats(sessionId) {
    return this.emit("get_session_stats", sessionId);
  }

  // Utility methods
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      socketId: this.socket?.id,
      transport: this.socket?.io?.engine?.transport?.name,
    };
  }

  ping(callback) {
    if (this.socket && this.isConnected) {
      const startTime = Date.now();
      this.socket.emit("ping", startTime);

      this.once("pong", (timestamp) => {
        const latency = Date.now() - timestamp;
        callback?.(latency);
      });
    }
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
