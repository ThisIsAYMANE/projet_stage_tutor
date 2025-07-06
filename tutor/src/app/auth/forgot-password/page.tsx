// app/forgot-password/page.tsx OR pages/forgot-password.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../../../styles/ForgotPassword.module.css'; // Adjust the path if needed

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [languageDropdown, setLanguageDropdown] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send reset email');
      }

      alert('Password reset email sent! Check your inbox.');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send reset email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerFlex}>
            <div className={styles.logoContainer}>
              <Link href="/" className={styles.logoLink}>
                <span className={styles.logoText}>StudyFinder</span>
                <div className={styles.logoIndicator}></div>
              </Link>
            </div>
            
            <nav className={styles.nav}>
              <Link href="/find-tutors" className={styles.navLink}>
                Find tutors
              </Link>
              <Link href="/become-tutor" className={styles.navLink}>
                Become a tutor
              </Link>
            </nav>

            <div className={styles.headerActions}>
              <div className={styles.dropdown}>
                <button
                  onClick={() => setLanguageDropdown(!languageDropdown)}
                  className={styles.dropdownButton}
                >
                  <span>English, USD</span>
                  <svg className={styles.dropdownIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </button>
                {languageDropdown && (
                  <div className={styles.dropdownMenu}>
                    <a href="#" className={styles.dropdownItem}>
                      English, USD
                    </a>
                    <a href="#" className={styles.dropdownItem}>
                      Español, EUR
                    </a>
                  </div>
                )}
              </div>
              
              <button className={styles.helpButton} aria-label="Help" title="Help">
                <svg className={styles.helpIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </button>
              
              <Link href="../login">
                <button className={styles.loginButton}>
                  Log in
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Forgot your password?</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Your email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className={styles.input}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ForgotPasswordPage;