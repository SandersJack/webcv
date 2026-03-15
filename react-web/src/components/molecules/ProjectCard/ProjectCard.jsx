import styles from './ProjectCard.module.css';

export const ProjectCard = ({ title, description, tags = [], link }) => {
  return (
    <div className={styles.card}>
      <div className={styles.title}>{title}</div>
      <div className={styles.description}>{description}</div>
      {tags.length > 0 && (
        <div className={styles.tags}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      )}
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer" className={styles.link}>
          &gt; VIEW
        </a>
      )}
    </div>
  );
};
