import React from "react";
import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";
import "./Button.scss";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  onClick,
  type = "button",
  className = "",
  tooltip,
  ...props
}) => {
  const baseClass = "btn";
  const variantClass = `btn--${variant}`;
  const sizeClass = `btn--${size}`;
  const disabledClass = disabled || loading ? "btn--disabled" : "";
  const iconOnlyClass = !children && icon ? "btn--icon-only" : "";

  const classes = [
    baseClass,
    variantClass,
    sizeClass,
    disabledClass,
    iconOnlyClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick?.(e);
  };

  const renderIcon = () => {
    if (loading) {
      return <LoadingSpinner size="small" />;
    }
    return icon;
  };

  const buttonContent = (
    <>
      {icon && iconPosition === "left" && (
        <span className="btn__icon btn__icon--left">{renderIcon()}</span>
      )}

      {children && <span className="btn__text">{children}</span>}

      {icon && iconPosition === "right" && (
        <span className="btn__icon btn__icon--right">{renderIcon()}</span>
      )}
    </>
  );

  const button = (
    <motion.button
      type={type}
      className={classes}
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {buttonContent}
    </motion.button>
  );

  // Wrap with tooltip if provided
  if (tooltip) {
    return (
      <div className="btn-tooltip-wrapper" title={tooltip}>
        {button}
      </div>
    );
  }

  return button;
};

export default Button;
