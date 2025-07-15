'use client';

import { useState } from 'react';
import styles from '../../styles/TutorDash.module.css';

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

export default function TutorDashboard() {
  const [activeView, setActiveView] = useState<'messages' | 'announcement' | 'profile'>('messages');
  const [activeConversation, setActiveConversation] = useState<string>('sarah');
  const [messageInput, setMessageInput] = useState('');

  // Profile form states
  const [profileData, setProfileData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@tutorconnect.com',
    phone: '+1 (555) 123-4567',
    bio: 'Experienced mathematics tutor with 5+ years of teaching experience. Specializing in algebra, calculus, and statistics.'
  });
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
  const handleSaveProfile = () => {
    // Save profile logic
  };
  const handlePublishAnnouncement = () => {
    // Publish announcement logic
  };
  const handleSaveAsDraft = () => {
    // Save as draft logic
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>TC</div>
            <span className={styles.logoText}>TutorConnect</span>
          </div>
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
          <div className={styles.navItem}>
            <span className={styles.navIcon}>↗</span>
            Logout
          </div>
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            <div className={styles.onlineIndicator}></div>
          </div>
          <div className={styles.userDetails}>
            <div className={styles.userName}>John Doe</div>
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
                <div className={styles.profilePicture}>
                  <div className={styles.profileAvatar}>
                    JD
                    <div className={styles.cameraIcon}>📷</div>
                  </div>
                </div>
                <div className={styles.profileInfo}>
                  <h3 className={styles.profileName}>John Doe</h3>
                  <p className={styles.profileRole}>Tutor</p>
                </div>
              </div>
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