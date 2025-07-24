import React from "react";
import Link from "next/link";
import styles from "../styles/LandingPage.module.css";
interface TutorCardProps {
  tutor: any;
}

const TutorCard: React.FC<TutorCardProps> = ({ tutor }) => {
  // Fallbacks for missing data
  const name = tutor.Name || tutor.name || "Unknown Tutor";
  const subjects = tutor.subjects || [];
  const bio = tutor.bio || "";
  const hourlyRate = tutor.hourlyRate ? `${tutor.hourlyRate}MAD/hr` : "N/A";
  const rating = tutor.averageRating || tutor.rating || 0;
  const totalReviews = tutor.totalReviews || 0;
  const profilePicture = tutor.profilePicture || tutor.profilePic || "/public/assets/images/haha.jpg";
  const id = tutor.id;

  // Debug log
  console.log('TutorCard tutor:', tutor);
  if (!id) {
    console.warn('TutorCard: tutor is missing id:', tutor);
  }

  return (
    <div style={{
      background: "#fff",
      borderRadius: "24px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
      padding: "2rem 1.5rem 1.5rem 1.5rem",
      width: "320px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      margin: "0.5rem"
    }}>
      <div style={{ marginBottom: "1.5rem" }}>
        {/* Remove the <img ... /> or any profile picture rendering from the TutorCard component. */}
      </div>
      <h2 style={{ fontSize: "1.35rem", fontWeight: 700, textAlign: "center", margin: 0 }}>{name}</h2>
      <div style={{ display: "flex", gap: "0.5rem", margin: "0.75rem 0" }}>
        {subjects.map((subj: string) => (
          <span key={subj} style={{
            background: "#f1f5f9",
            color: "#64748b",
            borderRadius: "12px",
            padding: "0.25rem 0.75rem",
            fontSize: "0.95rem",
            fontWeight: 600
          }}>{subj}</span>
        ))}
      </div>
      <div style={{ color: "#64748b", fontSize: "1rem", textAlign: "center", minHeight: "48px", marginBottom: "0.75rem" }}>{bio}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.5rem", marginBottom: "1.25rem" }}>
        <span style={{ color: "#fbbf24", fontWeight: 600, fontSize: "1.1rem" }}>
          <span style={{ marginRight: "0.25rem" }}>★</span>{rating} <span style={{ color: "#64748b", fontWeight: 400, fontSize: "0.95rem" }}>({totalReviews})</span>
        </span>
        <span style={{ color: "#e11d48", fontWeight: 700, fontSize: "1.1rem" }}>{hourlyRate}</span>
      </div>
      {id ? (
        <Link href={`/profile?id=${id}`} style={{ width: "100%", textDecoration: "none" }}>
          <button className={styles.viewProfile} style={{
            width: "100%",
            background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "14px",
            padding: "0.9rem 0",
            fontWeight: 700,
            fontSize: "1.1rem",
            cursor: "pointer",
            marginTop: "0.5rem"
          }}>
            View Profile
          </button>
        </Link>
      ) : (
        <button className={styles.viewProfile} style={{
          width: "100%",
          background: "#e5e7eb",
          color: "#aaa",
          border: "none",
          borderRadius: "14px",
          padding: "0.9rem 0",
          fontWeight: 700,
          fontSize: "1.1rem",
          cursor: "not-allowed",
          marginTop: "0.5rem"
        }} title="No profile available">
          No Profile Available
        </button>
      )}
    </div>
  );
};

export default TutorCard; 