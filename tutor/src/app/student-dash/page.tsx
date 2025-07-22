'use client';

import { useState, useEffect } from 'react';
import styles from '../../styles/TutorDash.module.css';
import { db } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isFromStudent: boolean;
}

interface Conversation {
  id: string;
  tutorName: string;
  lastMessage: string;
  timestamp: string;
  isOnline: boolean;
  unreadCount: number;
}

interface StudentProfile {
  Name: string;
  email: string;
  phone: string;
  bio: string;
  picture: string;
  createdAt: string;
}

export default function StudentDashboard() {
  const [activeView, setActiveView] = useState<'messages' | 'profile'>('messages');
  const [activeConversation, setActiveConversation] = useState<string>('alex');
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Student profile data (mock for now)
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [userProfile, setUserProfile] = useState<{ Name?: string, email?: string, phone?: string, profilePicture?: string } | null>(null);

  // Mock conversations and messages
  const conversations: Conversation[] = [
    {
      id: 'alex',
      tutorName: 'Alex Smith',
      lastMessage: 'See you at 5pm for the session!',
      timestamp: '5m ago',
      isOnline: true,
      unreadCount: 1
    },
    {
      id: 'linda',
      tutorName: 'Linda Brown',
      lastMessage: 'Don’t forget to review chapter 3.',
      timestamp: '2h ago',
      isOnline: false,
      unreadCount: 0
    }
  ];

  const messages: Record<string, Message[]> = {
    alex: [
      {
        id: '1',
        text: 'Hi Alex! Looking forward to our session.',
        timestamp: '10:00 AM',
        isFromStudent: true
      },
      {
        id: '2',
        text: 'Me too! See you at 5pm.',
        timestamp: '10:01 AM',
        isFromStudent: false
      }
    ],
    linda: [
      {
        id: '1',
        text: 'Don’t forget to review chapter 3.',
        timestamp: '8:00 AM',
        isFromStudent: false
      }
    ]
  };

  const activeTutor = conversations.find(c => c.id === activeConversation);
  const activeMessages = messages[activeConversation] || [];

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        setLoading(true);
        setError(null);
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
        // Generate userId as in registration
        const userId = user.email.replace(/[^a-zA-Z0-9]/g, '');
        // Fetch main user doc for Name, email, phone, profilePicture
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserProfile(userDocSnap.data());
        }
        // Fetch student profile from Firestore (main user doc)
        const profileRef = doc(db, 'users', userId);
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          const data = profileSnap.data();
          setStudentProfile({
            Name: data.Name || '',
            email: data.email || '',
            phone: data.phone || '', // If phone is not present, fallback to empty string
            bio: '', // No bio in your structure, leave empty or add if you want
            picture: data.profilePicture || '',
            createdAt: data.createdAt ? (typeof data.createdAt === 'string' ? data.createdAt : data.createdAt.toDate().toLocaleDateString()) : '',
          });
        } else {
          setError('Student profile not found.');
        }
      } catch (err) {
        console.error('Error fetching student profile:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchStudentProfile();
  }, []);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Here you would typically send the message to your backend
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
            <div className={styles.dropdownItem} onClick={() => { setActiveView('profile'); setMenuOpen(false); }}>Profile</div>
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
        <nav className={styles.nav}>
          <div 
            className={styles.navItem + ' ' + (activeView === 'messages' ? styles.active : '')}
            onClick={() => setActiveView('messages')}
          >
            <span className={styles.navIcon}>💬</span>
            Messages
          </div>
          <div 
            className={styles.navItem + ' ' + (activeView === 'profile' ? styles.active : '')}
            onClick={() => setActiveView('profile')}
          >
            <span className={styles.navIcon}>👤</span>
            Profile
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
            {studentProfile?.picture ? (
              <img 
                src={studentProfile.picture} 
                alt="Profile" 
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {studentProfile?.Name ? studentProfile.Name.split(' ').map((n: string) => n[0]).join('') : 'S'}
              </div>
            )}
          </div>
          <div className={styles.userDetails}>
            <div className={styles.userName}>{studentProfile?.Name || 'Student'}</div>
            <div className={styles.userRole}>Student</div>
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
              <p className={styles.messagesSubtitle}>Chat with your tutors</p>
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
                      {conversation.tutorName.split(' ').map(n => n[0]).join('')}
                    </div>
                    {conversation.isOnline && <div className={styles.onlineStatus}></div>}
                  </div>
                  <div className={styles.conversationContent}>
                    <div className={styles.conversationHeader}>
                      <h3 className={styles.studentName}>{conversation.tutorName}</h3>
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
        {activeView === 'profile' && (
          <div className={styles.profileSettings}>
            <div className={styles.sectionCard}>
              <h1 className={styles.sectionTitle}>Profile</h1>
              <p className={styles.profileSubtitle}>Your account information</p>
              <div className={styles.profilePictureSection}>
                <div className={styles.profileAvatar}>
                  {studentProfile?.picture ? (
                    <img 
                      src={studentProfile.picture} 
                      alt="Profile" 
                      className={styles.profileAvatarImg}
                    />
                  ) : (
                    <span className={styles.profileAvatarFallback}>
                      {studentProfile?.Name ? studentProfile.Name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'S'}
                    </span>
                  )}
                </div>
                <div className={styles.profileInfo}>
                  <h3 className={styles.profileName}>{userProfile?.Name || studentProfile?.Name || 'Student Name'}</h3>
                  <p className={styles.profileRole}>{userProfile?.email || studentProfile?.email || 'Email'}</p>
                  {userProfile?.phone && <p className={styles.profileRole}>{userProfile.phone}</p>}
                </div>
              </div>
            </div>
            {/* Profile Overview */}
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>Profile Overview</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                  <strong>Email:</strong> {studentProfile?.email}
                </div>
               
                <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                  <strong>Joined:</strong> {studentProfile?.createdAt}
                </div>
              </div>
              
            </div>
          </div>
        )}
      </div>
      {/* Chat Area */}
      {activeView === 'messages' && (
        <div className={styles.chatArea}>
          {activeTutor && (
            <>
              <div className={styles.chatHeader}>
                <div className={styles.chatHeaderContent}>
                  <div className={styles.chatAvatar}>
                    <div className={styles.avatarCircle}>
                      {activeTutor.tutorName.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <div className={styles.chatHeaderInfo}>
                    <h2 className={styles.chatStudentName}>{activeTutor.tutorName}</h2>
                    <span className={styles.chatStatus}>
                      {activeTutor.isOnline ? 'Online' : 'Offline'}
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
                    className={`${styles.messageItem} ${message.isFromStudent ? styles.tutorMessage : styles.studentMessage}`}
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
