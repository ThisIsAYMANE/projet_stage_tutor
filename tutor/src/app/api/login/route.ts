import { NextRequest, NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
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
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // First, try to find user in the users collection
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    let userData = null;
    let userDoc = null;
    let tutorProfileData = null;

    if (!querySnapshot.empty) {
      // User found (student or tutor)
      userDoc = querySnapshot.docs[0];
      userData = userDoc.data();
    }

    if (!userData) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password from main user doc
    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // If tutor, fetch tutorProfile/profile and merge
    let mergedUser = { ...userData };
    if (userData.userType === 'tutor') {
      if (!userDoc) {
        return NextResponse.json(
          { error: "User document not found." },
          { status: 500 }
        );
      }
      const userId = userDoc.id;
      const tutorProfileRef = doc(db, 'users', userId, 'tutorProfile', 'profile');
      const tutorProfileSnap = await getDoc(tutorProfileRef);
      if (tutorProfileSnap.exists()) {
        tutorProfileData = tutorProfileSnap.data();
        mergedUser = { ...mergedUser, ...tutorProfileData };
      }
    }

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = mergedUser;

    if (!userDoc) {
      return NextResponse.json(
        { error: "User document not found." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: userDoc.id,
        ...userWithoutPassword
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 