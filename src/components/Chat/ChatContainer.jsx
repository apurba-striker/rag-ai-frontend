import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import LoadingSpinner from "@components/UI/LoadingSpinner";

import "./Chat.scss";

const ChatContainer = ({
  messages,
  isLoading,
  error,
  onSendMessage,
  sessionId,
}) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  const handleSendMessage = (message) => {
    if (!sessionId) {
      toast.error("No active session. Please refresh the page.");
      return;
    }

    onSendMessage(message);
  };

  // Welcome state when no messages
  const renderWelcomeScreen = () => (
    <motion.div
      className="chat__welcome"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="chat__welcome-content">
        <motion.div
          className="chat__welcome-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          🗞️
        </motion.div>

        <motion.h2
          className="chat__welcome-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Welcome to RAG News Chatbot
        </motion.h2>

        <motion.p
          className="chat__welcome-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Your AI-powered news assistant. Ask me about the latest developments
          in technology, business, world events, and more!
        </motion.p>

        <motion.div
          className="chat__welcome-suggestions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3>Try asking:</h3>
          <div className="chat__suggestion-pills">
            {[
              "What are the latest AI developments?",
              "Tell me about recent tech news",
              "What's happening in business today?",
              "Any updates on climate change?",
              "Latest developments in space exploration",
            ].map((suggestion, index) => (
              <motion.button
                key={index}
                className="chat__suggestion-pill"
                onClick={() => handleSendMessage(suggestion)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="chat__welcome-features"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="chat__feature">
            <span className="chat__feature-icon">⚡</span>
            <span>Real-time responses</span>
          </div>
          <div className="chat__feature">
            <span className="chat__feature-icon">📚</span>
            <span>Sourced information</span>
          </div>
          <div className="chat__feature">
            <span className="chat__feature-icon">🎯</span>
            <span>Accurate & relevant</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <div className="chat-container">
      <div className="chat">
        {/* Messages Area */}
        <div className="chat__messages-wrapper">
          <AnimatePresence mode="wait">
            {messages.length === 0 ? (
              renderWelcomeScreen()
            ) : (
              <MessageList messages={messages} isLoading={isLoading} />
            )}
          </AnimatePresence>

          {/* Loading indicator for new messages */}
          {isLoading && messages.length > 0 && (
            <motion.div
              className="chat__loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="chat__typing-indicator">
                <div className="chat__typing-dot"></div>
                <div className="chat__typing-dot"></div>
                <div className="chat__typing-dot"></div>
              </div>
              <span>AI is thinking...</span>
            </motion.div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="chat__input-wrapper">
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
            placeholder={
              messages.length === 0
                ? "Ask me about the latest news..."
                : "Ask a follow-up question..."
            }
          />

          {/* Status indicators */}
          <div className="chat__status">
            {error && (
              <motion.div
                className="chat__error-indicator"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                ⚠️ Connection issue
              </motion.div>
            )}

            <div className="chat__session-info">
              Session: {sessionId?.slice(0, 8)}...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
