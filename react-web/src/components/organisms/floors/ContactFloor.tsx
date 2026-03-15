import { useState } from 'react';
import { PixelButton } from '../../atoms/PixelButton';
import styles from './ContactFloor.module.css';

interface FormState {
  name: string;
  email: string;
  message: string;
}

export const ContactFloor = () => {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app you'd send this somewhere
    setSent(true);
  };

  return (
    <div className={styles.floor}>
      <div className={styles.floorTag}>// FLOOR 4 — CONTACT</div>

      <h2 className={styles.heading}>
        GET IN <span className={styles.headingAccent}>TOUCH</span>
      </h2>

      <div className={styles.divider} />

      {!sent ? (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="name">NAME:</label>
            <input
              className={styles.input}
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name..."
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="email">EMAIL:</label>
            <input
              className={styles.input}
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="message">MESSAGE:</label>
            <textarea
              className={styles.textarea}
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Hello Jack..."
              required
            />
          </div>

          <div className={styles.submitRow}>
            <PixelButton type="submit" variant="primary">
              &gt; SEND
            </PixelButton>
          </div>
        </form>
      ) : (
        <div className={styles.success}>
          ✓ MESSAGE SENT! I'LL BE IN TOUCH SOON.
        </div>
      )}

      <div className={styles.sectionLabel}>— OR FIND ME AT:</div>

      <div className={styles.links}>
        <a className={styles.link} href="mailto:jack@example.com">
          EMAIL
        </a>
        <a className={styles.link} href="https://github.com" target="_blank" rel="noopener noreferrer">
          GITHUB
        </a>
        <a className={styles.link} href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
          LINKEDIN
        </a>
        <a className={styles.link} href="https://cern.ch" target="_blank" rel="noopener noreferrer">
          CERN
        </a>
      </div>
    </div>
  );
};
