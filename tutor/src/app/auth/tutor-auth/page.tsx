// pages/tutor-signup.tsx
"use client";

import React, { useState, useRef } from 'react';
import styles from '../../../styles/TutorSignup.module.css';
import { Eye, EyeOff, Home, MapPin, Video, CheckCircle } from 'lucide-react';
import Link from 'next/link';

type TeachingMethod = 'home' | 'move' | 'online';

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
  subjects: string[];
  title: string;
  description: string;
  location: string;
  teachingMethods: TeachingMethod[];
  languages: string[];
  hourlyRate: string;
  phone: string;
  picture: File | null;
  name: string;
  picturePreview: string | null; // Renamed from profilePicturePreview for consistency
}

const TutorSignup = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false,
    subjects: [],
    title: '',
    description: '',
    location: '',
    teachingMethods: [],
    languages: [],
    hourlyRate: '',
    phone: '',
    picture: null,
    name: '',
    picturePreview: null,
  });

  const [languageDropdown, setLanguageDropdown] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
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

  // Predefined cities in Morocco
  const moroccanCities = [
    'Casablanca', 'Rabat', 'Fez', 'Marrakech', 'Agadir', 'Tangier', 'Meknes', 'Oujda', 
    'Kenitra', 'Tetouan', 'Safi', 'El Jadida', 'Beni Mellal', 'Taza', 'Nador', 'Settat',
    'Larache', 'Khouribga', 'Ouarzazate', 'Tiflet', 'Berkane', 'Sidi Slimane', 'Guelmim',
    'Khemisset', 'Benslimane', 'Ifrane', 'Dakhla', 'Midelt', 'Azrou', 'Chefchaouen'
  ];

  // Predefined languages
  const predefinedLanguages = [
    'Arabic', 'French', 'English', 'Spanish', 'German', 'Italian', 'Portuguese', 
    'Dutch', 'Russian', 'Chinese', 'Japanese', 'Korean', 'Turkish', 'Berber', 
    'Tamazight', 'Hassaniya', 'Classical Arabic'
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
      reader.onloadend = () => setFormData(prev => ({ ...prev, picturePreview: reader.result as string }));
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, picturePreview: null }));
    }
  };

  const handleLocationInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleInputChange('location', value);

    if (value.length < 2) {
      setLocationSuggestions([]);
      return;
    }

    // Filter predefined Moroccan cities
    const filteredCities = moroccanCities.filter(city =>
      city.toLowerCase().includes(value.toLowerCase())
    );
    setLocationSuggestions(filteredCities);
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
    // Clear previous validation messages
    setValidationMessage('');
      setNameError('');
      setEmailError('');
      setPasswordError('');

    // Step 0: validate each field and show message under the relevant input
    if (currentStep === 0) {
      if (!formData.name) {
        setNameError('Please enter your name.');
        return;
      }
      if (!formData.email) {
        setEmailError('Please enter your email.');
        return;
      }
      if (!validateEmail(formData.email)) {
        setEmailError('Please enter a valid email address.');
        return;
      }
      if (!formData.password) {
        setPasswordError('Please enter your password.');
        return;
      }
      if (!validatePassword(formData.password)) {
        setPasswordError('Password must be at least 8 characters, include a number and a special character.');
        return;
      }
    }
    
    // Step 1: Subject selection validation
    if (currentStep === 1) {
      if (!formData.subjects || formData.subjects.length === 0 || !formData.subjects[0].trim()) {
        setValidationMessage('Please select at least one subject.');
        return;
      }
    }
    
    // Step 2: Profile title validation - minimum 40 words
    if (currentStep === 2) {
      if (!formData.title || !formData.title.trim()) {
        setValidationMessage('Please enter a profile title.');
        return;
      }
      const wordCount = formData.title.trim().split(/\s+/).filter(word => word.length > 0).length;
      if (wordCount < 40) {
        setValidationMessage(`Profile title must be at least 40 words. Current: ${wordCount} words.`);
        return;
    }
    }
    
    // Step 3: About you validation - minimum 40 words
    if (currentStep === 3) {
      if (!formData.description || !formData.description.trim()) {
        setValidationMessage('Please enter a description about yourself.');
        return;
      }
      const wordCount = formData.description.trim().split(/\s+/).filter(word => word.length > 0).length;
      if (wordCount < 40) {
        setValidationMessage(`Description must be at least 40 words. Current: ${wordCount} words.`);
        return;
    }
    }
    
    // Step 4: Location validation
    if (currentStep === 4) {
      if (!formData.location || !formData.location.trim()) {
        setValidationMessage('Please enter your teaching location.');
        return;
      }
      // Validate that the location is from the predefined list
      if (!moroccanCities.some(city => city.toLowerCase() === formData.location.trim().toLowerCase())) {
        setValidationMessage('Please select a valid city from the suggestions.');
        return;
      }
      // Check if at least one teaching method is selected
      if (formData.teachingMethods.length === 0) {
        setValidationMessage('Please select at least one teaching method.');
        return;
      }
    }
    
    // Step 5: Languages validation
    if (currentStep === 5) {
      if (formData.languages.length === 0) {
        setValidationMessage('Please select at least one language.');
        return;
      }
      // Validate that all selected languages are from the predefined list
      const invalidLanguages = formData.languages.filter(lang => 
        !predefinedLanguages.some(predefined => predefined.toLowerCase() === lang.toLowerCase())
      );
      if (invalidLanguages.length > 0) {
        setValidationMessage('Please select languages from the predefined list only.');
        return;
      }
    }
    
    // Step 6: Hourly rate validation
    if (currentStep === 6) {
      if (!formData.hourlyRate || !formData.hourlyRate.trim()) {
        setValidationMessage('Please enter your hourly rate.');
        return;
      }
      const rate = parseFloat(formData.hourlyRate);
      if (isNaN(rate) || rate <= 0) {
        setValidationMessage('Please enter a valid hourly rate (greater than 0).');
        return;
    }
    }
    
    // Step 7: Phone validation
    if (currentStep === 7) {
      if (!formData.phone || !formData.phone.trim()) {
        setValidationMessage('Please enter your phone number.');
        return;
      }
      if (!validatePhone(formData.phone)) {
        setValidationMessage('Phone number must be exactly 10 digits.');
        return;
      }
    }
    
    // Step 8: Profile picture validation
    if (currentStep === 8) {
      if (!formData.picturePreview) {
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
    // Convert image to base64 if it exists
    let pictureBase64 = '';
    if (formData.picture) {
      pictureBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(formData.picture!);
      });
    }

    const tutorProfile = {
      name: formData.name,
      email: formData.email,
      password: formData.password, // Include password for account creation
      phone: formData.phone,
      subjects: formData.subjects,
      title: formData.title,
      location: formData.location,
      teachingMethods: formData.teachingMethods,
      languages: formData.languages,
      picture: pictureBase64, // Send base64 string instead of File object
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
    
    console.log('About to send tutorProfile:', tutorProfile);
    
    const res = await fetch('/api/tutor-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tutorProfile),
    });
    
    console.log('Registration response status:', res.status);
    const registrationData = await res.json();
    console.log('Registration response data:', registrationData);
    
    if (res.ok) {
      console.log('Registration successful, saving fallback data...');
      // Save the just-submitted tutor profile as a fallback
      localStorage.setItem('tutorProfileFallback', JSON.stringify(tutorProfile));
      console.log('Fallback data saved to localStorage');
      
      // Automatically log in the user
      console.log('Attempting automatic login...');
      const loginRes = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      
      console.log('Login response status:', loginRes.status);
      const loginData = await loginRes.json();
      console.log('Login response data:', loginData);
      
      if (loginRes.ok && loginData.user) {
        console.log('Login successful, saving user data...');
        localStorage.setItem('user', JSON.stringify(loginData.user));
        console.log('User data saved to localStorage:', localStorage.getItem('user'));
        console.log('Redirecting to tutor-dash...');
        window.location.href = '/tutor-dash';
      } else {
        console.log('Login failed, redirecting to manual login...');
        alert('Signup succeeded but automatic login failed. Please log in manually.');
        window.location.href = '/auth/login';
      }
    } else {
      console.log('Registration failed');
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
            <p style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
              Enter the main subject you teach (e.g., Mathematics, Physics, English, etc.)
            </p>
            <input
              type="text"
              placeholder="e.g., Mathematics, Physics, English"
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
              <p style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
                Minimum 40 words required
              </p>
              <textarea
                placeholder="ex: Conservatory graduate..."
                value={formData.title}
                onChange={e => handleInputChange('title', e.target.value)}
                className={styles.textarea}
                style={{ width: '500px', height: '200px', marginBottom: '0.5rem', resize: 'none' }}
              />
              <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1.5rem' }}>
                Word count: {formData.title ? formData.title.trim().split(/\s+/).filter(word => word.length > 0).length : 0}/40
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
      case 3:
        return (
          <div className={styles.step}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
              <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>About You</h2>
              <p style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
                Minimum 40 words required
              </p>
              <textarea
                className={styles.textarea}
                placeholder="ex: Conservatory graduate..."
                value={formData.description || ''}
                onChange={e => handleInputChange('description', e.target.value)}
                rows={6}
                aria-label="About you"
                style={{ width: '500px', height: '200px', marginBottom: '0.5rem', display: 'block',resize: 'none' }}
              />
              <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1.5rem' }}>
                Word count: {formData.description ? formData.description.trim().split(/\s+/).filter(word => word.length > 0).length : 0}/40
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
      case 4:
        return (
          <div className={styles.step}>
            <div className={styles.locationRow}>
              <div className={styles.locationInputCol}>
                <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Course Location</h2>
                <p style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
                  Select a city from the list below
                </p>
                <div style={{ position: 'relative', width: '100%', maxWidth: 500, margin: '0 auto' }}>
                  <input
                    type="text"
                    placeholder="Start typing a Moroccan city..."
                    value={formData.location}
                    onChange={handleLocationInput}
                    className={styles.input}
                    autoComplete="off"
                    style={{ width: '100%' }}
                    aria-label="Course location"
                  />
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
        const filteredLanguages = predefinedLanguages.filter(
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
              <p style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
                Select languages from the list below
              </p>
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
              <p style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
                Set your hourly rate in Moroccan Dirhams (MAD)
              </p>
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
              <p style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
                Enter your 10-digit Moroccan phone number
              </p>
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
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Add Your Picture</h2>
            
            <div style={{ 
              display: 'flex', 
              gap: '3rem', 
              alignItems: 'flex-start',
              maxWidth: '900px',
              margin: '0 auto'
            }}>
              {/* Left Column - Instructions */}
              <div style={{ flex: 1, maxWidth: '450px' }}>
                {/* Photo Guidelines */}
                <div style={{ 
                  background: '#f8f9fa', 
                  borderRadius: '12px', 
                  padding: '24px', 
                  marginBottom: '20px', 
                  border: '1px solid #e9ecef'
                }}>
                  <h3 style={{ 
                    margin: '0 0 16px 0', 
                    fontSize: '18px', 
                    fontWeight: '600',
                    color: '#495057',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    📸 Photo Guidelines
                  </h3>
                  <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#6c757d' }}>
                    <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ fontSize: '16px', color: '#28a745' }}>✅</span>
                      <span><strong style={{ color: '#495057' }}>Professional headshot</strong> - Clear, well-lit photo of your face</span>
                    </div>
                    <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ fontSize: '16px', color: '#28a745' }}>✅</span>
                      <span><strong style={{ color: '#495057' }}>Good lighting</strong> - Natural light or well-lit indoor setting</span>
                    </div>
                    <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ fontSize: '16px', color: '#28a745' }}>✅</span>
                      <span><strong style={{ color: '#495057' }}>Neutral background</strong> - Simple, uncluttered background</span>
                    </div>
                    <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ fontSize: '16px', color: '#28a745' }}>✅</span>
                      <span><strong style={{ color: '#495057' }}>Friendly expression</strong> - Approachable and welcoming smile</span>
                    </div>
                    <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ fontSize: '16px', color: '#28a745' }}>✅</span>
                      <span><strong style={{ color: '#495057' }}>High quality</strong> - Clear, not blurry or pixelated</span>
                    </div>
                  </div>
                </div>

                {/* What to Avoid */}
                <div style={{ 
                  background: '#fff5f5', 
                  borderRadius: '12px', 
                  padding: '20px', 
                  marginBottom: '20px', 
                  border: '1px solid #fed7d7'
                }}>
                  <h4 style={{ 
                    margin: '0 0 12px 0', 
                    fontSize: '16px', 
                    fontWeight: '600',
                    color: '#c53030',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    ⚠️ Avoid These
                  </h4>
                  <div style={{ fontSize: '13px', lineHeight: '1.5', color: '#e53e3e' }}>
                    <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ fontSize: '14px' }}>❌</span>
                      <span>Group photos, selfies with filters, dark/blurry images</span>
                    </div>
                    <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ fontSize: '14px' }}>❌</span>
                      <span>Casual photos, party pictures, or inappropriate content</span>
                    </div>
                    <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ fontSize: '14px' }}>❌</span>
                      <span>Logos, text overlays, or heavily edited photos</span>
                    </div>
                  </div>
                </div>

                {/* Helpful Tip */}
                <div style={{ 
                  background: '#f0fff4', 
                  borderRadius: '12px', 
                  padding: '16px', 
                  border: '1px solid #c6f6d5'
                }}>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '13px', 
                    color: '#2f855a',
                    fontWeight: '500',
                    lineHeight: '1.5'
                  }}>
                    💡 <strong>Pro tip:</strong> A professional photo increases your chances of getting hired by 40%! 
                    Students prefer tutors with clear, friendly profile pictures.
                  </p>
                </div>
              </div>

              {/* Right Column - Photo Upload */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                className={styles.avatarUpload}
                onClick={() => avatarInputRef.current && avatarInputRef.current.click()}
                  style={{ cursor: 'pointer', marginBottom: '1rem' }}
              >
                  {formData.picturePreview ? (
                    <div style={{ position: 'relative', textAlign: 'center', marginBottom: '0.5rem', width: '120px', height: '120px' }}>
                  <img
                        src={formData.picturePreview}
                    alt="Profile preview"
                    className={styles.avatarImage}
                        style={{
                          borderRadius: '50%',
                          width: '120px',
                          height: '120px',
                          objectFit: 'cover',
                          background: '#fff',
                          display: 'block',
                        }}
                      />
                      {/* Floating green check badge, inside the photo area */}
                      <span style={{
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(67, 233, 123, 0.15)',
                        border: '2px solid #fff',
                        zIndex: 2,
                        transform: 'translate(25%, 25%)',
                      }}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="10" cy="10" r="10" fill="none"/>
                          <path d="M6 10.5L9 13.5L14 8.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                  ) : (
                    <div className={styles.avatarPlaceholder} style={{
                      border: '3px dashed #007bff',
                      borderRadius: '50%',
                      width: '120px',
                      height: '120px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#f8f9fa',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                      <span style={{ 
                        fontSize: '12px', 
                        color: '#007bff', 
                        marginTop: '8px',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}>
                        Click to upload<br/>your photo
                      </span>
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
                {/* Validation message under photo */}
              {validationMessage && <div className={styles.validationMessage}>{validationMessage}</div>}
                {/* Button row directly under photo */}
                <div className={styles.buttonRow} style={{ marginTop: '1.5rem', justifyContent: 'center' }}>
                {currentStep > 0 && (
                  <button type="button" onClick={prevStep} className={styles.backBtn}>Back</button>
                )}
                {currentStep < steps.length - 1 && (
                  <button type="button" onClick={nextStep} className={styles.nextBtn}>Next</button>
                )}
                </div>
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
