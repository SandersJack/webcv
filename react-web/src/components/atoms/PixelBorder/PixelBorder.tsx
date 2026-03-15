import React from 'react';
import styles from './PixelBorder.module.css';

interface PixelBorderProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const PixelBorder = ({
  children,
  color = 'default',
  className = '',
  style = {},
}: PixelBorderProps) => {
  return (
    <div className={`${styles.border} ${styles[color] || styles.default} ${className}`} style={style}>
      {children}
    </div>
  );
};
