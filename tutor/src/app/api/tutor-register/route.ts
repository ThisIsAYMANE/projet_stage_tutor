import { NextRequest, NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import * as bcrypt from 'bcryptjs';

// Initialize Firebase client SDK
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('Tutor registration received data:', data);
    
    // For demo: generate userId from email (replace with real Auth userId in production)
    const userId = data.email.replace(/[^a-zA-Z0-9]/g, '');
    console.log('Generated userId:', userId);
    
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(data.password, 10);
    console.log('Password hashed successfully');
    
    const tutorProfileRef = doc(db, 'users', userId, 'tutorProfile', 'profile');
    console.log('About to save to Firestore path:', `users/${userId}/tutorProfile/profile`);
    
    const profileData = {
      ...data,
      password: hashedPassword, // Save hashed password instead of plain text
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    console.log('Saving profile data:', profileData);
    
    await setDoc(tutorProfileRef, profileData);
    console.log('Profile saved successfully to Firestore');
    
    return NextResponse.json({ success: true, userId });
  } catch (error: any) {
    console.error('Tutor registration error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 