import React from "react";
import { motion } from "framer-motion";
import "./LoadingSpinner.scss";

const LoadingSpinner = ({
  size = "medium",
  color = "primary",
  text,
  className = "",
}) => {
  const sizeClass = `loading-spinner--${size}`;
  const colorClass = `loading-spinner--${color}`;

  return (
    <div className={`loading-spinner ${sizeClass} ${colorClass} ${className}`}>
      <motion.div
        className="loading-spinner__ring"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="loading-spinner__circle"></div>
      </motion.div>

      {text && (
        <motion.p
          className="loading-spinner__text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;
