import styles from './PixelButton.module.css';

export const PixelButton = ({ children, onClick, variant = 'primary', size = 'md', className = '', style = {} }) => {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${styles[size]} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
};
