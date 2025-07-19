"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  BookOpen,
  Search,
  Shield,
  DollarSign,
  Calendar,
  Clock,
  Star,
  ArrowRight,
  Zap,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
} from "lucide-react"
import styles from "../../styles/LandingPage.module.css"
import { motion } from "framer-motion"

// Header Component
function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.headerFlex}>
          <div className={styles.logoContainer}>
            <Link href="/" className={styles.logoLink}>
              <span className={styles.logoText}>Study Finder</span>
              <div className={styles.logoIndicator}></div>
            </Link>
          </div>
          <nav className={styles.nav}>
            <Link href="#tutors" className={styles.navLink}>
              Find Tutors
            </Link>
            <Link href="#how-it-works" className={styles.navLink}>
              How It Works
            </Link>
            <Link href="#become-tutor" className={styles.navLink}>
              Become a Tutor
            </Link>
          </nav>
          <div className={styles.headerActions}>
            <Link href="/auth/login" className={styles.loginButton}>
              Log In
            </Link>
            <Link href="/auth/register" className={styles.signupButton}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

// Hero Component
function Hero() {
  const [isOnline, setIsOnline] = useState(true)

  const subjects = [
    "Mathematics",
    "Science",
    "English",
    "History",
    "Languages",
    "Computer Science",
    "Physics",
    "Chemistry",
    "Biology",
    "Economics",
  ]

  return (
    <motion.section
      className={styles.hero}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.7 }}
    >
      <div className={styles.sectionContent}>
        <div className={styles.heroGrid}>
          <div className={styles.heroContent}>
            <div>
              <h1 className={styles.heroTitle}>
                Find Your Perfect Tutor – <span className={styles.heroHighlight}>Anytime, Anywhere</span>
              </h1>
              <p className={styles.heroSubtitle}>
                Expert help in math, science, languages, and more – tailored to your learning goals.
              </p>
            </div>

            <div className={styles.searchCard}>
              <div className={styles.form}>
                <div className={styles.grid}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="subject-select" className="sr-only">Select Subject</label>
                    <select id="subject-select" className={styles.select} aria-label="Select Subject">
                      <option value="">Select Subject</option>
                      {subjects.map((subject) => (
                        <option key={subject} value={subject.toLowerCase()}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      <input
                        type="checkbox"
                        checked={isOnline}
                        onChange={(e) => setIsOnline(e.target.checked)}
                        className="mr-2"
                      />
                      {isOnline ? "Online" : "In-person"}
                    </label>
                  </div>
                </div>
                <button
                  className={`${styles.button} ${styles.buttonPrimary} ${styles.buttonFull} ${styles.buttonLarge}`}
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search Tutors
                </button>
              </div>
            </div>
          </div>

          <div className="relative">
            <Image
              src="/assets/images/study-group.jpeg"
              alt="Student learning online with tutor"
              width={600}
              height={500}
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </motion.section>
  )
}

// Quick Match Component
function QuickMatch() {
  const subjects = ["Mathematics", "Science", "English", "History", "Languages"]
  const levels = [""]

  return (
    <motion.section
      className={`${styles.section} ${styles.bgWhite}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.7 }}
    >
      <div className={styles.sectionContent}>
        <div className={`${styles.card} max-w-4xl mx-auto`}>
          <div className={styles.textCenter}>
            <h2 className={`${styles.sectionTitle} ${styles.mb4}`}>Get Matched Instantly</h2>
            <p className={`${styles.sectionSubtitle} ${styles.mb8}`}>
              Tell us what you need, and we'll find the perfect tutor for you
            </p>
          </div>
          <div className={styles.form}>
            <div className={styles.gridQuickMatch}>
              <div>
                <label htmlFor="quick-subject-select" className={styles.labelQuickMatch}>Subject</label>
                <select id="quick-subject-select" className={styles.select} aria-label="Subject">
                  <option value="">Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject.toLowerCase()}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="level-select" className={styles.labelQuickMatch}>Language</label>
                <select id="level-select" className={styles.select} aria-label="Level">
                  <option value="">Language</option>
                  {levels.map((level) => (
                    <option key={level} value={level.toLowerCase()}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="preference-select" className={styles.labelQuickMatch}>Preference</label>
                <select id="preference-select" className={styles.select} aria-label="Preference">
                  <option value="">Preference</option>
                  <option value="online">Online</option>
                  <option value="local">Local</option>
                  <option value="both">Both</option>
                </select>
              </div>
            </div>
            <button className={`${styles.button} ${styles.buttonPrimary} ${styles.buttonFull} ${styles.buttonLarge}`}>
              <Zap className="w-5 h-5 mr-2" />
              Get Matched Now
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

// Benefits Component
function Benefits() {
  const benefits = [
    {
      icon: Shield,
      title: "Verified Tutors",
      description: "All tutors are background-checked and verified for quality assurance",
    },
    {
      icon: DollarSign,
      title: "Affordable Rates",
      description: "Competitive pricing starting from 100 MAD/hour with flexible payment options",
    },
    {
      icon: Calendar,
      title: "Flexible Scheduling",
      description: "Book sessions that fit your schedule, with easy rescheduling options",
    },
    {
      icon: Clock,
      title: "Available 24/7",
      description: "Get help whenever you need it with tutors across all time zones",
    },
  ]

  return (
    <motion.section
      className={`${styles.section} ${styles.bgGray}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.7 }}
    >
      <div className={styles.sectionContent}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Why Choose Study Finder?</h2>
          <p className={styles.sectionSubtitle}>
            We're committed to providing the best tutoring experience with verified experts and flexible learning
            options
          </p>
        </div>

        <div className={`${styles.grid} ${styles.gridCols4}`}>
          {benefits.map((benefit, index) => (
            <div key={index} className={`${styles.card} ${styles.textCenter}`}>
              <div className={styles.iconContainer}>
                <benefit.icon className={styles.icon} />
              </div>
              <h3 className={`${styles.textLarge} font-semibold ${styles.textDark} ${styles.mb4}`}>{benefit.title}</h3>
              <p className={styles.textGray}>{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

// Featured Tutors Component
function FeaturedTutors() {
  const featuredTutors = [
    {
      id: 1,
      name: "Sarah Johnson",
      subjects: ["Mathematics", "Physics"],
      bio: "PhD in Mathematics with 8+ years of teaching experience",
      rating: 4.9,
      reviews: 127,
      hourlyRate: 100,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      name: "Michael Chen",
      subjects: ["Computer Science", "Python"],
      bio: "Software Engineer at Google, specializing in programming",
      rating: 4.8,
      reviews: 89,
      hourlyRate: 200,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      subjects: ["Spanish", "French"],
      bio: "Native speaker with MA in Linguistics and 6 years experience",
      rating: 5.0,
      reviews: 156,
      hourlyRate: 150,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 4,
      name: "David Thompson",
      subjects: ["Chemistry", "Biology"],
      bio: "Medical student with extensive science tutoring background",
      rating: 4.9,
      reviews: 94,
      hourlyRate: 300,
      image: "/placeholder.svg?height=80&width=80",
    },
  ]

  return (
    <motion.section
      id="tutors"
      className={`${styles.section} ${styles.bgWhite}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.7 }}
    >
      <div className={styles.sectionContent}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Meet Our Top Tutors</h2>
          <p className={styles.sectionSubtitle}>
            Learn from experienced educators who are passionate about helping you succeed
          </p>
        </div>

        <div className={`${styles.grid} ${styles.gridCols4}`}>
          {featuredTutors.map((tutor, idx) => (
            <motion.div
              key={tutor.id}
              className={`${styles.card} ${styles.textCenter} ${styles.tutorCard}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <div className={styles.tutorImageWrapper}>
                <Image
                  src={tutor.image || "/assets/images/default-tutor.png"}
                  alt={tutor.name}
                  width={80}
                  height={80}
                  className={styles.tutorImage}
                  style={{ objectFit: "cover" }}
                />
              </div>
              <h3 className={styles.tutorName}>{tutor.name}</h3>
              <div className={styles.tutorSubjects}>
                {tutor.subjects.map((subject) => (
                  <span key={subject} className={styles.tutorBadge}>
                    {subject}
                  </span>
                ))}
              </div>
              <p className={styles.tutorBio}>{tutor.bio}</p>
              <div className={styles.tutorMeta}>
                <div className={styles.rating}>
                  <Star className={styles.star} />
                  <span className="font-medium">{tutor.rating}</span>
                  <span className={styles.textGray}>({tutor.reviews})</span>
                </div>
                <span className={styles.tutorRate}>{tutor.hourlyRate}MAD/hr</span>
              </div>
              <button className={`${styles.button} ${styles.buttonPrimary} ${styles.buttonFull} ${styles.tutorProfileBtn}`}>
                View Profile
              </button>
            </motion.div>
          ))}
        </div>

        <div className={`${styles.textCenter} ${styles.mt12}`}>
          <Link href="/search" className={`${styles.button} ${styles.buttonSecondary} ${styles.buttonLarge}`}>
            View All Tutors
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </motion.section>
  )
}

// How It Works Component
function HowItWorks() {
  const steps = [
    {
      icon: "1",
      title: "Create Your Account",
      description: "Sign up in minutes and tell us about your learning goals",
    },
    {
      icon: "2",
      title: "Find Your Tutor",
      description: "Browse verified tutors or get matched based on your needs",
    },
    {
      icon: "3",
      title: "Book Your Session",
      description: "Schedule at your convenience with flexible timing options",
    },
    {
      icon: "4",
      title: "Start Learning",
      description: "Join your session and begin achieving your academic goals",
    },
  ]

  return (
    <motion.section
      id="how-it-works"
      className={`${styles.section} ${styles.bgGray}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.7 }}
    >
      <div className={styles.sectionContent}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <p className={styles.sectionSubtitle}>
            Getting started is simple. Follow these easy steps to begin your learning journey
          </p>
        </div>

        <div className={`${styles.grid} ${styles.gridCols4}`}>
          {steps.map((step, index) => (
            <div key={index} className={`${styles.textCenter} relative`}>
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative">
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {step.icon}
                </div>
                <BookOpen className="w-10 h-10 text-pink-600" />
              </div>
              <h3 className={`${styles.textLarge} font-semibold ${styles.textDark} ${styles.mb4}`}>{step.title}</h3>
              <p className={styles.textGray}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

// Testimonials Component
function Testimonials() {
  const testimonials = [
    {
      name: "Alex Martinez",
      role: "High School Student",
      content:
        "My math grades improved from C to A+ in just 3 months! Sarah is an amazing tutor who makes complex concepts easy to understand.",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Jennifer Kim",
      role: "College Student",
      content:
        "The flexibility to schedule sessions around my busy college schedule is incredible. Michael helped me ace my programming course!",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Robert Wilson",
      role: "Parent",
      content:
        "My daughter's confidence in Spanish has skyrocketed since working with Emily. The progress has been remarkable!",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

  return (
    <motion.section
      className={`${styles.section} ${styles.bgWhite}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.7 }}
    >
      <div className={styles.sectionContent}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>What Our Students Say</h2>
          <p className={styles.sectionSubtitle}>
            Real success stories from students who achieved their goals with our tutors
          </p>
        </div>

        <div className={`${styles.grid} ${styles.gridCols3}`}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className={styles.card}>
              <div className={`${styles.rating} ${styles.mb4}`}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className={styles.star} />
                ))}
              </div>
              <p className={`${styles.textGray} italic ${styles.mb6}`}>"{testimonial.content}"</p>
              <div className="flex items-center space-x-3">
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <div>
                  <h4 className={`font-semibold ${styles.textDark}`}>{testimonial.name}</h4>
                  <p className={`${styles.textSmall} ${styles.textGray}`}>{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

// Become a Tutor Component
function BecomeATutor() {
  return (
    <motion.section
      id="become-tutor"
      className={`${styles.section} ${styles.bgPink}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.7 }}
    >
      <div className={styles.sectionContent}>
        <div className={styles.heroGrid}>
          <div className={styles.heroContent}>
            <h2 className={`${styles.heroTitle} ${styles.textWhite}`}>Earn by Helping Others Learn</h2>
            <p className={styles.heroSubtitle}>
              Join thousands of tutors who are making a difference while earning great income
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className={`${styles.textLarge} ${styles.textWhite}`}>Set your own schedule and rates</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className={`${styles.textLarge} ${styles.textWhite}`}>Get paid weekly with no fees</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className={`${styles.textLarge} ${styles.textWhite}`}>No subscription or hidden costs</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className={`${styles.textLarge} ${styles.textWhite}`}>Access to powerful teaching tools</span>
              </div>
            </div>

            <Link href="/auth/tutor-auth" className={`${styles.button} ${styles.buttonPrimary} ${styles.buttonLarge}`}>
    Join as a Tutor
  <ArrowRight className="w-5 h-5 ml-2" />
</Link>
          </div>

          <div className="relative">
            <Image
              src="/assets/images/haha.jpg"
              alt="Happy tutor teaching online"
              width={500}
              height={400}
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </motion.section>
  )
}

// Newsletter Component
function Newsletter() {
  return (
    <motion.section
      className={`${styles.section} ${styles.bgGray}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.7 }}
    >
      <div className={styles.sectionContent}>
        <div className={`${styles.card} max-w-2xl mx-auto ${styles.textCenter}`}>
          <h2 className={`${styles.sectionTitle} ${styles.mb4}`}>Stay Updated</h2>
          <p className={`${styles.sectionSubtitle} ${styles.mb8}`}>
            Get study tips, free resources, and exclusive offers delivered to your inbox
          </p>

          <div className={styles.form}>
            <div className={styles.formNewsletter}>
              <input type="email" placeholder="Enter your email" className={`${styles.input} flex-1 rounded-full`} />
              <button className={`${styles.button} ${styles.buttonPrimary} ${styles.buttonRounded} px-8`}>
                Subscribe
              </button>
            </div>
            <p className={`${styles.textSmall} ${styles.textGray} ${styles.mt8}`}>No spam, unsubscribe at any time</p>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

// Footer Component
function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.sectionContent}>
          <div className={styles.footerGrid}>
            <div>
              <div className="flex items-center space-x-2 mb-4">
                
                <span className={`${styles.logoText} ${styles.textWhite}`}>Study Finder</span>
              </div>
              <p className={`${styles.textGray} mb-4`}>
                Connecting students with expert tutors for personalized learning experiences.
              </p>
              <div className={styles.socialIcons}>
                <Facebook className={styles.socialIcon} />
                <Instagram className={styles.socialIcon} />
                <Linkedin className={styles.socialIcon} />
              </div>
            </div>

            <div className={styles.footerSection}>
              <h3>For Students</h3>
              <ul>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Find Tutors
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Success Stories
                  </Link>
                </li>
              </ul>
            </div>

            <div className={styles.footerSection}>
              <h3>For Tutors</h3>
              <ul>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Become a Tutor
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Tutor Resources
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Payment Info
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div className={styles.footerSection}>
              <h3>Company</h3>
              <ul>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className={styles.footerLink}>
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p className={styles.textGray}>© 2025 Study Finder. All rights reserved.</p>
            <div className={styles.footerBottomLinks}>
              <Link href="#" className={styles.footerLink}>
                Terms of Service
              </Link>
              <Link href="#" className={styles.footerLink}>
                Privacy Policy
              </Link>
              <Link href="#" className={styles.footerLink}>
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <button className={styles.chatButton} aria-label="Open chat support">
        <MessageCircle className="w-6 h-6" />
      </button>
    </>
  )
}

// Main Page Component
export default function TutoringLandingPage() {
  return (
    <div className={styles.container}>
      <Header />
      <Hero />
      <QuickMatch />
      <Benefits />
      <FeaturedTutors />
      <HowItWorks />
      <Testimonials />
      <BecomeATutor />
      <Newsletter />
      <Footer />
    </div>
  )
}
