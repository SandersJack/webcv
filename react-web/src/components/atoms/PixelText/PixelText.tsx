import React from 'react';
import styles from './PixelText.module.css';

interface PixelTextProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export const PixelText = ({
  children,
  size = 'md',
  color,
  as: Tag = 'span',
  className = '',
  style = {},
}: PixelTextProps) => {
  const sizeClass = styles[size] || styles.md;

  return (
    <Tag
      className={`${styles.pixelText} ${sizeClass} ${className}`}
      style={{ color: color || 'inherit', ...style }}
    >
      {children}
    </Tag>
  );
};
