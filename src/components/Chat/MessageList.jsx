import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { formatDistanceToNow } from "date-fns";
import {
  FiUser,
  FiBot,
  FiExternalLink,
  FiClock,
  FiLink,
  FiTrendingUp,
  FiCopy,
  FiCheck,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

const MessageList = ({ messages, isLoading }) => {
  const [copiedMessageId, setCopiedMessageId] = React.useState(null);

  const copyToClipboard = (text, messageId) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(messageId);
    toast.success("Message copied to clipboard!");

    setTimeout(() => {
      setCopiedMessageId(null);
    }, 2000);
  };

  const renderSources = (sources) => {
    if (!sources || sources.length === 0) return null;

    return (
      <motion.div
        className="message__sources"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        transition={{ delay: 0.3 }}
      >
        <div className="message__sources-header">
          <FiLink className="message__sources-icon" />
          <span>Sources ({sources.length})</span>
        </div>

        <div className="message__sources-list">
          {sources.map((source, index) => (
            <motion.div
              key={index}
              className="message__source"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="message__source-content">
                <h4 className="message__source-title">
                  <span className="message__source-number">{index + 1}</span>
                  {source.title}
                </h4>
                <div className="message__source-meta">
                  <span className="message__source-outlet">
                    {source.source}
                  </span>
                  <span className="message__source-relevance">
                    <FiTrendingUp />
                    {Math.round(source.relevanceScore * 100)}% relevant
                  </span>
                </div>
                <p className="message__source-snippet">{source.snippet}</p>
              </div>

              {source.url && (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="message__source-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FiExternalLink />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  const renderMessage = (message, index) => {
    const isUser = message.type === "user";
    const isBot = message.type === "bot";

    return (
      <motion.div
        key={message.id}
        className={`message ${isUser ? "message--user" : "message--bot"}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: index * 0.1,
          type: "spring",
          stiffness: 100,
        }}
        layout
      >
        {/* Avatar */}
        <div className="message__avatar">
          {isUser ? (
            <FiUser className="message__avatar-icon" />
          ) : (
            <motion.div
              className="message__avatar-bot"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <FiBot className="message__avatar-icon" />
            </motion.div>
          )}
        </div>

        {/* Message Content */}
        <div className="message__content">
          {/* Message Header */}
          <div className="message__header">
            <span className="message__author">
              {isUser ? "You" : "RAG News Assistant"}
            </span>
            <div className="message__meta">
              <FiClock className="message__time-icon" />
              <span className="message__time">
                {formatDistanceToNow(new Date(message.timestamp), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>

          {/* Message Body */}
          <div className="message__body">
            {isBot ? (
              <ReactMarkdown
                className="message__markdown"
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={atomDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            ) : (
              <p className="message__text">{message.content}</p>
            )}
          </div>

          {/* Sources (only for bot messages) */}
          {isBot && renderSources(message.sources)}

          {/* Message Actions */}
          <div className="message__actions">
            <motion.button
              className="message__action"
              onClick={() => copyToClipboard(message.content, message.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {copiedMessageId === message.id ? (
                <FiCheck className="message__action-icon message__action-icon--success" />
              ) : (
                <FiCopy className="message__action-icon" />
              )}
            </motion.button>

            {/* Metadata for bot messages */}
            {isBot && message.metadata && (
              <div className="message__metadata">
                {message.metadata.processingTime && (
                  <span className="message__metadata-item">
                    ⚡ {message.metadata.processingTime}ms
                  </span>
                )}
                {message.metadata.documentsFound && (
                  <span className="message__metadata-item">
                    📚 {message.metadata.documentsFound} sources found
                  </span>
                )}
                {message.metadata.modelUsed && (
                  <span className="message__metadata-item">
                    🤖 {message.metadata.modelUsed}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="message-list">
      <AnimatePresence>
        {messages.map((message, index) => renderMessage(message, index))}
      </AnimatePresence>
    </div>
  );
};

export default MessageList;
