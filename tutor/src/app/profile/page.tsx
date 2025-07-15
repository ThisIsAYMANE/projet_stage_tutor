"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  BookOpen,
  Star,
  Users,
  Video,
  Heart,
  Globe,
  Calendar,
  Clock,
  MessageCircle,
  Play,
  Award,
  MapPin,
  Languages,
  GraduationCap,
  Briefcase,
  ArrowLeft,
  Share2,
  X,
} from "lucide-react"
import styles from "../../styles/TutorProfile.module.css"

// Type definitions
interface Language {
  name: string
  level: string
}

interface Education {
  degree: string
  institution: string
  year: string
}

interface Certification {
  name: string
  issuer: string
  year: string
}

interface WorkExperience {
  position: string
  company: string
  duration: string
  description: string
}

interface Availability {
  timezone: string
  schedule: {
    [key: string]: string[]
  }
}

interface Review {
  id: number
  studentName: string
  studentFlag: string
  rating: number
  date: string
  lessonType: string
  comment: string
  helpful: number
}

interface Tutor {
  id: string
  name: string
  title: string
  flag: string
  nativeFlag: string
  isNative: boolean
  country: string
  city: string
  languages: Language[]
  rating: number
  reviews: Review[]
  activeStudents: number
  totalLessons: number
  responseTime: string
  isOnline: boolean
  lastActive: string
  hourlyRate: number
  trialRate: number
  image: string
  videoUrl: string
  badges: string[]
  specialties: string[]
  subjects: string[]
  teachingStyle: string
  experience: string
  education: Education[]
  certifications: Certification[]
  workExperience: WorkExperience[]
  about: string
  availability: Availability
}

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  tutor: Tutor
  lessonType?: string
}

interface ReviewCardProps {
  review: Review
}

// Mock tutor data - in real app this would come from API
const getTutorData = (id: string): Tutor => ({
  id,
  name: "Sarah Johnson",
  title: "Professional English Teacher & IELTS Expert",
  flag: "🇺🇸",
  nativeFlag: "🇬🇧",
  isNative: true,
  country: "United States",
  city: "New York",
  languages: [
    { name: "English", level: "Native" },
    { name: "Spanish", level: "Fluent" },
    { name: "French", level: "Intermediate" },
    { name: "German", level: "Beginner" },
  ],
  rating: 4.9,
  reviews: [
    {
      id: 1,
      studentName: "Alex M.",
      studentFlag: "🇰🇷",
      rating: 5,
      date: "2024-01-15",
      lessonType: "IELTS Preparation",
      comment:
        "Sarah is an amazing teacher! She helped me improve my IELTS score from 6.5 to 8.0 in just 3 months. Her teaching methods are very effective and she's always patient and encouraging.",
      helpful: 12,
    },
    {
      id: 2,
      studentName: "Maria L.",
      studentFlag: "🇪🇸",
      rating: 5,
      date: "2024-01-10",
      lessonType: "Business English",
      comment:
        "Excellent teacher for business English. Sarah helped me prepare for important presentations and improved my professional communication skills significantly.",
      helpful: 8,
    },
    {
      id: 3,
      studentName: "Chen W.",
      studentFlag: "🇨🇳",
      rating: 5,
      date: "2024-01-05",
      lessonType: "Conversational English",
      comment:
        "Very patient and understanding teacher. Sarah creates a comfortable environment where I feel confident to speak English. Highly recommended!",
      helpful: 15,
    },
  ],
  activeStudents: 89,
  totalLessons: 1847,
  responseTime: "Usually responds in 2 hours",
  isOnline: true,
  lastActive: "Active now",
  hourlyRate: 35,
  trialRate: 15,
  image: "/placeholder.svg?height=200&width=200",
  videoUrl: "/placeholder-video.mp4",
  badges: ["Professional", "Super Tutor", "Top Rated"],
  specialties: [
    "IELTS Preparation",
    "Business English",
    "Conversational English",
    "Grammar",
    "Pronunciation",
    "Academic Writing",
    "Job Interview Prep",
  ],
  subjects: ["English", "IELTS", "TOEFL", "Business English"],
  teachingStyle: "Interactive and personalized approach focusing on practical communication skills",
  experience: "8+ years",
  education: [
    {
      degree: "Master of Arts in TESOL",
      institution: "Columbia University",
      year: "2016",
    },
    {
      degree: "Bachelor of Arts in English Literature",
      institution: "Harvard University",
      year: "2014",
    },
  ],
  certifications: [
    { name: "CELTA", issuer: "Cambridge", year: "2016" },
    { name: "IELTS Examiner", issuer: "British Council", year: "2018" },
    { name: "TESOL", issuer: "TESOL International", year: "2016" },
  ],
  workExperience: [
    {
      position: "Senior English Instructor",
      company: "International Language Institute",
      duration: "2019 - Present",
      description: "Teaching advanced English courses and IELTS preparation",
    },
    {
      position: "Online English Tutor",
      company: "Various Platforms",
      duration: "2016 - Present",
      description: "Providing personalized English lessons to students worldwide",
    },
  ],
  about: `Hello! I'm Sarah, a passionate English teacher with over 8 years of experience helping students achieve their language goals. I specialize in IELTS preparation, business English, and conversational skills.

My teaching philosophy centers around creating a comfortable, supportive environment where students feel confident to practice and make mistakes. I believe that language learning should be engaging, practical, and tailored to each student's unique needs and goals.

I hold a Master's degree in TESOL from Columbia University and am a certified IELTS examiner. I've helped hundreds of students improve their English skills, whether for academic purposes, career advancement, or personal enrichment.

In my lessons, you can expect:
• Personalized curriculum based on your goals
• Interactive activities and real-world practice
• Regular feedback and progress tracking
• Flexible scheduling to fit your lifestyle
• A supportive and encouraging learning environment

I'm excited to help you on your English learning journey!`,
  availability: {
    timezone: "EST (UTC-5)",
    schedule: {
      monday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
      tuesday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
      wednesday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      thursday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
      friday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      saturday: ["10:00", "11:00", "14:00", "15:00"],
      sunday: ["14:00", "15:00", "16:00"],
    },
  },
})

