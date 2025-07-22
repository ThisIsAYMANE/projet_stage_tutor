'use client';

import { useState, useEffect } from 'react';
import styles from '../../styles/TutorDash.module.css';
import { db } from '../../../firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isFromTutor: boolean;
}

interface Conversation {
  id: string;
  studentName: string;
  lastMessage: string;
  timestamp: string;
  isOnline: boolean;
  unreadCount: number;
}

interface TutorProfile {
  name: string;
  email: string;
  phone: string;
  bio: string;
  subjects: string[];
  title: string;
  location: string;
  teachingMethods: string[];
  languages: string[];
  hourlyRate: number;
  picture: string;
  isAvailable: boolean;
  averageRating: number;
  totalReviews: number;
  experience: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TutorDashboard() {
  const [activeView, setActiveView] = useState<'messages' | 'announcement' | 'profile'>('messages');
  const [activeConversation, setActiveConversation] = useState<string>('sarah');
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Add options for dropdowns/multi-selects
  const subjectOptions: string[] = [
    'Mathematics', 'Science', 'English', 'History', 'Languages', 'Computer Science', 'Physics', 'Chemistry', 'Biology', 'Economics'
  ];
  const languageOptions: string[] = [
    'English', 'French', 'Spanish', 'German', 'Arabic', 'Chinese', 'Japanese', 'Russian', 'Portuguese', 'Italian'
  ];
  const teachingMethodOptions: string[] = ['Online', 'In-person', 'Hybrid'];
  const locationOptions: string[] = [
    "Casablanca", "Rabat", "Fes", "Marrakech", "Agadir", "Tangier", "Meknes", "Oujda", "Kenitra", "Tetouan", "Safi", "El Jadida", "Beni Mellal", "Nador", "Taza", "Khouribga", "Settat", "Berrechid", "Khemisset", "Larache", "Guelmim", "Ksar El Kebir", "Taourirt", "Berkane", "Khenifra", "Inezgane", "Temara", "Sidi Slimane", "Mohammedia", "Sidi Kacem", "Sidi Bennour", "Errachidia", "Guercif", "Ouarzazate", "Dakhla", "Essaouira", "Tiznit", "Taroudant", "Tiflet", "Tan-Tan", "Ouazzane", "Sefrou", "Youssoufia", "Martil", "Midelt", "Azrou", "Ait Melloul", "Fnideq", "Skhirat", "Jerada", "Benslimane", "Ait Ourir"
  ];

  // Add to profileData state
  const [profileData, setProfileData] = useState<{
    fullName: string;
    email: string;
    phone: string;
    bio: string;
    title: string;
    subject: string;
    language: string;
    teachingMethod: string;
    location: string;
    hourlyRate: string;
    experience: string;
    rating: string;
  }>({
    fullName: '',
    email: '',
    phone: '',
    bio: '',
    title: '',
    subject: '',
    language: '',
    teachingMethod: '',
    location: '',
    hourlyRate: '',
    experience: '',
    rating: '',
  });
  
  // Additional tutor profile data
  const [tutorProfile, setTutorProfile] = useState<TutorProfile | null>(null);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Announcement form states
  const [announcementData, setAnnouncementData] = useState({
    title: '',
    description: ''
  });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const conversations: Conversation[] = [
    {
      id: 'sarah',
      studentName: 'Sarah Johnson',
      lastMessage: 'Thanks for the math help yesterday!',
      timestamp: '2m ago',
      isOnline: true,
      unreadCount: 2
    },
    {
      id: 'mike',
      studentName: 'Mike Chen',
      lastMessage: 'Can we schedule a session for tomorrow?',
      timestamp: '1h ago',
      isOnline: false,
      unreadCount: 0
    },
    {
      id: 'emma',
      studentName: 'Emma Wilson',
      lastMessage: 'The chemistry assignment was really helpful',
      timestamp: '3h ago',
      isOnline: true,
      unreadCount: 1
    }
  ];

  const messages: Record<string, Message[]> = {
    sarah: [
      {
        id: '1',
        text: 'Hi! I wanted to thank you for yesterday\'s math session. The quadratic equations finally make sense!',
        timestamp: '10:30 AM',
        isFromTutor: false
      },
      {
        id: '2',
        text: 'I\'m so glad to hear that! You did great work. Keep practicing those problems we went over.',
        timestamp: '10:32 AM',
        isFromTutor: true
      },
      {
        id: '3',
        text: 'Will do! Can we schedule another session for next week?',
        timestamp: '10:35 AM',
        isFromTutor: false
      }
    ]
  };

  const activeStudent = conversations.find(c => c.id === activeConversation);
  const activeMessages = messages[activeConversation] || [];

  const [userProfile, setUserProfile] = useState<{ Name?: string, email?: string } | null>(null);

  useEffect(() => {
    const fetchTutorProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        // Get user from localStorage
        const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        if (!userStr) {
          setError('No user data found. Please log in again.');
          setLoading(false);
          return;
        }
        const user = JSON.parse(userStr);
        if (!user.email) {
          setError('Invalid user data. Please log in again.');
          setLoading(false);
          return;
        }
        const userId = user.email.replace(/[^a-zA-Z0-9]/g, '');
        // Fetch main user doc for Name
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserProfile(userDocSnap.data());
        }
        // Fetch tutor profile from Firestore
        const profileRef = doc(db, 'users', userId, 'tutorProfile', 'profile');
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          const data = profileSnap.data() as TutorProfile;
          setTutorProfile(data);
          setProfileData({
            fullName: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            bio: data.bio || '',
            title: data.title || '',
            subject: data.subjects && data.subjects.length > 0 ? data.subjects[0] : '',
            language: data.languages && data.languages.length > 0 ? data.languages[0] : '',
            teachingMethod: data.teachingMethods && data.teachingMethods.length > 0 ? data.teachingMethods[0] : '',
            location: data.location || '',
            hourlyRate: data.hourlyRate !== undefined && data.hourlyRate !== null ? String(data.hourlyRate) : '',
            experience: data.experience !== undefined && data.experience !== null ? String(data.experience) : '',
            rating: data.averageRating !== undefined && data.averageRating !== null ? String(data.averageRating) : '',
          });
        } else {
          // Try fallback from localStorage
          const fallbackStr = typeof window !== 'undefined' ? localStorage.getItem('tutorProfileFallback') : null;
          if (fallbackStr) {
            const fallbackData = JSON.parse(fallbackStr);
            setTutorProfile(fallbackData);
            setProfileData({
              fullName: fallbackData.name || '',
              email: fallbackData.email || '',
              phone: fallbackData.phone || '',
              bio: fallbackData.bio || '',
              title: fallbackData.title || '',
              subject: fallbackData.subjects && fallbackData.subjects.length > 0 ? fallbackData.subjects[0] : '',
              language: fallbackData.languages && fallbackData.languages.length > 0 ? fallbackData.languages[0] : '',
              teachingMethod: fallbackData.teachingMethods && fallbackData.teachingMethods.length > 0 ? fallbackData.teachingMethods[0] : '',
              location: fallbackData.location || '',
              hourlyRate: fallbackData.hourlyRate || '',
              experience: fallbackData.experience || '',
              rating: fallbackData.averageRating || '',
            });
            setError(null);
          } else {
            setError('Tutor profile not found. Please complete your profile setup.');
          }
        }
      } catch (err) {
        console.error('Error fetching tutor profile:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchTutorProfile();
  }, []);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', messageInput);
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleProfileUpdate = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };
  const handlePasswordUpdate = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };
  const handleAnnouncementUpdate = (field: string, value: string) => {
    setAnnouncementData(prev => ({ ...prev, [field]: value }));
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      // Get user from localStorage
      const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      if (!userStr) {
        setError('No user data found. Please log in again.');
        setLoading(false);
        return;
      }
      const user = JSON.parse(userStr);
      if (!user.email) {
        setError('Invalid user data. Please log in again.');
        setLoading(false);
        return;
      }
      const userId = user.email.replace(/[^a-zA-Z0-9]/g, '');
      // Debug: log profileData before saving
      console.log('Saving tutor profile:', profileData);
      // Save main user info
      await setDoc(doc(db, 'users', userId), {
        email: profileData.email,
        Name: profileData.fullName,
        phone: profileData.phone,
        profilePicture: uploadedImage || '',
        userType: 'tutor',
        isTutor: true,
        createdAt: user.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
      // Save tutor profile info
      await setDoc(doc(db, 'users', userId, 'tutorProfile', 'profile'), {
        bio: profileData.bio,
        hourlyRate: profileData.hourlyRate,
        experience: profileData.experience,
        isVerified: false, // If you want to allow editing, add to form
        createdAt: tutorProfile?.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
        isAvailable: true, // If you want to allow editing, add to form
        averageRating: profileData.rating || 0,
        totalReviews: 0, // If you want to allow editing, add to form
        subject: profileData.subject,
        language: profileData.language,
        location: profileData.location,
        teachingMethod: profileData.teachingMethod,
        rating: profileData.rating || 0,
        phoneNumber: profileData.phone,
        profilePic: uploadedImage || '',
        title: profileData.title,
      }, { merge: true });
      setError(null);
      alert('Profile saved successfully!');
    } catch (err) {
      setError('Failed to save profile. Please try again.');
      console.error('Error saving profile:', err);
    } finally {
      setLoading(false);
    }
  };
  const handlePublishAnnouncement = () => {
    // Publish announcement logic
  };
  const handleSaveAsDraft = () => {
    // Save as draft logic
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div>Loading your profile...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
          <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>
          <button onClick={() => window.location.href = '/auth/login'}>Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Responsive Header for mobile/tablet */}
      <div className={styles.responsiveHeader}>
        <div className={styles.headerContent}>
          <a href="/landing-page" className={styles.logoLink} style={{textDecoration:'none'}}>
            <span className={styles.logoText}>TutorConnect</span>
          </a>
          <button
            className={styles.hamburger}
            aria-label="Open menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className={styles.hamburgerBar}></span>
            <span className={styles.hamburgerBar}></span>
            <span className={styles.hamburgerBar}></span>
          </button>
        </div>
        {menuOpen && (
          <div className={styles.dropdownMenu}>
            <div className={styles.dropdownItem} onClick={() => { setActiveView('messages'); setMenuOpen(false); }}>Messages</div>
            <div className={styles.dropdownItem} onClick={() => { setActiveView('announcement'); setMenuOpen(false); }}>Add Announcement</div>
            <div className={styles.dropdownItem} onClick={() => { setActiveView('profile'); setMenuOpen(false); }}>Edit Profile</div>
            <div className={styles.dropdownItem}>Logout</div>
          </div>
        )}
      </div>
      {/* Sidebar (hidden on mobile/tablet) */}
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <a href="/landing-page" className={styles.logoLink} style={{display:'flex',alignItems:'center',textDecoration:'none'}}>
            <div className={styles.logoIcon}>TC</div>
            <span className={styles.logoText}>TutorConnect</span>
          </a>
        </div>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search conversations, announcements..."
            className={styles.searchInput}
          />
        </div>
        <nav className={styles.nav}>
          <div 
            className={styles.navItem + ' ' + (activeView === 'messages' ? styles.active : '')}
            onClick={() => setActiveView('messages')}
          >
            <span className={styles.navIcon}>💬</span>
            Messages
          </div>
          <div 
            className={styles.navItem + ' ' + (activeView === 'announcement' ? styles.active : '')}
            onClick={() => setActiveView('announcement')}
          >
            <span className={styles.navIcon}>+</span>
            Add Announcement
          </div>
          <div 
            className={styles.navItem + ' ' + (activeView === 'profile' ? styles.active : '')}
            onClick={() => setActiveView('profile')}
          >
            <span className={styles.navIcon}>👤</span>
            Edit Profile
          </div>
        </nav>
        <div className={styles.logout}>
          <div className={styles.navItem} onClick={() => {
            localStorage.clear();
            window.location.href = '/landing-page';
          }}>
            <span className={styles.navIcon}>↗</span>
            Logout
          </div>
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            {tutorProfile?.picture ? (
              <img 
                src={tutorProfile.picture} 
                alt="Profile" 
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {tutorProfile?.name ? tutorProfile.name.split(' ').map(n => n[0]).join('') : 'T'}
              </div>
            )}
            <div className={styles.onlineIndicator}></div>
          </div>
          <div className={styles.userDetails}>
            <div className={styles.userName}>{tutorProfile?.name || 'Tutor'}</div>
            <div className={styles.userRole}>Tutor</div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className={styles.mainContent}>
        {activeView === 'messages' && (
          <>
            {/* Messages Header */}
            <div className={styles.messagesHeader}>
              <h1 className={styles.messagesTitle}>Messages</h1>
              <p className={styles.messagesSubtitle}>Connect with your students and manage conversations</p>
            </div>
            {/* Conversations List */}
            <div className={styles.conversationsList}>
              <div className={styles.conversationsSearch}>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className={styles.conversationsSearchInput}
                />
              </div>
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`${styles.conversationItem} ${activeConversation === conversation.id ? styles.activeConversation : ''}`}
                  onClick={() => setActiveConversation(conversation.id)}
                >
                  <div className={styles.conversationAvatar}>
                    <div className={styles.avatarCircle}>
                      {conversation.studentName.split(' ').map(n => n[0]).join('')}
                    </div>
                    {conversation.isOnline && <div className={styles.onlineStatus}></div>}
                  </div>
                  <div className={styles.conversationContent}>
                    <div className={styles.conversationHeader}>
                      <h3 className={styles.studentName}>{conversation.studentName}</h3>
                      <span className={styles.timestamp}>{conversation.timestamp}</span>
                    </div>
                    <p className={styles.lastMessage}>{conversation.lastMessage}</p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <div className={styles.unreadBadge}>{conversation.unreadCount}</div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
        {activeView === 'announcement' && (
          <div className={styles.announcementPage}>
            <div className={styles.sectionCard}>
              <h1 className={styles.sectionTitle}>Add Announcement</h1>
              <p className={styles.announcementSubtitle}>Share important updates with your students</p>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Announcement Title</label>
                <input
                  type="text"
                  placeholder="Enter announcement title..."
                  value={announcementData.title}
                  onChange={(e) => handleAnnouncementUpdate('title', e.target.value)}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  placeholder="Write your announcement details here..."
                  value={announcementData.description}
                  onChange={(e) => handleAnnouncementUpdate('description', e.target.value)}
                  className={styles.formTextarea}
                  rows={8}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Upload Image (Optional)</label>
                <div className={styles.imageUpload}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className={styles.fileInput}
                    id="imageUpload"
                  />
                  <label htmlFor="imageUpload" className={styles.uploadLabel}>
                    <div className={styles.uploadIcon}>📤</div>
                    <div className={styles.uploadText}>
                      <span>Click to upload image</span>
                      <small>PNG, JPG, GIF up to 10MB</small>
                    </div>
                  </label>
                  {uploadedImage && (
                    <div className={styles.uploadPreview}>
                      <img src={uploadedImage} alt="Preview" className={styles.previewImage} />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <button onClick={handlePublishAnnouncement} className={styles.primaryButton}>
                  Publish Announcement
                </button>
                <button onClick={handleSaveAsDraft} className={styles.secondaryButton}>
                  Save as Draft
                </button>
              </div>
            </div>
          </div>
        )}
        {activeView === 'profile' && (
          <div className={styles.profileSettings}>
            <div className={styles.sectionCard}>
              <h1 className={styles.sectionTitle}>Profile Settings</h1>
              <p className={styles.profileSubtitle}>Manage your account information and preferences</p>
              <div className={styles.profilePictureSection}>
                <div className={styles.profileAvatar}>
                  {tutorProfile?.picture ? (
                    <img 
                      src={tutorProfile.picture} 
                      alt="Profile" 
                      className={styles.profileAvatarImg}
                    />
                  ) : (
                    <span className={styles.profileAvatarFallback}>
                      {tutorProfile?.name ? tutorProfile.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'T'}
                    </span>
                  )}
                </div>
                <div className={styles.profileInfo}>
                  <h3 className={styles.profileName}>
                    {userProfile?.Name || tutorProfile?.name || profileData.fullName || 'Tutor Name'}
                  </h3>
                  <p className={styles.profileRole}>
                    {tutorProfile?.email || profileData.email || 'Email'}
                  </p>
                  {tutorProfile?.isVerified && (
                    <span style={{ color: '#4caf50', fontSize: '0.8rem' }}>✓ Verified</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Profile Overview */}
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>Profile Overview</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                  <strong>Subjects:</strong> {tutorProfile?.subjects?.join(', ') || 'Not specified'}
                </div>
                <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                  <strong>Languages:</strong> {tutorProfile?.languages?.join(', ') || 'Not specified'}
                </div>
                <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                  <strong>Location:</strong> {tutorProfile?.location || 'Not specified'}
                </div>
                <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                  <strong>Hourly Rate:</strong> {tutorProfile?.hourlyRate ? `${tutorProfile.hourlyRate} MAD` : 'Not specified'}
                </div>
                <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                  <strong>Teaching Methods:</strong> {tutorProfile?.teachingMethods?.join(', ') || 'Not specified'}
                </div>
                <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                  <strong>Rating:</strong> {tutorProfile?.averageRating ? `${tutorProfile.averageRating}/5 (${tutorProfile.totalReviews} reviews)` : 'No reviews yet'}
                </div>
              </div>
              {tutorProfile?.title && (
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Profile Title:</strong> {tutorProfile.title}
                </div>
              )}
            </div>
            
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>Personal Information</h2>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Full Name</label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => handleProfileUpdate('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileUpdate('email', e.target.value)}
                    placeholder="Enter your mail"
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup + ' ' + styles.fullWidth}>
                  <label className={styles.formLabel}>Phone Number</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                    placeholder="Enter your phone"
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Profile Title</label>
                  <input
                    type="text"
                    value={profileData.title}
                    onChange={e => setProfileData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter your profile title"
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Subjects</label>
                  <select
                    value={profileData.subject || (tutorProfile?.subjects && tutorProfile.subjects[0]) || ''}
                    onChange={e => setProfileData(prev => ({ ...prev, subject: e.target.value }))}
                    className={styles.formInput}
                    aria-label="Select subject"
                  >
                    <option value="">Select a subject</option>
                    {subjectOptions.map(subj => <option key={subj} value={subj}>{subj}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Languages</label>
                  <select
                    value={profileData.language || (tutorProfile?.languages && tutorProfile.languages[0]) || ''}
                    onChange={e => setProfileData(prev => ({ ...prev, language: e.target.value }))}
                    className={styles.formInput}
                    aria-label="Select language"
                  >
                    <option value="">Select a language</option>
                    {languageOptions.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Teaching Methods</label>
                  <select
                    value={profileData.teachingMethod || (tutorProfile?.teachingMethods && tutorProfile.teachingMethods[0]) || ''}
                    onChange={e => setProfileData(prev => ({ ...prev, teachingMethod: e.target.value }))}
                    className={styles.formInput}
                    aria-label="Select teaching method"
                  >
                    <option value="">Select a method</option>
                    {teachingMethodOptions.map(method => <option key={method} value={method}>{method}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Location</label>
                  <select
                    value={String(profileData.location)}
                    onChange={e => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    className={styles.formInput}
                    aria-label="Select location"
                  >
                    <option value="">Select a city</option>
                    {locationOptions.map(city => <option key={city} value={String(city)}>{city}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Hourly Rate (MAD)</label>
                  <input
                    type="number"
                    value={profileData.hourlyRate}
                    onChange={e => setProfileData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                    placeholder="Enter your hourly rate"
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Experience</label>
                  <input
                    type="text"
                    value={profileData.experience}
                    onChange={e => setProfileData(prev => ({ ...prev, experience: e.target.value }))}
                    placeholder="Describe your experience"
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Rating</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={String(profileData.rating)}
                    onChange={e => setProfileData(prev => ({ ...prev, rating: e.target.value }))}
                    placeholder="Enter your rating"
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup + ' ' + styles.fullWidth}>
                  <label className={styles.formLabel}>Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                    className={styles.formTextarea}
                    rows={3}
                    placeholder="Enter your bio"
                  />
                </div>
              </div>
            </div>
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>Change Password</h2>
              <div className={styles.passwordGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Current Password</label>
                  <div className={styles.passwordInput}>
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordUpdate('currentPassword', e.target.value)}
                      placeholder="Enter your passeword"
                      className={styles.formInput}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      className={styles.passwordToggle}
                    >
                      👁
                    </button>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>New Password</label>
                  <div className={styles.passwordInput}>
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordUpdate('newPassword', e.target.value)}
                      placeholder="Enter your full password"
                      className={styles.formInput}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className={styles.passwordToggle}
                    >
                      👁
                    </button>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Confirm Password</label>
                  <div className={styles.passwordInput}>
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordUpdate('confirmPassword', e.target.value)}
                      placeholder="Enter your full password"
                      className={styles.formInput}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className={styles.passwordToggle}
                    >
                      👁
                    </button>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right', marginTop: 24 }}>
                <button onClick={handleSaveProfile} className={styles.primaryButton}>
                  💾 Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Chat Area */}
      {activeView === 'messages' && (
        <div className={styles.chatArea}>
          {activeStudent && (
            <>
              <div className={styles.chatHeader}>
                <div className={styles.chatHeaderContent}>
                  <div className={styles.chatAvatar}>
                    <div className={styles.avatarCircle}>
                      {activeStudent.studentName.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <div className={styles.chatHeaderInfo}>
                    <h2 className={styles.chatStudentName}>{activeStudent.studentName}</h2>
                    <span className={styles.chatStatus}>
                      {activeStudent.isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
                <div className={styles.chatActions}>
                  <button className={styles.actionButton}>⋯</button>
                </div>
              </div>
              <div className={styles.messagesContainer}>
                {activeMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`${styles.messageItem} ${message.isFromTutor ? styles.tutorMessage : styles.studentMessage}`}
                  >
                    <div className={styles.messageContent}>
                      <p className={styles.messageText}>{message.text}</p>
                      <span className={styles.messageTime}>{message.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.messageInput}>
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={styles.messageInputField}
                />
                <button
                  onClick={handleSendMessage}
                  className={styles.sendButton}
                  disabled={!messageInput.trim()}
                >
                  ➤
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}