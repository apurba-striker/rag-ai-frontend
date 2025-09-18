import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-hot-toast";
import useSocket from "./useSocket";
import { sendChatMessage, getChatHistory } from "@services/api";

const useChat = (sessionId) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { socket, isConnected, connectionStatus, on, emit } =
    useSocket(sessionId);
  const abortControllerRef = useRef(null);

  // Load chat history when session changes
  useEffect(() => {
    if (sessionId) {
      loadChatHistory();
    } else {
      setMessages([]);
    }
  }, [sessionId]);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;

    const cleanupFunctions = [];

    // Session history received
    cleanupFunctions.push(
      on("session_history", (history) => {
        console.log("Received session history:", history.length, "messages");
        setMessages(history || []);
      })
    );

    // New message received
    cleanupFunctions.push(
      on("new_message", (message) => {
        console.log("Received new message:", message.type);
        setMessages((prev) => {
          // Check if message already exists to prevent duplicates
          if (prev.find((m) => m.id === message.id)) {
            return prev;
          }
          return [...prev, message];
        });
        setIsLoading(false);
      })
    );

    // Bot typing indicator
    cleanupFunctions.push(
      on("bot_typing", (isTyping) => {
        setIsLoading(isTyping);
      })
    );

    // Session cleared
    cleanupFunctions.push(
      on("session_cleared", () => {
        setMessages([]);
        toast.success("Chat cleared");
      })
    );

    // Error handling
    cleanupFunctions.push(
      on("error", (errorMessage) => {
        console.error("Socket error:", errorMessage);
        setError(errorMessage);
        setIsLoading(false);
        toast.error(errorMessage);
      })
    );

    // Cleanup on unmount
    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup?.());
    };
  }, [socket, on]);

  const loadChatHistory = async () => {
    if (!sessionId) return;

    try {
      setError(null);
      const response = await getChatHistory(sessionId);
      setMessages(response.messages || []);
    } catch (error) {
      console.error("Failed to load chat history:", error);
      setError("Failed to load chat history");
      // Don't show toast for history loading errors
    }
  };

  const sendMessage = useCallback(
    async (messageContent) => {
      if (!sessionId || !messageContent.trim()) {
        toast.error("Please enter a message");
        return;
      }

      if (isLoading) {
        toast.error("Please wait for the current message to complete");
        return;
      }

      // Cancel any pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const trimmedMessage = messageContent.trim();
      setIsLoading(true);
      setError(null);

      // Create user message immediately for better UX
      const userMessage = {
        id: `temp-${Date.now()}`,
        type: "user",
        content: trimmedMessage,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);

      try {
        // Try Socket.IO first (real-time)
        if (
          isConnected &&
          emit("send_message", { sessionId, message: trimmedMessage })
        ) {
          console.log("Message sent via Socket.IO");
          return;
        }

        // Fallback to REST API
        console.log("Sending message via REST API");

        // Create new AbortController for this request
        abortControllerRef.current = new AbortController();

        const response = await sendChatMessage(
          sessionId,
          trimmedMessage,
          abortControllerRef.current.signal
        );

        // Remove temporary user message and add both messages from response
        setMessages((prev) => {
          const filtered = prev.filter((m) => m.id !== userMessage.id);

          const newUserMessage = {
            id: `user-${Date.now()}`,
            type: "user",
            content: trimmedMessage,
            timestamp: new Date().toISOString(),
          };

          const botMessage = {
            id: `bot-${Date.now()}`,
            type: "bot",
            content: response.answer,
            sources: response.sources || [],
            metadata: response.metadata || {},
            timestamp: new Date().toISOString(),
          };

          return [...filtered, newUserMessage, botMessage];
        });
      } catch (error) {
        console.error("Failed to send message:", error);

        // Remove temporary user message on error
        setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));

        if (error.name === "AbortError") {
          console.log("Request was cancelled");
          return;
        }

        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Failed to send message";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [sessionId, isLoading, isConnected, emit]
  );

  const clearChat = useCallback(async () => {
    if (!sessionId) return;

    try {
      // Try socket first
      if (isConnected && emit("clear_session", sessionId)) {
        console.log("Session cleared via Socket.IO");
        return;
      }

      // Fallback: clear locally
      setMessages([]);
      toast.success("Chat cleared");
    } catch (error) {
      console.error("Failed to clear chat:", error);
      toast.error("Failed to clear chat");
    }
  }, [sessionId, isConnected, emit]);

  const retryLastMessage = useCallback(() => {
    const lastUserMessage = messages
      .slice()
      .reverse()
      .find((msg) => msg.type === "user");

    if (lastUserMessage) {
      sendMessage(lastUserMessage.content);
    }
  }, [messages, sendMessage]);

  // Cancel ongoing request
  const cancelMessage = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      toast.success("Message cancelled");
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    connectionStatus,
    sendMessage,
    clearChat,
    retryLastMessage,
    cancelMessage,
    loadChatHistory,
  };
};

export { useChat };
