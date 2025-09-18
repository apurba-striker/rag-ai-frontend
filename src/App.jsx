import React, { useState, useEffect } from "react";
import "./App.css";

// Add this at the top of your App component (temporary debug)
console.log("Environment Variables:", {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL,
  ENABLE_SOCKET: import.meta.env.VITE_ENABLE_SOCKET,
});

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  // Create session on component mount
  useEffect(() => {
    createSession();
  }, []);

  const createSession = async () => {
    try {
      // 🔥 HARDCODE BACKEND URL (temporary but guaranteed to work)
      const response = await fetch(
        "https://rag-ai-backend-t32s.onrender.com/api/session/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      setSessionId(data.sessionId);
      console.log("Session created:", data.sessionId);
    } catch (error) {
      console.error("Error creating session:", error);
      setSessionId("fallback-session-" + Date.now());
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !sessionId) return;

    setLoading(true);
    const userMessage = {
      type: "user",
      content: message,
      timestamp: Date.now(),
      id: "user-" + Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      console.log("Sending message with sessionId:", sessionId);

      // 🔥 HARDCODE BACKEND URL
      const response = await fetch(
        "https://rag-ai-backend-t32s.onrender.com/api/chat/send",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionId,
            message: message,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      const botMessage = {
        type: "bot",
        content:
          data.answer ||
          "I received your message but could not generate a response.",
        sources: data.sources || [],
        timestamp: Date.now(),
        id: "bot-" + Date.now(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: `Error: ${error.message}. Please make sure the backend server is running.`,
          timestamp: Date.now(),
          id: "error-" + Date.now(),
        },
      ]);
    }

    setMessage("");
    setLoading(false);
  };

  // Auto-resize textarea
  const autoResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  // Show loading while session is being created
  if (!sessionId) {
    return (
      <div className="app">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Initializing RAG News Chatbot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <h1>🤖 RAG News Chatbot</h1>
            <p>AI-powered news assistant</p>
          </div>
          <div className="header-right">
            <div className="session-info">
              <span className="session-label">Session:</span>
              <span className="session-id">{sessionId.slice(0, 8)}...</span>
            </div>
            <button
              className="reset-button"
              onClick={resetSession}
              title="Reset Session"
            >
              🔄 Reset
            </button>
          </div>
        </div>
      </header>

      <main className="chat-container">
        <div className="messages" id="messages-container">
          {messages.length === 0 ? (
            <div className="welcome">
              <div className="welcome-content">
                <h2>Welcome to RAG News Chatbot!</h2>
                <p>
                  Ask me about the latest news, technology, business, or world
                  events.
                </p>
                <div className="suggestions">
                  <button
                    onClick={() =>
                      setMessage("What are the latest AI developments?")
                    }
                  >
                    Latest AI news
                  </button>
                  <button
                    onClick={() => setMessage("Tell me about recent tech news")}
                  >
                    Tech updates
                  </button>
                  <button
                    onClick={() =>
                      setMessage("What is happening in business today?")
                    }
                  >
                    Business news
                  </button>
                  <button
                    onClick={() =>
                      setMessage("Tell me about climate change updates")
                    }
                  >
                    Climate news
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="message-history">
              {messages.map((msg, index) => (
                <div key={msg.id || index} className={`message ${msg.type}`}>
                  <div className="message-content">
                    <div className="message-header">
                      <strong className="message-author">
                        {msg.type === "user" ? "You" : "AI Assistant"}
                      </strong>
                      <span className="message-time">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="message-text">{msg.content}</div>
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="sources">
                        <h4>📚 Sources ({msg.sources.length}):</h4>
                        <div className="sources-list">
                          {msg.sources.map((source, i) => (
                            <div key={i} className="source-item">
                              <div className="source-number">{i + 1}</div>
                              <div className="source-content">
                                <a
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="source-title"
                                >
                                  {source.title}
                                </a>
                                <div className="source-meta">
                                  <span className="source-outlet">
                                    ({source.source})
                                  </span>
                                  {source.relevanceScore && (
                                    <span className="source-relevance">
                                      {Math.round(source.relevanceScore * 100)}%
                                      relevant
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {loading && (
            <div className="message bot loading">
              <div className="message-content">
                <div className="message-header">
                  <strong className="message-author">AI Assistant</strong>
                  <span className="message-time">Now</span>
                </div>
                <div className="message-text">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  Analyzing news sources and generating response...
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="input-area">
          <div className="input-container">
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                autoResize(e);
              }}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about the latest news..."
              rows={1}
              disabled={loading}
              className="message-input"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !message.trim()}
              className="send-button"
              title="Send message (Enter)"
            >
              {loading ? "⏳" : "📤"}
            </button>
          </div>
          <div className="input-footer">
            <span className="input-hint">
              Press Enter to send, Shift+Enter for new line
            </span>
            <span className="message-count">
              {messages.length > 0 &&
                `${messages.length} messages in this session`}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
