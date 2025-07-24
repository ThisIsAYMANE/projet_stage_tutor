'use client';

import { useState, useEffect } from 'react';
import styles from '../../styles/TutorDash.module.css';
import { db } from '../../../firebase';
import { doc, getDoc, collection, query, where, getDocs, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';
import { Calendar, Clock, User, BadgeCheck } from "lucide-react";

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

function LessonCard({ lesson, isTutor }) {
  return (
    <div style={{
      border: "1px solid #eee",
      borderRadius: 12,
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      padding: "1.2rem 1.5rem",
      marginBottom: 18,
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      maxWidth: 420
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Calendar style={{ color: "#db2777" }} size={20} />
        <span style={{ fontWeight: 600 }}>{lesson.date}</span>
        <Clock style={{ color: "#db2777" }} size={20} />
        <span style={{ fontWeight: 600 }}>{lesson.time}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <User style={{ color: "#2563eb" }} size={18} />
        <span>
          {isTutor ? (
            <>Student: <b>{lesson.studentName}</b></>
          ) : (
            <>Tutor: <b>{lesson.tutorName}</b></>
          )}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <BadgeCheck style={{ color: lesson.status === "booked" ? "#22c55e" : "#f87171" }} size={18} />
        <span style={{
          color: lesson.status === "booked" ? "#22c55e" : "#f87171",
          fontWeight: 600,
          background: lesson.status === "booked" ? "#dcfce7" : "#fee2e2",
          borderRadius: 8,
          padding: "2px 10px"
        }}>
          {lesson.status.charAt(0).toUpperCase() + lesson.status.slice(1)}
        </span>
      </div>
      {lesson.message && (
        <div style={{
          background: "#f3f4f6",
          borderRadius: 8,
          padding: "8px 12px",
          marginTop: 6,
          fontSize: 14,
          color: "#555"
        }}>
          <b>Message:</b> {lesson.message}
        </div>
      )}
    </div>
  );
}

export default function StudentDashboard() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'messages';
  const [activeView, setActiveView] = useState<'messages' | 'profile' | 'lessons'>(initialTab as any);
  const [activeConversation, setActiveConversation] = useState<string>('');
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Student profile data (mock for now)
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [userProfile, setUserProfile] = useState<{ Name?: string, email?: string, phone?: string, profilePicture?: string } | null>(null);

  // Real conversations and messages
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [resolvedTutorName, setResolvedTutorName] = useState<string | null>(null);
  const [resolvedTutorNames, setResolvedTutorNames] = useState<{ [emailOrId: string]: string }>({});

  // Lessons data
  const [lessons, setLessons] = useState<any[]>([]);

  // Fetch student profile and conversations on mount
  useEffect(() => {
    const fetchStudentProfileAndConversations = async () => {
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
            phone: data.phone || '',
            bio: '',
            picture: data.profilePicture || '',
            createdAt: data.createdAt ? (typeof data.createdAt === 'string' ? data.createdAt : data.createdAt.toDate().toLocaleDateString()) : '',
          });
        } else {
          setError('Student profile not found.');
        }
        // Fetch conversations for this student
        const convQuery = query(
          collection(db, 'conversations'),
          where('participants', 'array-contains', user.email),
          orderBy('lastMessageTimestamp', 'desc')
        );
        const convSnap = await getDocs(convQuery);
        const convs: Conversation[] = [];
        const nameResolutions: { [emailOrId: string]: string } = {};
        for (const docSnap of convSnap.docs) {
          const data = docSnap.data();
          // Find the tutor's email/ID (the other participant)
          const tutorEmailOrId = (data.participants || []).find((p: string) => p !== user.email);
          let tutorName = data.tutorName || tutorEmailOrId || 'Tutor';
          // If tutorName looks like an email, try to resolve real name
          if (tutorName && tutorName.includes('@')) {
            if (resolvedTutorNames[tutorEmailOrId]) {
              tutorName = resolvedTutorNames[tutorEmailOrId];
            } else {
              try {
                const tutorDocRef = doc(db, 'users', tutorEmailOrId.replace(/[^a-zA-Z0-9]/g, ''));
                const tutorDocSnap = await getDoc(tutorDocRef);
                if (tutorDocSnap.exists()) {
                  const tData = tutorDocSnap.data();
                  tutorName = tData.Name || tData.name || tutorName;
                  nameResolutions[tutorEmailOrId] = tutorName;
                }
              } catch {}
            }
          }
          convs.push({
            id: docSnap.id,
            tutorName,
            lastMessage: data.lastMessage || '',
            timestamp: data.lastMessageTimestamp ? (typeof data.lastMessageTimestamp === 'string' ? data.lastMessageTimestamp : data.lastMessageTimestamp.toDate().toLocaleTimeString()) : '',
            isOnline: false, // You can implement online status if you track it
            unreadCount: data.unreadCount && data.unreadCount[userId] ? data.unreadCount[userId] : 0
          });
        }
        if (Object.keys(nameResolutions).length > 0) {
          setResolvedTutorNames(prev => ({ ...prev, ...nameResolutions }));
        }
        setConversations(convs);
        // Set first conversation as active by default
        if (convs.length > 0) {
          setActiveConversation(convs[0].id);
        }
      } catch (err) {
        console.error('Error fetching student profile or conversations:', err);
        setError('Failed to load profile or conversations. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchStudentProfileAndConversations();
  }, []);

  // Fetch messages for the active conversation
  useEffect(() => {
    if (!activeConversation) return;
    setMessages([]);
    setLoading(true);
    const unsub = onSnapshot(
      collection(db, 'conversations', activeConversation, 'messages'),
      (querySnapshot) => {
        const msgs: Message[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          msgs.push({
            id: docSnap.id,
            text: data.text,
            timestamp: data.timestamp ? (typeof data.timestamp === 'string' ? data.timestamp : data.timestamp.toDate().toLocaleTimeString()) : '',
            isFromStudent: data.senderRole === 'student',
          });
        });
        setMessages(msgs.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1)));
        setLoading(false);
      },
      (err) => {
        setError('Failed to load messages.');
        setLoading(false);
      }
    );
    return () => unsub();
  }, [activeConversation]);

  // Fetch lessons when the 'lessons' view is active
  useEffect(() => {
    if (activeView === 'lessons') {
      const fetchLessons = async () => {
        const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        if (!userStr) return;
        const user = JSON.parse(userStr);
        const q = query(collection(db, 'lessons'), where('studentId', '==', user.id || user.email));
        const snapshot = await getDocs(q);
        const lessonsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLessons(lessonsData);
      };
      fetchLessons();
    }
  }, [activeView]);

  const handleSendMessage = async () => {
    if (messageInput.trim() && activeConversation) {
      try {
        const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        if (!userStr) return;
        const user = JSON.parse(userStr);
        // Add message to Firestore
        await addDoc(
          collection(db, 'conversations', activeConversation, 'messages'),
          {
            text: messageInput.trim(),
            timestamp: serverTimestamp(),
            senderRole: 'student',
            senderEmail: user.email,
          }
        );
        // Update lastMessage and lastMessageTimestamp in conversation doc
        await updateDoc(doc(db, 'conversations', activeConversation), {
          lastMessage: messageInput.trim(),
          lastMessageTimestamp: serverTimestamp(),
        });
        setMessageInput('');
      } catch (err) {
        // Optionally handle error
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const activeTutor = conversations.find((c) => c.id === activeConversation);
  const activeMessages = messages;

  // Move this useEffect up, before any return
  useEffect(() => {
    // If the active tutor's name looks like an email, fetch the real name from Firestore
    const fetchTutorName = async () => {
      if (!activeTutor) {
        setResolvedTutorName(null);
        return;
      }
      const name = activeTutor.tutorName;
      if (name && name.includes('@')) {
        // Try to fetch from users collection
        try {
          const userDocRef = doc(db, 'users', name.replace(/[^a-zA-Z0-9]/g, ''));
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            setResolvedTutorName(data.Name || data.name || name);
            return;
          }
        } catch {}
      }
      setResolvedTutorName(name);
    };
    fetchTutorName();
  }, [activeTutor]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div>Loading your profile...</div>
        </div>
      </div>
    );
  }

  // Only show error if there was a real fetch error, not just no conversations
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
            <div className={styles.dropdownItem} onClick={() => { setActiveView('lessons'); setMenuOpen(false); }}>Lessons</div>
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
          <div className={styles.navItem + ' ' + (activeView === 'lessons' ? styles.active : '')} onClick={() => setActiveView('lessons')}>
            <span className={styles.navIcon}>📅</span>
            Lessons
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
              {conversations.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                  No conversations yet. Start a new chat!
                </div>
              ) : (
                conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`${styles.conversationItem} ${activeConversation === conversation.id ? styles.activeConversation : ''}`}
                    onClick={() => setActiveConversation(conversation.id)}
                  >
                    <div className={styles.conversationAvatar}>
                      <div className={styles.avatarCircle}>
                        {conversation.tutorName.split(' ').map((n: string) => n[0]).join('')}
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
                ))
              )}
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
        {activeView === 'lessons' && (
          <div className={styles.lessonsView}>
            <h1 className={styles.sectionTitle}>Your Lessons</h1>
            <h2>Upcoming Lessons</h2>
            {lessons.filter(l => new Date(l.date) >= new Date()).length === 0 ? <p>No upcoming lessons.</p> :
              lessons.filter(l => new Date(l.date) >= new Date()).map(l => (
                <LessonCard key={l.id} lesson={l} isTutor={false} />
              ))}
            <h2>Past Lessons</h2>
            {lessons.filter(l => new Date(l.date) < new Date()).length === 0 ? <p>No past lessons.</p> :
              lessons.filter(l => new Date(l.date) < new Date()).map(l => (
                <LessonCard key={l.id} lesson={l} isTutor={false} />
              ))}
          </div>
        )}
      </div>
      {/* Chat Area */}
      {activeView === 'messages' && (
        <div className={styles.chatArea}>
          {activeTutor ? (
            <>
              <div className={styles.chatHeader}>
                <div className={styles.chatHeaderContent}>
                  <div className={styles.chatAvatar}>
                    <div className={styles.avatarCircle}>
                      {activeTutor && activeTutor.tutorName.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                  </div>
                  <div className={styles.chatHeaderInfo}>
                    <h2 className={styles.chatStudentName}>{resolvedTutorName || (activeTutor ? activeTutor.tutorName : '')}</h2>
                    <span className={styles.chatStatus}>
                      {activeTutor && activeTutor.isOnline ? 'Online' : 'Offline'}
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
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
              Select a conversation or start a new chat to begin messaging.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
