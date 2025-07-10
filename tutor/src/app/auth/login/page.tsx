"use client"
// pages/login.tsx
import React, { useState } from 'react';
import Link from 'next/link';
// Removed lucide-react import - using custom SVG icons instead
import styles from '../../../styles/login.module.css';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [languageDropdown, setLanguageDropdown] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Login failed: ${data.error}`);
        return;
      }

      // Login successful
      alert(`Login successful!\nUser ID: ${data.user.id}\nName: ${data.user.Name}\nEmail: ${data.user.email}\nUser Type: ${data.user.userType}`);
      
      // Store user data in localStorage or session storage
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect to dashboard or home page
      window.location.href = '/';
      
    } catch (error) {
      console.error('Login error:', error);
      alert(`Login error: ${error}`);
    }
  };

  const handleGoogleLogin = () => {
    // Handle Google login logic here
    console.log('Login with Google');
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
              
              <button className={styles.loginButton}>
                Log In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h1 className={styles.title}>Log in</h1>
            <p className={styles.subtitle}>
              <Link href="../register" className={styles.signupLink}>
                Sign up as a student
              </Link>
              {' or '}
              <Link href="../tutor-auth" className={styles.signupLink}>
                Sign up as a tutor
              </Link>
            </p>
          </div>

          <div className={styles.formContent}>
            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              className={styles.googleButton}
            >
              <svg className={styles.googleIcon} viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className={styles.divider}>
              <div className={styles.dividerLine} />
              <div className={styles.dividerText}>
                <span>or</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  placeholder="Email"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <div className={styles.passwordContainer}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.passwordInput}
                    placeholder="Your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.passwordToggle}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className={styles.eyeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg className={styles.eyeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className={styles.forgotPassword}>
                <Link href="../forgot-password" className={styles.forgotLink}>
                  Forgot your password?
                </Link>
              </div>

              <div className={styles.checkboxContainer}>
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className={styles.checkbox}
                />
                <label htmlFor="remember-me" className={styles.checkboxLabel}>
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                className={styles.submitButton}
              >
                Log in
              </button>
            </form>

            <div className={styles.terms}>
              By clicking Log in or Continue with, you agree to StudyFinder{' '}
              <Link href="/terms" className={styles.termsLink}>
                Terms of Use
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className={styles.termsLink}>
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;