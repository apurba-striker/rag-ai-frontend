import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSend, FiMic, FiMicOff, FiPaperclip, FiSmile } from "react-icons/fi";
import { toast } from "react-hot-toast";

import Button from "@components/UI/Button";

const MessageInput = ({ onSendMessage, disabled, placeholder }) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const textareaRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [message]);

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled) return;

    // Validate message length
    if (trimmedMessage.length > 1000) {
      toast.error("Message too long. Please keep it under 1000 characters.");
      return;
    }

    if (trimmedMessage.length < 3) {
      toast.error("Message too short. Please ask a more detailed question.");
      return;
    }

    onSendMessage(trimmedMessage);
    setMessage("");
    textareaRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleVoiceInput = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error("Voice input not supported in this browser");
      return;
    }

    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        // Here you would typically send the audio to a speech-to-text service
        toast.success(
          "Voice recording completed (Speech-to-text integration needed)"
        );

        // Cleanup
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Recording started... Click again to stop");
    } catch (error) {
      toast.error("Failed to access microphone");
      console.error("Voice input error:", error);
    }
  };

  const insertEmoji = (emoji) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newMessage =
      message.substring(0, start) + emoji + message.substring(end);
    setMessage(newMessage);

    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);

    setShowEmoji(false);
  };

  const quickEmojis = ["😊", "🤔", "👍", "❤️", "😂", "🔥", "💡", "👀"];

  return (
    <motion.div
      className="message-input"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="message-input__form">
        {/* Main Input Area */}
        <div className="message-input__main">
          {/* Additional Actions */}
          <div className="message-input__actions">
            {/* Voice Input */}
            <motion.button
              type="button"
              className={`message-input__action ${
                isRecording ? "message-input__action--recording" : ""
              }`}
              onClick={handleVoiceInput}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={disabled}
            >
              {isRecording ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <FiMicOff />
                </motion.div>
              ) : (
                <FiMic />
              )}
            </motion.button>

            {/* Emoji Picker */}
            <div className="message-input__emoji-container">
              <motion.button
                type="button"
                className="message-input__action"
                onClick={() => setShowEmoji(!showEmoji)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={disabled}
              >
                <FiSmile />
              </motion.button>

              {showEmoji && (
                <motion.div
                  className="message-input__emoji-picker"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  {quickEmojis.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      className="message-input__emoji"
                      onClick={() => insertEmoji(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Text Input */}
          <div className="message-input__text-container">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder || "Ask me about the latest news..."}
              disabled={disabled}
              className="message-input__textarea"
              rows={1}
              maxLength={1000}
            />

            {/* Character Count */}
            {message.length > 800 && (
              <div
                className={`message-input__char-count ${
                  message.length > 1000
                    ? "message-input__char-count--error"
                    : ""
                }`}
              >
                {message.length}/1000
              </div>
            )}
          </div>

          {/* Send Button */}
          <Button
            type="submit"
            variant="primary"
            size="medium"
            disabled={disabled || !message.trim()}
            className="message-input__send"
            icon={<FiSend />}
            loading={disabled}
          />
        </div>

        {/* Input Status */}
        <div className="message-input__status">
          {disabled && (
            <motion.div
              className="message-input__status-item"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="message-input__typing-indicator">
                <div className="message-input__typing-dot"></div>
                <div className="message-input__typing-dot"></div>
                <div className="message-input__typing-dot"></div>
              </div>
              AI is processing your request...
            </motion.div>
          )}

          <div className="message-input__help">
            <span>Press Enter to send, Shift+Enter for new line</span>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default MessageInput;
