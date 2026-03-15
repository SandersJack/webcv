import styles from './PixelText.module.css';

export const PixelText = ({ children, size = 'md', color, as: Tag = 'span', className = '', style = {} }) => {
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
