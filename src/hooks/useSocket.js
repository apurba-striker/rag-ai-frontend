import { useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";

const useSocket = (sessionId) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (socket?.connected) return;

    const socketUrl =
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

    const newSocket = io(socketUrl, {
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      forceNew: false,
    });

    // Connection events
    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      setIsConnected(true);
      setConnectionStatus("connected");
      reconnectAttempts.current = 0;

      if (reconnectAttempts.current > 0) {
        toast.success("Reconnected to chat server");
      }
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
      setConnectionStatus("disconnected");

      if (reason === "io server disconnect") {
        // Server initiated disconnect, reconnect manually
        newSocket.connect();
      }
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setConnectionStatus("disconnected");
      reconnectAttempts.current += 1;

      if (reconnectAttempts.current >= maxReconnectAttempts) {
        toast.error("Failed to connect to chat server");
      }
    });

    newSocket.on("reconnect", (attemptNumber) => {
      console.log("Socket reconnected after", attemptNumber, "attempts");
      setConnectionStatus("connected");
      toast.success("Reconnected to chat server");
    });

    newSocket.on("reconnect_attempt", () => {
      setConnectionStatus("connecting");
    });

    newSocket.on("reconnect_error", (error) => {
      console.error("Socket reconnection error:", error);
      setConnectionStatus("disconnected");
    });

    newSocket.on("reconnect_failed", () => {
      console.error("Socket reconnection failed");
      setConnectionStatus("disconnected");
      toast.error("Unable to reconnect to chat server");
    });

    setSocket(newSocket);
    return newSocket;
  }, [socket]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setConnectionStatus("disconnected");
    }
  }, [socket]);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = connect();

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  // Join session when sessionId changes
  useEffect(() => {
    if (socket && sessionId && isConnected) {
      console.log("Joining session:", sessionId);
      socket.emit("join_session", sessionId);
    }
  }, [socket, sessionId, isConnected]);

  // Event listeners management
  const on = useCallback(
    (event, callback) => {
      if (socket) {
        socket.on(event, callback);

        // Return cleanup function
        return () => {
          socket.off(event, callback);
        };
      }
    },
    [socket]
  );

  const emit = useCallback(
    (event, data) => {
      if (socket && isConnected) {
        socket.emit(event, data);
        return true;
      }
      return false;
    },
    [socket, isConnected]
  );

  return {
    socket,
    isConnected,
    connectionStatus,
    connect,
    disconnect,
    on,
    emit,
  };
};

export default useSocket;
