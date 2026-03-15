import styles from './PixelBorder.module.css';

export const PixelBorder = ({ children, color = 'default', className = '', style = {} }) => {
  return (
    <div className={`${styles.border} ${styles[color] || styles.default} ${className}`} style={style}>
      {children}
    </div>
  );
};
