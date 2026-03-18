import { useState } from 'react';
import styles from './ContactFloor.module.css';

export const ContactFloor = () => {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); };

  return (
    <div className={styles.floor}>
      <div className={styles.header}>
        <div className={styles.floorLabel}>FLOOR 4</div>
        <h2 className={styles.title}>GET IN TOUCH</h2>
      </div>

      <div className={styles.body}>
        <div className={styles.links}>
          <a className={styles.link} href="mailto:jack@example.com">✉ EMAIL</a>
          <a className={styles.link} href="https://github.com" target="_blank" rel="noopener noreferrer">⌨ GITHUB</a>
          <a className={styles.link} href="https://linkedin.com" target="_blank" rel="noopener noreferrer">💼 LINKEDIN</a>
          <a className={styles.link} href="https://cern.ch" target="_blank" rel="noopener noreferrer">⚛ CERN</a>
        </div>

        <div className={styles.divider}>— OR SEND A MESSAGE —</div>

        {sent ? (
          <div className={styles.success}>✓ MESSAGE SENT!<br />I'LL BE IN TOUCH SOON.</div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <input className={styles.input} name="name" placeholder="YOUR NAME"
                value={form.name} onChange={handleChange} required />
              <input className={styles.input} name="email" type="email" placeholder="YOUR EMAIL"
                value={form.email} onChange={handleChange} required />
            </div>
            <textarea className={styles.textarea} name="message" placeholder="HELLO JACK..."
              value={form.message} onChange={handleChange} required />
            <button className={styles.sendBtn} type="submit">&gt; SEND MESSAGE</button>
          </form>
        )}
      </div>
    </div>
  );
};
