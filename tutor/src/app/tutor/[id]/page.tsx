"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";
import { BookOpen, Video, ArrowLeft } from "lucide-react";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function Header() {
  return (
    <header style={{ background: "#fff", borderBottom: "1px solid #f3f4f6", padding: "1.2rem 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <span style={{ fontWeight: 800, fontSize: 28, color: "#ff6b6b", letterSpacing: 1 }}>StudyFinder</span>
        </Link>
        <nav style={{ display: "flex", gap: 32 }}>
          <Link href="/search" style={{ color: "#111827", fontWeight: 600, textDecoration: "none" }}>Find tutors</Link>
          <Link href="/#become-tutor" style={{ color: "#111827", fontWeight: 600, textDecoration: "none" }}>Become a tutor</Link>
        </nav>
      </div>
    </header>
  );
}

export default function TutorProfile() {
  const { id } = useParams();
  const router = useRouter();
  const [tutor, setTutor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchTutor() {
      setLoading(true);
      const docRef = doc(db, "users", id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTutor({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    }
    if (id) fetchTutor();
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) setUser(JSON.parse(userStr));
    }
  }, [id]);

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;
  if (!tutor) return <div style={{ padding: 40, textAlign: "center" }}>Tutor not found.</div>;

  // Use only FormData fields
  const name = tutor.name || "Unknown Tutor";
  const picture = tutor.picturePreview || tutor.picture || "/public/assets/images/haha.jpg";
  const subjects = tutor.subjects || [];
  const title = tutor.title || "No title provided.";
  const description = tutor.description || "No description provided.";
  const teachingMethods = tutor.teachingMethods || [];
  const languages = tutor.languages || [];
  const hourlyRate = tutor.hourlyRate || "N/A";
  const location = tutor.location || "";
  const phone = tutor.phone || "";

  const handleContact = async () => {
    if (!user) return;
    const dash = user.userType === "tutor" ? "/tutor-dash" : "/student-dash";
    const studentEmail = user.email;
    const tutorEmail = tutor.email || tutor.id; // fallback to id if no email field
    // 1. Check if conversation exists
    const convQuery = query(
      collection(db, "conversations"),
      where("participants", "array-contains", studentEmail)
    );
    const convSnap = await getDocs(convQuery);
    let foundConv = null;
    convSnap.forEach(docSnap => {
      const data = docSnap.data();
      if (data.participants && data.participants.includes(tutorEmail)) {
        foundConv = { id: docSnap.id, ...data };
      }
    });
    if (foundConv) {
      router.push(`${dash}?contactId=${foundConv.id}`);
      return;
    }
    // 2. Always fetch the real tutor name from Firestore
    let realTutorName = tutor.name || null;
    if (!realTutorName) {
      try {
        const tutorDocRef = doc(db, "users", tutorEmail.replace(/[^a-zA-Z0-9]/g, ""));
        const tutorDocSnap = await getDoc(tutorDocRef);
        if (tutorDocSnap.exists()) {
          const tData = tutorDocSnap.data();
          realTutorName = tData.Name || tData.name || tutorEmail;
        } else {
          realTutorName = tutorEmail;
        }
      } catch {
        realTutorName = tutorEmail;
      }
    }
    // 3. Create new conversation
    const newConv = await addDoc(collection(db, "conversations"), {
      participants: [studentEmail, tutorEmail],
      tutorName: realTutorName,
      lastMessage: "",
      lastMessageTimestamp: serverTimestamp(),
      unreadCount: { [studentEmail.replace(/[^a-zA-Z0-9]/g, "")]: 0, [tutorEmail.replace(/[^a-zA-Z0-9]/g, "")]: 0 }
    });
    router.push(`${dash}?contactId=${newConv.id}`);
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Header />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <Link href="/search" style={{ color: "#ff6b6b", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", marginBottom: 32 }}>
          <ArrowLeft style={{ marginRight: 8 }} /> Back to search
        </Link>
        <div style={{ display: "flex", gap: 48, alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Left Column */}
          <div style={{ flex: 1, minWidth: 340, maxWidth: 650 }}>
            {/* Subject badge */}
            {subjects[0] && (
              <span style={{ background: "#ffe4e6", color: "#fb7185", fontWeight: 700, borderRadius: 16, padding: "0.3rem 1.1rem", fontSize: 15, marginBottom: 18, display: "inline-block" }}>{subjects[0]}</span>
            )}
            {/* Title */}
            <h1 style={{ fontWeight: 800, fontSize: 38, color: "#111827", margin: "1.2rem 0 1.5rem 0", lineHeight: 1.15 }}>{title}</h1>
            {/* Lesson location */}
            <div style={{ margin: "1.5rem 0 1.2rem 0" }}>
              <div style={{ fontWeight: 700, fontSize: 20, color: "#111827", marginBottom: 8 }}>Lesson location</div>
              {teachingMethods.length > 0 ? teachingMethods.map((method: string) => (
                <span key={method} style={{ display: "inline-flex", alignItems: "center", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 999, padding: "0.5rem 1.2rem", fontWeight: 600, color: "#111827", fontSize: 16, marginRight: 12, marginBottom: 8 }}>
                  <Video style={{ marginRight: 8, color: "#ff6b6b" }} />
                  {method.charAt(0).toUpperCase() + method.slice(1)}
                </span>
              )) : <span style={{ color: "#64748b" }}>Not specified</span>}
            </div>
            {/* About section */}
            <div style={{ margin: "2.2rem 0 1.2rem 0" }}>
              <div style={{ fontWeight: 700, fontSize: 20, color: "#111827", marginBottom: 8 }}>About {name.split(" ")[0]}</div>
              <div style={{ color: "#111827", fontSize: 18, lineHeight: 1.6 }}>{description}</div>
            </div>
            {/* About the lesson section */}
            <div style={{ margin: "2.2rem 0 1.2rem 0" }}>
              <div style={{ fontWeight: 700, fontSize: 20, color: "#111827", marginBottom: 8 }}>About the lesson</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <span style={{ background: "#f3f4f6", color: "#111827", borderRadius: 999, padding: "0.5rem 1.2rem", fontWeight: 600, fontSize: 16 }}>All Levels</span>
                {languages.map((lang: string) => (
                  <span key={lang} style={{ background: "#f3f4f6", color: "#111827", borderRadius: 999, padding: "0.5rem 1.2rem", fontWeight: 600, fontSize: 16 }}>{lang}</span>
                ))}
              </div>
            </div>
            {/* Location and phone */}
            <div style={{ margin: "2.2rem 0 1.2rem 0" }}>
              <div style={{ fontWeight: 700, fontSize: 20, color: "#111827", marginBottom: 8 }}>Contact & Location</div>
              <div style={{ color: "#111827", fontSize: 17, marginBottom: 6 }}>Location: {location || <span style={{ color: "#64748b" }}>Not specified</span>}</div>
              <div style={{ color: "#111827", fontSize: 17 }}>Phone: {phone || <span style={{ color: "#64748b" }}>Not specified</span>}</div>
            </div>
          </div>
          {/* Right Column - Card */}
          <div style={{ minWidth: 320, maxWidth: 350, background: "#fff", borderRadius: 32, boxShadow: "0 4px 32px rgba(255,107,107,0.08)", padding: "2.2rem 2rem 2rem 2rem", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
            <img
              src={picture}
              alt={name}
              style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", marginBottom: 18, border: "4px solid #f8fafc", background: "#fff" }}
            />
            <div style={{ fontWeight: 800, fontSize: 26, color: "#111827", marginBottom: 8 }}>{name}</div>
            <div style={{ color: "#64748b", fontWeight: 600, fontSize: 16, marginBottom: 18 }}>{subjects[0]}</div>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: 12 }}>
              <div style={{ color: "#64748b", fontWeight: 600, fontSize: 16 }}>Hourly rate</div>
              <div style={{ color: "#111827", fontWeight: 700, fontSize: 18 }}>MAD{hourlyRate}</div>
            </div>
            <button onClick={handleContact} style={{ width: "100%", background: "#ff6b6b", color: "#fff", border: "none", borderRadius: 16, padding: "1rem 0", fontWeight: 700, fontSize: 20, marginBottom: 10, cursor: "pointer", boxShadow: "0 2px 8px rgba(255,107,107,0.10)" }}>
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 3v4M8 3v4" /></svg>
                Contact
              </span>
            </button>
            <div style={{ color: "#fb7185", fontWeight: 700, fontSize: 15, marginTop: 2 }}>1<sup>st</sup> lesson free</div>
          </div>
        </div>
      </div>
    </div>
  );
} 