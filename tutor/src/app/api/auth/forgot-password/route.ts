import { NextRequest, NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import * as crypto from 'crypto';
import { Resend } from 'resend';

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

// Initialize Resend
const resend = new Resend('re_NsHWci46_Pxnkd7m1VdmW1BuVYLPaHwCw');

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find user by email
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: "No account found with this email address" },
        { status: 404 }
      );
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Update user document with reset token
    await updateDoc(doc(db, "users", userDoc.id), {
      resetToken,
      resetTokenExpiry,
      updatedAt: new Date()
    });

    // Create reset link
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}&email=${email}`;

    // Send email with reset link
    try {
      console.log('Attempting to send email to:', email);
      console.log('Reset link:', resetLink);
      
      // For testing: use verified email if different from user email
      const verifiedEmail = 'maaliaymane24@gmail.com'; // Your verified Resend email
      const emailToSend = email === verifiedEmail ? email : verifiedEmail;
      
      if (email !== verifiedEmail) {
        console.log(`Sending to verified email ${verifiedEmail} instead of ${email} for testing`);
      }
      
      const emailResult = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: [emailToSend],
        subject: 'Reset Your StudyFinder Password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Reset Your Password</h2>
            <p>Hello ${userData.Name},</p>
            <p>We received a request to reset your password for your StudyFinder account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background-color: #999999; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #666;">${resetLink}</p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this password reset, please ignore this email.</p>
            <p>Best regards,<br>The StudyFinder Team</p>
          </div>
        `
      });

      console.log('Email sent successfully:', emailResult);

      return NextResponse.json({
        message: "Password reset email sent successfully",
        resetLink: resetLink,
        user: {
          id: userDoc.id,
          email: userData.email,
          Name: userData.Name
        }
      });

    } catch (emailError) {
      console.error("Email sending error details:", emailError);
      console.error("API Key present:", !!process.env.RESEND_API_KEY);
      console.error("API Key length:", process.env.RESEND_API_KEY?.length);
      
      return NextResponse.json(
        { error: `Failed to send reset email: ${emailError.message}` },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 