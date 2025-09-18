import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiMessageSquare,
  FiDownload,
  FiSettings,
  FiWifi,
  FiWifiOff,
  FiUsers,
  FiClock,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import Button from "@components/UI/Button";
import "./Header.scss";

const Header = ({
  onNewChat,
  onExportChat,
  messageCount,
  connectionStatus,
  sessionId,
}) => {
  const [showSessionInfo, setShowSessionInfo] = useState(false);

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return (
          <FiWifi className="header__status-icon header__status-icon--connected" />
        );
      case "connecting":
        return (
          <FiWifi className="header__status-icon header__status-icon--connecting" />
        );
      case "disconnected":
        return (
          <FiWifiOff className="header__status-icon header__status-icon--disconnected" />
        );
      default:
        return (
          <FiWifiOff className="header__status-icon header__status-icon--unknown" />
        );
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Connected";
      case "connecting":
        return "Connecting...";
      case "disconnected":
        return "Disconnected";
      default:
        return "Unknown";
    }
  };

  const copySessionId = () => {
    navigator.clipboard.writeText(sessionId);
    toast.success("Session ID copied to clipboard!");
  };

  return (
    <motion.header
      className="header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header__container">
        {/* Logo & Title */}
        <div className="header__brand">
          <motion.div
            className="header__logo"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            🤖
          </motion.div>
          <div className="header__title">
            <h1>RAG News Chatbot</h1>
            <span className="header__subtitle">AI-Powered News Assistant</span>
          </div>
        </div>

        {/* Connection Status */}
        <div className="header__status">
          {getConnectionIcon()}
          <span className="header__status-text">{getConnectionText()}</span>
        </div>

        {/* Session Info */}
        <div className="header__session">
          <motion.button
            className="header__session-toggle"
            onClick={() => setShowSessionInfo(!showSessionInfo)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiUsers className="header__session-icon" />
            <span className="header__session-count">{messageCount}</span>
          </motion.button>

          {showSessionInfo && (
            <motion.div
              className="header__session-dropdown"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="header__session-info">
                <p>
                  <strong>Session ID:</strong>
                </p>
                <p className="header__session-id" onClick={copySessionId}>
                  {sessionId?.slice(0, 8)}...
                </p>
                <p>
                  <strong>Messages:</strong> {messageCount}
                </p>
                <p>
                  <strong>Status:</strong> {getConnectionText()}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Actions */}
        <div className="header__actions">
          <Button
            variant="secondary"
            size="small"
            onClick={onNewChat}
            icon={<FiMessageSquare />}
            tooltip="Start New Chat"
          >
            New Chat
          </Button>

          <Button
            variant="secondary"
            size="small"
            onClick={onExportChat}
            disabled={messageCount === 0}
            icon={<FiDownload />}
            tooltip="Export Chat History"
          >
            Export
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      {messageCount > 0 && (
        <motion.div
          className="header__progress"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: Math.min(messageCount / 20, 1) }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.header>
  );
};

export default Header;
