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
    // For demo: generate userId from email (replace with real Auth userId in production)
    const userId = data.email.replace(/[^a-zA-Z0-9]/g, '');

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Main user fields
    const userDocData = {
      email: data.email,
      password: hashedPassword,
      Name: data.Name || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      profilePicture: data.profilePicture || '',
      userType: 'tutor', // Always set to 'tutor' for tutor registration
      isTutor: true,
    };
    await setDoc(doc(db, 'users', userId), userDocData);

    // Tutor-specific fields (do not include password/email)
    const tutorProfileData = {
      bio: data.bio || '',
      hourlyRate: data.hourlyRate || 0,
      experience: data.experience || '',
      isVerified: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isAvailable: true,
      averageRating: 0,
      totalReviews: 0,
    };
    await setDoc(doc(db, 'users', userId, 'tutorProfile', 'profile'), tutorProfileData);

    return NextResponse.json({ success: true, userId });
  } catch (error: any) {
    console.error('Tutor registration error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 