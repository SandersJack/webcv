import React from 'react';
import styles from './PixelButton.module.css';

interface PixelButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
}

export const PixelButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  style = {},
  type = 'button',
}: PixelButtonProps) => {
  return (
    <button
      type={type}
      className={`${styles.btn} ${styles[variant]} ${styles[size]} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
};