// Header Component
function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.headerFlex}>
          <div className={styles.logoContainer}>
            <Link href="/" className={styles.logoLink}>
              <div className={styles.logoIcon}>
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className={styles.logoText}>TutorConnect</span>
            </Link>
          </div>
          <nav className={styles.nav}>
            <Link href="/search" className={styles.navLink}>
              Find tutors
            </Link>
            <Link href="#" className={styles.navLink}>
              Corporate language training
            </Link>
            <Link href="/#become-tutor" className={styles.navLink}>
              Become a tutor
            </Link>
          </nav>
          <div className={styles.headerActions}>
            <Link href="/login" className={styles.loginButton}>
              Log In
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

// Booking Modal Component
function BookingModal({ isOpen, onClose, tutor, lessonType = "trial" }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [message, setMessage] = useState("")

  if (!isOpen) return null

  const today = new Date()
  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    return date
  })

  const getAvailableSlots = (date: Date): string[] => {
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
    return tutor.availability.schedule[dayName] || []
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.bookingModal}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            Book a {lessonType === "trial" ? "Trial" : "Regular"} Lesson with {tutor.name}
          </h3>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close booking modal">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className={styles.modalContent}>
          <div className={styles.bookingGrid}>
            {/* Date Selection */}
            <div className={styles.bookingSection}>
              <h4 className={styles.sectionTitle}>Select Date</h4>
              <div className={styles.dateGrid}>
                {dates.map((date) => {
                  const dateStr = date.toISOString().split("T")[0]
                  const dayName = date.toLocaleDateString("en-US", { weekday: "short" })
                  const dayNumber = date.getDate()
                  const hasSlots = getAvailableSlots(date).length > 0

                  return (
                    <button
                      key={dateStr}
                      onClick={() => hasSlots && setSelectedDate(dateStr)}
                      disabled={!hasSlots}
                      className={`${styles.dateButton} ${selectedDate === dateStr ? styles.selected : ""} ${
                        !hasSlots ? styles.disabled : ""
                      }`}
                      aria-label={`Select ${dayName} ${dayNumber}`}
                    >
                      <span className={styles.dayName}>{dayName}</span>
                      <span className={styles.dayNumber}>{dayNumber}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Time Selection */}
            <div className={styles.bookingSection}>
              <h4 className={styles.sectionTitle}>Select Time ({tutor.availability.timezone})</h4>
              {selectedDate ? (
                <div className={styles.timeGrid}>
                  {getAvailableSlots(new Date(selectedDate)).map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`${styles.timeButton} ${selectedTime === time ? styles.selected : ""}`}
                      aria-label={`Select time ${time}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              ) : (
                <p className={styles.selectDateFirst}>Please select a date first</p>
              )}
            </div>
          </div>

          {/* Message */}
          <div className={styles.bookingSection}>
            <h4 className={styles.sectionTitle}>Message to {tutor.name} (Optional)</h4>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell your tutor about your goals, current level, or any specific topics you'd like to focus on..."
              className={styles.messageTextarea}
              rows={4}
              aria-label="Message to tutor"
            />
          </div>

          {/* Lesson Summary */}
          {selectedDate && selectedTime && (
            <div className={styles.lessonSummary}>
              <h4 className={styles.sectionTitle}>Lesson Summary</h4>
              <div className={styles.summaryCard}>
                <div className={styles.summaryRow}>
                  <span>Lesson Type:</span>
                  <span>{lessonType === "trial" ? "Trial Lesson" : "Regular Lesson"}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Date & Time:</span>
                  <span>
                    {new Date(selectedDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    at {selectedTime}
                  </span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Duration:</span>
                  <span>50 minutes</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Price:</span>
                  <span className={styles.price}>${lessonType === "trial" ? tutor.trialRate : tutor.hourlyRate}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button
            disabled={!selectedDate || !selectedTime}
            className={`${styles.bookButton} ${!selectedDate || !selectedTime ? styles.disabled : ""}`}
          >
            Book Lesson - ${lessonType === "trial" ? tutor.trialRate : tutor.hourlyRate}
          </button>
        </div>
      </div>
    </div>
  )
}

// Review Component
function ReviewCard({ review }: ReviewCardProps) {
  const [isHelpful, setIsHelpful] = useState(false)

  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewHeader}>
        <div className={styles.reviewerInfo}>
          <div className={styles.reviewerAvatar}>
            <span className={styles.reviewerFlag}>{review.studentFlag}</span>
          </div>
          <div>
            <h4 className={styles.reviewerName}>{review.studentName}</h4>
            <div className={styles.reviewMeta}>
              <div className={styles.reviewRating}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className={`${styles.starIcon} ${i < review.rating ? styles.filled : ""}`} />
                ))}
              </div>
              <span className={styles.reviewDate}>
                {new Date(review.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
        <span className={styles.lessonType}>{review.lessonType}</span>
      </div>

      <p className={styles.reviewComment}>{review.comment}</p>

      <div className={styles.reviewFooter}>
        <button
          onClick={() => setIsHelpful(!isHelpful)}
          className={`${styles.helpfulButton} ${isHelpful ? styles.active : ""}`}
          aria-label={`Mark review as helpful (${review.helpful + (isHelpful ? 1 : 0)} helpful votes)`}
        >
          👍 Helpful ({review.helpful + (isHelpful ? 1 : 0)})
        </button>
      </div>
    </div>
  )
}

// Main Tutor Profile Component
export default function TutorProfile({ params }: { params: { id: string } }) {
  const [tutor] = useState<Tutor>(() => getTutorData(params.id))
  const [activeTab, setActiveTab] = useState("about")
  const [isFavorited, setIsFavorited] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingType, setBookingType] = useState("trial")
  const [showVideoModal, setShowVideoModal] = useState(false)

  const handleBookTrial = () => {
    setBookingType("trial")
    setShowBookingModal(true)
  }

  const handleBookLesson = () => {
    setBookingType("regular")
    setShowBookingModal(true)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${tutor.name} - English Tutor`,
        text: `Check out ${tutor.name}'s profile on TutorConnect`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      // You could show a toast notification here
    }
  }

  return (
    <div className={styles.container}>
      <Header />

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div className={styles.sectionContent}>
          <Link href="/search" className={styles.breadcrumbLink}>
            <ArrowLeft className="w-4 h-4" />
            Back to search
          </Link>
        </div>
      </div>

      {/* Profile Header */}
      <section className={styles.profileHeader}>
        <div className={styles.sectionContent}>
          <div className={styles.profileGrid}>
            {/* Left Side - Profile Info */}
            <div className={styles.profileInfo}>
              <div className={styles.profileImageSection}>
                <div className={styles.profileImageWrapper}>
                  <Image
                    src={tutor.image || "/placeholder.svg"}
                    alt={tutor.name}
                    width={200}
                    height={200}
                    className={styles.profileImage}
                  />
                  {tutor.isOnline && <div className={styles.onlineIndicator}></div>}
                </div>

                {/* Video Preview */}
                <button onClick={() => setShowVideoModal(true)} className={styles.videoPreviewButton} aria-label="Watch introduction video">
                  <Play className="w-6 h-6" />
                  <span>Watch intro video</span>
                </button>
              </div>

              <div className={styles.profileDetails}>
                <div className={styles.profileNameSection}>
                  <h1 className={styles.profileName}>
                    {tutor.name}
                    <span className={styles.countryFlag}>{tutor.flag}</span>
                    {tutor.isNative && <span className={styles.nativeFlag}>{tutor.nativeFlag}</span>}
                  </h1>
                  <p className={styles.profileTitle}>{tutor.title}</p>
                </div>

                <div className={styles.profileBadges}>
                  {tutor.badges.map((badge) => (
                    <span key={badge} className={styles.badge}>
                      <Award className="w-4 h-4" />
                      {badge}
                    </span>
                  ))}
                </div>

                <div className={styles.profileStats}>
                  <div className={styles.statItem}>
                    <div className={styles.statValue}>
                      <Star className={styles.starIcon} />
                      {tutor.rating}
                    </div>
                    <div className={styles.statLabel}>{tutor.reviews.length} reviews</div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statValue}>
                      <Users className="w-5 h-5" />
                      {tutor.activeStudents}
                    </div>
                    <div className={styles.statLabel}>Active students</div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statValue}>
                      <Video className="w-5 h-5" />
                      {tutor.totalLessons}
                    </div>
                    <div className={styles.statLabel}>Lessons taught</div>
                  </div>
                </div>

                <div className={styles.profileMeta}>
                  <div className={styles.metaItem}>
                    <MapPin className="w-4 h-4" />
                    <span>
                      {tutor.city}, {tutor.country}
                    </span>
                  </div>
                  <div className={styles.metaItem}>
                    <Clock className="w-4 h-4" />
                    <span>{tutor.lastActive}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <MessageCircle className="w-4 h-4" />
                    <span>{tutor.responseTime}</span>
                  </div>
                </div>

                <div className={styles.languagesSection}>
                  <h3 className={styles.sectionTitle}>
                    <Languages className="w-5 h-5" />
                    Languages
                  </h3>
                  <div className={styles.languagesList}>
                    {tutor.languages.map((lang) => (
                      <div key={lang.name} className={styles.languageItem}>
                        <span className={styles.languageName}>{lang.name}</span>
                        <span className={styles.languageLevel}>{lang.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Booking Card */}
            <div className={styles.bookingCard}>
              <div className={styles.pricingSection}>
                <div className={styles.priceItem}>
                  <span className={styles.priceLabel}>Trial lesson</span>
                  <span className={styles.priceValue}>${tutor.trialRate}</span>
                </div>
                <div className={styles.priceItem}>
                  <span className={styles.priceLabel}>50-min lesson</span>
                  <span className={styles.priceValue}>${tutor.hourlyRate}</span>
                </div>
              </div>

              <div className={styles.bookingActions}>
                <button onClick={handleBookTrial} className={styles.bookTrialButton} aria-label="Book trial lesson">
                  <Calendar className="w-5 h-5" />
                  Book trial lesson
                </button>
                <button onClick={handleBookLesson} className={styles.bookLessonButton} aria-label="Book regular lesson">
                  Book lesson
                </button>
              </div>

              <div className={styles.quickActions}>
                <button className={styles.messageButton} aria-label="Send message to tutor">
                  <MessageCircle className="w-5 h-5" />
                  Send message
                </button>
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`${styles.favoriteButton} ${isFavorited ? styles.favorited : ""}`}
                  aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart className="w-5 h-5" />
                </button>
                <button onClick={handleShare} className={styles.shareButton} aria-label="Share tutor profile">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className={styles.specialtiesSection}>
                <h3 className={styles.sectionTitle}>Specialties</h3>
                <div className={styles.specialtiesList}>
                  {tutor.specialties.map((specialty) => (
                    <span key={specialty} className={styles.specialtyTag}>
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className={styles.profileContent}>
        <div className={styles.sectionContent}>
          <div className={styles.tabNavigation}>
            <button
              onClick={() => setActiveTab("about")}
              className={`${styles.tabButton} ${activeTab === "about" ? styles.active : ""}`}
              aria-label="About tab"
            >
              About
            </button>
            <button
              onClick={() => setActiveTab("experience")}
              className={`${styles.tabButton} ${activeTab === "experience" ? styles.active : ""}`}
              aria-label="Experience tab"
            >
              Experience
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`${styles.tabButton} ${activeTab === "reviews" ? styles.active : ""}`}
              aria-label={`Reviews tab (${tutor.reviews.length} reviews)`}
            >
              Reviews ({tutor.reviews.length})
            </button>
            <button
              onClick={() => setActiveTab("availability")}
              className={`${styles.tabButton} ${activeTab === "availability" ? styles.active : ""}`}
              aria-label="Availability tab"
            >
              Availability
            </button>
          </div>

          <div className={styles.tabContent}>
            {/* About Tab */}
            {activeTab === "about" && (
              <div className={styles.aboutContent}>
                <div className={styles.aboutText}>
                  {tutor.about.split("\n\n").map((paragraph, index) => (
                    <p key={index} className={styles.aboutParagraph}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className={styles.teachingStyle}>
                  <h3 className={styles.sectionTitle}>Teaching Style</h3>
                  <p>{tutor.teachingStyle}</p>
                </div>

                <div className={styles.subjectsSection}>
                  <h3 className={styles.sectionTitle}>Subjects I Teach</h3>
                  <div className={styles.subjectsList}>
                    {tutor.subjects.map((subject) => (
                      <span key={subject} className={styles.subjectTag}>
                        <Globe className="w-4 h-4" />
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === "experience" && (
              <div className={styles.experienceContent}>
                <div className={styles.educationSection}>
                  <h3 className={styles.sectionTitle}>
                    <GraduationCap className="w-5 h-5" />
                    Education
                  </h3>
                  <div className={styles.educationList}>
                    {tutor.education.map((edu, index) => (
                      <div key={index} className={styles.educationItem}>
                        <div className={styles.educationDegree}>{edu.degree}</div>
                        <div className={styles.educationInstitution}>{edu.institution}</div>
                        <div className={styles.educationYear}>{edu.year}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.certificationsSection}>
                  <h3 className={styles.sectionTitle}>
                    <Award className="w-5 h-5" />
                    Certifications
                  </h3>
                  <div className={styles.certificationsList}>
                    {tutor.certifications.map((cert, index) => (
                      <div key={index} className={styles.certificationItem}>
                        <div className={styles.certificationName}>{cert.name}</div>
                        <div className={styles.certificationIssuer}>
                          {cert.issuer} • {cert.year}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.workSection}>
                  <h3 className={styles.sectionTitle}>
                    <Briefcase className="w-5 h-5" />
                    Work Experience
                  </h3>
                  <div className={styles.workList}>
                    {tutor.workExperience.map((work, index) => (
                      <div key={index} className={styles.workItem}>
                        <div className={styles.workPosition}>{work.position}</div>
                        <div className={styles.workCompany}>{work.company}</div>
                        <div className={styles.workDuration}>{work.duration}</div>
                        <div className={styles.workDescription}>{work.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className={styles.reviewsContent}>
                <div className={styles.reviewsHeader}>
                  <div className={styles.reviewsStats}>
                    <div className={styles.overallRating}>
                      <span className={styles.ratingNumber}>{tutor.rating}</span>
                      <div className={styles.ratingStars}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`${styles.starIcon} ${i < Math.floor(tutor.rating) ? styles.filled : ""}`}
                          />
                        ))}
                      </div>
                      <span className={styles.reviewCount}>({tutor.reviews.length} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className={styles.reviewsList}>
                  {tutor.reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </div>
            )}

            {/* Availability Tab */}
            {activeTab === "availability" && (
              <div className={styles.availabilityContent}>
                <div className={styles.timezoneInfo}>
                  <h3 className={styles.sectionTitle}>
                    <Clock className="w-5 h-5" />
                    Availability ({tutor.availability.timezone})
                  </h3>
                  <p className={styles.timezoneNote}>
                    Times shown are in {tutor.availability.timezone}. The schedule will automatically adjust to your
                    local timezone when booking.
                  </p>
                </div>

                <div className={styles.scheduleGrid}>
                  {Object.entries(tutor.availability.schedule).map(([day, slots]) => (
                    <div key={day} className={styles.scheduleDay}>
                      <h4 className={styles.dayName}>{day.charAt(0).toUpperCase() + day.slice(1)}</h4>
                      <div className={styles.timeSlots}>
                        {slots.length > 0 ? (
                          slots.map((time) => (
                            <span key={time} className={styles.timeSlot}>
                              {time}
                            </span>
                          ))
                        ) : (
                          <span className={styles.noSlots}>Not available</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        tutor={tutor}
        lessonType={bookingType}
      />

      {/* Video Modal */}
      {showVideoModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.videoModal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Introduction Video - {tutor.name}</h3>
              <button onClick={() => setShowVideoModal(false)} className={styles.closeButton} aria-label="Close video modal">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className={styles.videoContainer}>
              <div className={styles.videoPlaceholder}>
                <Play className="w-16 h-16" />
                <p>Video would play here</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
