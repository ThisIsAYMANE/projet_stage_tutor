"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, HelpCircle, ChevronDown } from 'lucide-react';
import styles from '../../../styles/signup.module.css';
import { adminDb } from '../../../lib/firebase-admin';

const SignUpPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rememberMe: false
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Registration failed');
        return;
      }

      // Registration successful - redirect to login page
      window.location.href = '../login';
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
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
                  className={styles.dropdownButton}
                  onClick={toggleDropdown}
                >
                  English, USD
                  <ChevronDown className={styles.dropdownIcon} />
                </button>
                {dropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    <Link href="#" className={styles.dropdownItem}>
                      English, USD
                    </Link>
                    <Link href="#" className={styles.dropdownItem}>
                      Français, EUR
                    </Link>
                  </div>
                )}
              </div>

              <button className={styles.helpButton} aria-label="Help">
                <HelpCircle className={styles.helpIcon} />
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

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h1 className={styles.title}>Sign up as a student</h1>
            <p className={styles.subtitle}>
              Already have an account?{' '}
              <Link href="../login" className={styles.signupLink}>
                Log in
              </Link>
            </p>
          </div>

          <div className={styles.formContent}>
            {/* Google Sign Up Button */}
            <button className={styles.googleButton}>
              <svg className={styles.googleIcon} viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

         

            {/* Divider */}
            <div className={styles.divider}>
              <div className={styles.dividerLine}></div>
              <div className={styles.dividerText}>
                <span>or</span>
              </div>
            </div>

            {/* Sign Up Form */}
            <form className={styles.form} onSubmit={handleSubmit}>
              {/* Name Input */}
              <div className={styles.inputGroup}>
                <label htmlFor="name" className={styles.label}>
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className={styles.input}
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              {/* Email Input */}
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={styles.input}
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              {/* Password Input */}
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
                    className={styles.passwordInput}
                    placeholder="Your password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className={styles.eyeIcon} />
                    ) : (
                      <Eye className={styles.eyeIcon} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className={styles.checkboxContainer}>
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  className={styles.checkbox}
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                />
                <label htmlFor="rememberMe" className={styles.checkboxLabel}>
                  Remember me
                </label>
              </div>

              {/* Submit Button */}
              <button type="submit" className={styles.submitButton}>
                Sign up
              </button>
            </form>

            {/* Terms and Conditions */}
            <p className={styles.terms}>
              By clicking Continue or Sign up, you agree to{' '}
              <Link href="/terms" className={styles.termsLink}>
                StudyFinder Terms of Use
              </Link>{' '}
              including{' '}
              <Link href="/subscription-terms" className={styles.termsLink}>
                Subscription Terms
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className={styles.termsLink}>
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUpPage;