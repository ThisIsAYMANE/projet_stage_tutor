import React, { useState } from "react";
import Link from "next/link";
import { Star, Users, Globe, Heart, Video } from "lucide-react";
import styles from "../styles/SearchPage.module.css";

interface DetailedTutorCardProps {
  tutor: any;
}

const DetailedTutorCard: React.FC<DetailedTutorCardProps> = ({ tutor }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const name = tutor.Name || tutor.name || "Unknown Tutor";
  const subjects = (tutor.subjects && tutor.subjects.join(", ")) || "";
  const languages = (tutor.languages && tutor.languages.join(", ")) || "";
  const bio = tutor.bio || tutor.description || "No bio provided.";
  const rating = tutor.averageRating || tutor.rating || 0;
  const reviews = tutor.totalReviews || tutor.reviews || 0;
  const price = Number(tutor.hourlyRate) || 0;
  const activeStudents = tutor.activeStudents || 0;
  const totalLessons = tutor.totalLessons || 0;

  return (
    <div className={styles.tutorCard}>
      <div className={styles.tutorCardContent}>
        {/* Header: Name and Favorite */}
        <div className={styles.tutorHeaderRow}>
          <Link href={`/tutor/${tutor.id}`} className={styles.tutorNameLink}>
            <h3 className={styles.tutorName}>{name}</h3>
          </Link>
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className={`${styles.favoriteButton} ${isFavorited ? styles.favorited : ""}`}
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className="w-5 h-5" />
          </button>
        </div>
        {/* Subjects */}
        <div className={styles.tutorSubjects}>{subjects}</div>
        {/* Stats Row */}
        <div className={styles.tutorStatsRow}>
          <div className={styles.tutorStatsLeft}>
            <div className={styles.tutorSubject}>
              <Globe className="w-4 h-4" />
              <span>{subjects}</span>
            </div>
            <div className={styles.tutorStats}>
              <div className={styles.statItem}>
                <Users className="w-4 h-4" />
                <span>
                  {activeStudents} active students • {totalLessons} lessons
                </span>
              </div>
            </div>
            <div className={styles.tutorLanguages}>
              <span>Speaks {languages || <span className={styles.textGray}>N/A</span>}</span>
            </div>
          </div>
          <div className={styles.tutorStatsCenter}>
            <div className={styles.tutorRatingRow}>
              <Star className={styles.starIcon} />
              <span className={styles.ratingNumber}>{rating}</span>
            </div>
            <div className={styles.reviewCount}>{reviews} reviews</div>
            <div className={styles.tutorPrice}>
              <span className={styles.priceAmount}>MAD{price}</span>
              <span className={styles.priceUnit}>per lesson</span>
            </div>
          </div>
        </div>
        {/* Bio */}
        <div className={styles.tutorBio} style={{ fontStyle: bio === "No bio provided." ? "italic" : "normal" }}>{bio}</div>
        {/* View Profile Button */}
        <Link href={`/tutor/${tutor.id}`} className={styles.sendMessageButton}>
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default DetailedTutorCard; 