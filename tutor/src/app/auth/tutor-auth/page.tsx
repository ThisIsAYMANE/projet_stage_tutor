// pages/tutor-signup.tsx
"use client";

import React, { useState, useRef } from 'react';
import styles from '../../../styles/TutorSignup.module.css';
import { Eye, EyeOff, Home, MapPin, Video, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
  subjects: string[];
  title: string;
  description: string;
  location: string;
  teachingMethods: string[];
  languages: string[];
  hourlyRate: string;
  phone: string;
  picture: File | null;
  name: string; // Added for the first step
  profilePicturePreview: string | null; // Added for the picture step
}

const TutorSignup: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false,
    subjects: [],
    title: '',
    description: '',
    location: 'Safi, Maroc',
    teachingMethods: [],
    languages: [],
    hourlyRate: '',
    phone: '',
    picture: null,
    name: '', // Initialize name field
    profilePicturePreview: null, // Initialize profile picture preview
  });
  const [picturePreview, setPicturePreview] = useState<string | null>(null);
  const [languageDropdown, setLanguageDropdown] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [languageInput, setLanguageInput] = useState('');
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  const steps = [
    'Sign Up',
    'Subject Selection',
    'Profile Title',
    'About You',
    'Teaching Location',
    'Languages Spoken',
    'Hourly Rate',
    'Phone Number',
    'Add Your Picture',
    'Confirmation',
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && !validateImageFile(file)) {
      setValidationMessage('Profile picture must be a JPEG, PNG, or WEBP image.');
      return;
    }
    handleInputChange('picture', file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, profilePicturePreview: reader.result as string }));
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, profilePicturePreview: null }));
    }
  };

  const handleLocationInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleInputChange('location', value);

    if (value.length < 3) {
      setLocationSuggestions([]);
      return;
    }

    setLocationLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}`
      );
      const data = await res.json();
      setLocationSuggestions(data.map((item: any) => item.display_name));
    } catch (err) {
      setLocationSuggestions([]);
    }
    setLocationLoading(false);
  };

  const handleLocationSelect = (suggestion: string) => {
    handleInputChange('location', suggestion);
    setLocationSuggestions([]);
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const validatePassword = (password: string) => {
    // At least 8 chars, one number, one special char
    return /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password);
  };
  const validatePhone = (phone: string) => {
    return /^\d{10}$/.test(phone);
  };
  const validateImageFile = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    return allowedTypes.includes(file.type);
  };

  const nextStep = () => {
    // Step 0: validate each field and show message under the relevant input
    if (currentStep === 0) {
      let valid = true;
      setNameError('');
      setEmailError('');
      setPasswordError('');
      if (!formData.name) {
        setNameError('Please enter your name.');
        valid = false;
      }
      if (!formData.email) {
        setEmailError('Please enter your email.');
        valid = false;
      } else if (!validateEmail(formData.email)) {
        setEmailError('Please enter a valid email address.');
        valid = false;
      }
      if (!formData.password) {
        setPasswordError('Please enter your password.');
        valid = false;
      } else if (!validatePassword(formData.password)) {
        setPasswordError('Password must be at least 8 characters, include a number and a special character.');
        valid = false;
      }
      if (!valid) return;
    }
    // Steps 1-8: use setValidationMessage as before
    if (currentStep === 1) {
      if (!formData.subjects || formData.subjects.length === 0) {
        setValidationMessage('Please select at least one subject.');
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.title) {
        setValidationMessage('Please enter a profile title.');
        return;
      }
    }
    if (currentStep === 3) {
      if (!formData.location) {
        setValidationMessage('Please enter your teaching location.');
        return;
      }
    }
    if (currentStep === 4) {
      if (!formData.description) {
        setValidationMessage('Please enter a description.');
        return;
      }
    }
    if (currentStep === 6) {
      if (!formData.hourlyRate) {
        setValidationMessage('Please enter your hourly rate.');
        return;
      }
    }
    if (currentStep === 7) {
      if (!formData.phone) {
        setValidationMessage('Please enter your phone number.');
        return;
      }
      if (!validatePhone(formData.phone)) {
        setValidationMessage('Phone number must be exactly 10 digits.');
        return;
      }
    }
    if (currentStep === 8) {
      if (!formData.profilePicturePreview) {
        setValidationMessage('Please add a profile picture.');
        return;
      }
      if (formData.picture && !validateImageFile(formData.picture)) {
        setValidationMessage('Profile picture must be a JPEG, PNG, or WEBP image.');
        return;
      }
    }
    if (currentStep > 0) setValidationMessage('');
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleTutorSignup = async () => {
    const tutorProfile = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subjects: formData.subjects,
      title: formData.title,
      location: formData.location,
      teachingMethods: formData.teachingMethods,
      languages: formData.languages,
      picture: formData.picture || '',
      bio: formData.description,
      hourlyRate: Number(formData.hourlyRate),
      experience: '', // You can add a step for this or leave empty
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isAvailable: true,
      averageRating: 0,
      totalReviews: 0,
    };
    const res = await fetch('/api/tutor-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tutorProfile),
    });
    if (res.ok) {
      window.location.href = '/dashboard';
    } else {
      alert('Failed to register tutor profile');
    }
  };

  // Step renderers
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h1 className={styles.title}>Sign up as a tutor</h1>
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
              <form className={styles.form}>
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
                    value={formData.name || ''}
                    onChange={e => handleInputChange('name', e.target.value)}
                  />
                  {nameError && <div className={styles.validationMessage}>{nameError}</div>}
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
                    onChange={e => handleInputChange('email', e.target.value)}
                  />
                  {emailError && <div className={styles.validationMessage}>{emailError}</div>}
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
                      onChange={e => handleInputChange('password', e.target.value)}
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className={styles.eyeIcon} />
                      ) : (
                        <Eye className={styles.eyeIcon} />
                      )}
                    </button>
                  </div>
                  {passwordError && <div className={styles.validationMessage}>{passwordError}</div>}
                </div>
                {/* Remember Me Checkbox */}
                <div className={styles.checkboxContainer}>
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    className={styles.checkbox}
                    checked={formData.rememberMe}
                    onChange={e => handleInputChange('rememberMe', e.target.checked)}
                  />
                  <label htmlFor="rememberMe" className={styles.checkboxLabel}>
                    Remember me
                  </label>
                </div>
                {/* Next Button */}
                <button type="button" className={styles.submitButton} onClick={nextStep}>
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
        );
      case 1:
        return (
          <div className={styles.step}>
            <h2>Which subjects do you teach?</h2>
            <input
              type="text"
              placeholder="Try 'Math'"
              value={formData.subjects[0] || ''}
              onChange={e => handleInputChange('subjects', [e.target.value])}
              className={styles.input}
            />
            {validationMessage && <div className={styles.validationMessage}>{validationMessage}</div>}
            <div className={styles.buttonRow}>
              {currentStep > 0 && (
                <button type="button" onClick={prevStep} className={styles.backBtn}>Back</button>
              )}
              {currentStep < steps.length - 1 && (
                <button type="button" onClick={nextStep} className={styles.nextBtn}>Next</button>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className={styles.step}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Profile Title</h2>
              <textarea
                placeholder="ex: Conservatory graduate..."
                value={formData.title}
                onChange={e => handleInputChange('title', e.target.value)}
                className={styles.textarea}
                style={{ width: '500px', height: '200px', marginBottom: '2rem', resize: 'none' }}
              />
              {validationMessage && <div className={styles.validationMessage}>{validationMessage}</div>}
              <div className={styles.buttonRow}>
                {currentStep > 0 && (
                  <button type="button" onClick={prevStep} className={styles.backBtn}>Back</button>
                )}
                {currentStep < steps.length - 1 && (
                  <button type="button" onClick={nextStep} className={styles.nextBtn}>Next</button>
                )}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className={styles.step}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
              <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>About You</h2>
              <textarea
                className={styles.textarea}
                placeholder="ex: Conservatory graduate..."
                value={formData.description || ''}
                onChange={e => handleInputChange('description', e.target.value)}
                rows={6}
                aria-label="About you"
                style={{ width: '500px', height: '200px', marginBottom: '2rem', display: 'block',resize: 'none' }}
              />
              {validationMessage && <div className={styles.validationMessage}>{validationMessage}</div>}
              <div className={styles.buttonRow}>
                {currentStep > 0 && (
                  <button type="button" onClick={prevStep} className={styles.backBtn}>Back</button>
                )}
                {currentStep < steps.length - 1 && (
                  <button type="button" onClick={nextStep} className={styles.nextBtn}>Next</button>
                )}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className={styles.step}>
            <div className={styles.locationRow}>
              <div className={styles.locationInputCol}>
                <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Course Location</h2>
                <div style={{ position: 'relative', width: '100%', maxWidth: 500, margin: '0 auto' }}>
                  <input
                    type="text"
                    placeholder="Start typing your location..."
                    value={formData.location}
                    onChange={handleLocationInput}
                    className={styles.input}
                    autoComplete="off"
                    style={{ width: '100%' }}
                    aria-label="Course location"
                  />
                  {locationLoading && <div>Loading...</div>}
                  {locationSuggestions.length > 0 && (
                    <ul className={styles.suggestionDropdown}>
                      {locationSuggestions.map((suggestion, idx) => (
                        <li
                          key={idx}
                          onClick={() => handleLocationSelect(suggestion)}
                          className={styles.suggestionItem}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {validationMessage && <div className={styles.validationMessage}>{validationMessage}</div>}
                <div className={styles.buttonRow}>
                  {currentStep > 0 && (
                    <button type="button" onClick={prevStep} className={styles.backBtn}>Back</button>
                  )}
                  {currentStep < steps.length - 1 && (
                    <button type="button" onClick={nextStep} className={styles.nextBtn}>Next</button>
                  )}
                </div>
              </div>
              <div className={styles.teachingMethodsCol}>
                <div className={styles.teachingMethodsWidgetGroup}>
                  <label className={styles.teachingMethodWidget} aria-label="At your place">
                    <input
                      type="checkbox"
                      checked={formData.teachingMethods.includes('home')}
                      onChange={e => {
                        const checked = e.target.checked;
                        handleInputChange('teachingMethods', checked
                          ? [...formData.teachingMethods, 'home']
                          : formData.teachingMethods.filter(m => m !== 'home')
                        );
                      }}
                    />
                    <Home size={18} /> At your place
                  </label>
                  <label className={styles.teachingMethodWidget} aria-label="You can travel (20km)">
                    <input
                      type="checkbox"
                      checked={formData.teachingMethods.includes('move')}
                      onChange={e => {
                        const checked = e.target.checked;
                        handleInputChange('teachingMethods', checked
                          ? [...formData.teachingMethods, 'move']
                          : formData.teachingMethods.filter(m => m !== 'move')
                        );
                      }}
                    />
                    <MapPin size={18} /> You can travel (20km)
                  </label>
                  <label className={styles.teachingMethodWidget} aria-label="Online">
                    <input
                      type="checkbox"
                      checked={formData.teachingMethods.includes('online')}
                      onChange={e => {
                        const checked = e.target.checked;
                        handleInputChange('teachingMethods', checked
                          ? [...formData.teachingMethods, 'online']
                          : formData.teachingMethods.filter(m => m !== 'online')
                        );
                      }}
                    />
                    <Video size={18} /> Online
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
      case 5:
        // List of common languages
        const allLanguages = [
          'English', 'French', 'Spanish', 'German', 'Italian', 'Arabic', 'Chinese', 'Japanese', 'Russian', 'Portuguese', 'Hindi', 'Dutch', 'Turkish', 'Korean', 'Polish', 'Swedish', 'Greek', 'Czech', 'Danish', 'Finnish', 'Hebrew', 'Hungarian', 'Indonesian', 'Norwegian', 'Romanian', 'Thai', 'Ukrainian', 'Vietnamese', 'Other'
        ];
        const filteredLanguages = allLanguages.filter(
          lang =>
            lang.toLowerCase().includes(languageInput.toLowerCase()) &&
            !formData.languages.includes(lang)
        );
        const handleAddLanguage = (lang: string) => {
          handleInputChange('languages', [...formData.languages, lang]);
          setLanguageInput('');
        };
        const handleRemoveLanguage = (lang: string) => {
          handleInputChange('languages', formData.languages.filter(l => l !== lang));
        };
        return (
          <div className={styles.step}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Languages Spoken</h2>
              <div style={{ width: '350px', marginBottom: '1rem', position: 'relative' }}>
                <div className={styles.languageTagsRow}>
                  {formData.languages.map(lang => (
                    <span key={lang} className={styles.languageTag}>
                      {lang}
                      <button
                        type="button"
                        className={styles.languageTagRemove}
                        onClick={() => handleRemoveLanguage(lang)}
                        aria-label={`Remove ${lang}`}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={languageInput}
                  onChange={e => setLanguageInput(e.target.value)}
                  className={styles.input}
                  style={{ width: '100%', marginBottom: 0 }}
                  placeholder="Type a language..."
                  aria-label="Add a language"
                />
                {languageInput && filteredLanguages.length > 0 && (
                  <ul className={styles.suggestionDropdown} style={{ top: '100%', left: 0, right: 0 }}>
                    {filteredLanguages.map(lang => (
                      <li
                        key={lang}
                        className={styles.suggestionItem}
                        onClick={() => handleAddLanguage(lang)}
                      >
                        {lang}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {validationMessage && <div className={styles.validationMessage}>{validationMessage}</div>}
              <div className={styles.buttonRow}>
                {currentStep > 0 && (
                  <button type="button" onClick={prevStep} className={styles.backBtn}>Back</button>
                )}
                {currentStep < steps.length - 1 && (
                  <button type="button" onClick={nextStep} className={styles.nextBtn}>Next</button>
                )}
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className={styles.step}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Hourly Rate</h2>
              <div className={styles.inputWithUnit} style={{ width: '350px', marginBottom: '2rem', position: 'relative' }}>
                <input
                  type="number"
                  placeholder="100"
                  value={formData.hourlyRate || ''}
                  onChange={e => handleInputChange('hourlyRate', e.target.value)}
                  className={styles.input}
                  style={{ width: '100%', paddingRight: '60px' }}
                  aria-label="Hourly rate"
                />
                <span className={styles.inputUnit}>MAD/h</span>
              </div>
              {validationMessage && <div className={styles.validationMessage}>{validationMessage}</div>}
              <div className={styles.buttonRow}>
                {currentStep > 0 && (
                  <button type="button" onClick={prevStep} className={styles.backBtn}>Back</button>
                )}
                {currentStep < steps.length - 1 && (
                  <button type="button" onClick={nextStep} className={styles.nextBtn}>Next</button>
                )}
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className={styles.step}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Phone Number</h2>
              <input
                type="tel"
                placeholder="06XX-XXXXXX"
                value={formData.phone || ''}
                onChange={e => handleInputChange('phone', e.target.value)}
                className={styles.input}
                style={{ width: '350px', marginBottom: '2rem' }}
                aria-label="Phone number"
              />
              {validationMessage && <div className={styles.validationMessage}>{validationMessage}</div>}
              <div className={styles.buttonRow}>
                {currentStep > 0 && (
                  <button type="button" onClick={prevStep} className={styles.backBtn}>Back</button>
                )}
                {currentStep < steps.length - 1 && (
                  <button type="button" onClick={nextStep} className={styles.nextBtn}>Next</button>
                )}
              </div>
            </div>
          </div>
        );
      case 8:
        return (
          <div className={styles.step}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Add Your Picture</h2>
              <div
                className={styles.avatarUpload}
                onClick={() => avatarInputRef.current && avatarInputRef.current.click()}
                style={{ cursor: 'pointer', marginBottom: '2rem' }}
              >
                {formData.profilePicturePreview ? (
                  <img
                    src={formData.profilePicturePreview}
                    alt="Profile preview"
                    className={styles.avatarImage}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M16 20v-2a4 4 0 0 0-8 0v2"/></svg>
                    <span className={styles.avatarPrompt}>Click to add a picture</span>
                  </div>
                )}
                <input
                  id="avatarInput"
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => handleAvatarChange(e)}
                  aria-label="Profile picture upload"
                />
              </div>
              {validationMessage && <div className={styles.validationMessage}>{validationMessage}</div>}
              <div className={styles.buttonRow}>
                {currentStep > 0 && (
                  <button type="button" onClick={prevStep} className={styles.backBtn}>Back</button>
                )}
                {currentStep < steps.length - 1 && (
                  <button type="button" onClick={nextStep} className={styles.nextBtn}>Next</button>
                )}
              </div>
            </div>
          </div>
        );
      case 9:
        return (
          <div className={styles.step}>
            <div className={styles.confirmationCard}>
              <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Your profile is live!</h2>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <strong>{formData.name}</strong><br />
                {formData.subjects && formData.subjects.join(', ')}
                <div style={{ margin: '1rem 0' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2l4-4"/></svg>
                </div>
              </div>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                For your profile to be fully visible, you need at least <strong>two recommendations</strong>.<br />
                Ask your friends or former students via:
                <div className={styles.socialButtonsRow}>
                  <button className={styles.socialBtn} aria-label="Share on LinkedIn">
                    {/* LinkedIn SVG */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#0077b5"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76 1.75.79 1.75 1.76-.78 1.76-1.75 1.76zm13.5 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z"/></svg>
                  </button>
                  <button className={styles.socialBtn} aria-label="Share on Facebook">
                    {/* Facebook SVG */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877f3"><path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.326v21.348c0 .733.592 1.326 1.325 1.326h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.312h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.326v-21.349c0-.734-.593-1.326-1.326-1.326z"/></svg>
                  </button>
                  <button className={styles.socialBtn} aria-label="Share on Messenger">
                    {/* Messenger SVG */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#00b2ff"><path d="M12 2c5.52 0 10 4.13 10 9.21 0 5.08-4.48 9.21-10 9.21-1.09 0-2.14-.15-3.13-.44l-3.44 1.13c-.41.13-.84-.18-.84-.62v-2.41c-1.6-1.67-2.59-3.85-2.59-6.13 0-5.08 4.48-9.21 10-9.21zm1.13 10.13l2.13-2.27c.19-.2.19-.51 0-.71-.19-.2-.5-.2-.69 0l-2.13 2.27-2.13-2.27c-.19-.2-.5-.2-.69 0-.19.2-.19.51 0 .71l2.13 2.27-2.13 2.27c-.19.2-.19.51 0 .71.19.2.5.2.69 0l2.13-2.27 2.13 2.27c.19.2.5.2.69 0 .19-.2.19-.51 0-.71l-2.13-2.27z"/></svg>
                  </button>
                  <button className={styles.socialBtn} aria-label="Share by Email">
                    {/* Mail SVG */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#ea4335"><path d="M12 13.065l-11.99-7.065v14c0 1.104.896 2 2 2h19.98c1.104 0 2-.896 2-2v-14l-11.99 7.065zm11.99-9.065c0-1.104-.896-2-2-2h-19.98c-1.104 0-2 .896-2 2v.217l12 7.083 12-7.083v-.217z"/></svg>
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.buttonRow} style={{ justifyContent: 'center', marginTop: '2rem' }}>
              <button type="button" onClick={prevStep} className={styles.backBtn}>Back</button>
              <button type="button" onClick={handleTutorSignup} className={styles.nextBtn} style={{ marginLeft: '1rem' }}>Let's go!</button>
            </div>
          </div>
        );
      default:
        return null;
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
                  className={styles.dropdownButton}
                  onClick={() => setLanguageDropdown(!languageDropdown)}
                >
                  English, USD
                  <svg className={styles.dropdownIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </button>
                {languageDropdown && (
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

      {currentStep > 0 && (
        <div
          className={styles.progressContainer}
          style={{ '--progress-width': `${((currentStep) / (steps.length - 1)) * 100}%` } as React.CSSProperties}
        >
          <div
            className={styles.progressBar}
          />
        </div>
      )}

      <main className={styles.main}>{renderStep()}</main>

      <footer className={styles.footer}>
        {/* Hide footer navigation on subject selection, profile title, profile description, course location, languages, hourly rate, phone, and picture steps (steps 1-8) */}
        {currentStep !== 1 && currentStep !== 2 && currentStep !== 3 && currentStep !== 4 && currentStep !== 5 && currentStep !== 6 && currentStep !== 7 && currentStep !== 8 && currentStep !== 9 && (
          <>
            {currentStep > 0 && (
              <button type="button" onClick={prevStep} className={styles.backBtn}>Back</button>
            )}
            
          </>
        )}
      </footer>
    </div>
  );
};

export default TutorSignup;
