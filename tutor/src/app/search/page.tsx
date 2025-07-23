"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  BookOpen,
  Search,
  Star,
  ChevronDown,
  Users,
  Video,
  Heart,
  Globe,
  X,
  HelpCircle,
  Check,
  SlidersHorizontal,
} from "lucide-react"
import styles from "../../styles/SearchPage.module.css"
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";

// Type definitions
interface Option {
  value: string
  label: string
  count?: number
}

interface MultiSelectProps {
  label: string
  options: Option[]
  selected: string[]
  onChange: (value: string[]) => void
  placeholder: string
}

interface PriceRangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  label: string
}

interface Filters {
  subject: string
  hourlyRate: [number, number]
  experience: string
  isVerified: boolean
  isAvailable: boolean
  averageRating: number
  totalReviews: number
  sortBy: string
}

interface AdvancedFilterPanelProps {
  isOpen: boolean
  onClose: () => void
  filters: Filters
  onFilterChange: (key: keyof Filters, value: any) => void
}

interface FilterBarProps {
  filters: Filters
  onFilterChange: (key: keyof Filters, value: any) => void
  searchQuery: string
  onSearchChange: (value: string) => void
  onOpenAdvancedFilters: () => void
}

interface Tutor {
  id: string
  name: string
  flag: string
  nativeFlag: string
  isNative: boolean
  subject: string
  rating: number
  reviews: number
  price: number
  activeStudents: number
  totalLessons: number
  languages: string[]
  description: string
  isProfessional: boolean
  isSuperTutor: boolean
  isOnline: boolean
  hasVideo: boolean
  image: string
}

interface TutorCardProps {
  tutor: Tutor
}

interface User {
  userType: string;
  [key: string]: any;
}

// Multi-Select Component
function MultiSelect({ label, options, selected, onChange, placeholder }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false) 

  const handleToggle = (value: string) => {
    const newSelected = selected.includes(value) ? selected.filter((item: string) => item !== value) : [...selected, value]
    onChange(newSelected)
  }

  const handleClear = () => {
    onChange([])
  }

  return (
    <div className={styles.multiSelectContainer}>
      <label className={styles.filterLabel}>{label}</label>
      <div className={styles.multiSelectWrapper}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`${styles.multiSelectButton} ${selected.length > 0 ? styles.hasSelection : ""}`}
          aria-label={`${label} dropdown`}
        >
          <span className={styles.multiSelectText}>
            {selected.length === 0 ? placeholder : selected.length === 1 ? selected[0] : `${selected.length} selected`}
          </span>
          <ChevronDown className={`${styles.chevronIcon} ${isOpen ? styles.rotated : ""}`} />
        </button>

        {selected.length > 0 && (
          <button onClick={handleClear} className={styles.multiSelectClear} aria-label="Clear selection">
            <X className="w-4 h-4" />
          </button>
        )}

        {isOpen && (
          <div className={styles.multiSelectDropdown}>
            <div className={styles.multiSelectOptions}>
              {options.map((option: Option) => (
                <label key={option.value} className={styles.multiSelectOption}>
                  <input
                    type="checkbox"
                    checked={selected.includes(option.value)}
                    onChange={() => handleToggle(option.value)}
                    className={styles.multiSelectCheckbox}
                  />
                  <span className={styles.checkmark}>
                    {selected.includes(option.value) && <Check className="w-3 h-3" />}
                  </span>
                  <span className={styles.optionText}>{option.label}</span>
                  {option.count && <span className={styles.optionCount}>({option.count})</span>}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Price Range Slider Component
function PriceRangeSlider({ min, max, value, onChange, label }: PriceRangeSliderProps) {
  const [localValue, setLocalValue] = useState<[number, number]>(value)

  const handleSliderChange = (index: number, newValue: string) => {
    const newRange: [number, number] = [...localValue]
    newRange[index] = Number.parseInt(newValue)

    // Ensure min doesn't exceed max and vice versa
    if (index === 0 && newRange[0] > newRange[1]) {
      newRange[1] = newRange[0]
    } else if (index === 1 && newRange[1] < newRange[0]) {
      newRange[0] = newRange[1]
    }

    setLocalValue(newRange)
    onChange(newRange)
  }

  const handleInputChange = (index: number, newValue: string) => {
    const numValue = Number.parseInt(newValue) || (index === 0 ? min : max)
    handleSliderChange(index, numValue.toString())
  }

  return (
    <div className={styles.priceRangeContainer}>
      <label className={styles.filterLabel}>{label}</label>
      <div className={styles.priceInputs}>
        <div className={styles.priceInputGroup}>
          <span className={styles.currencySymbol}>$</span>
          <input
            type="number"
            value={localValue[0]}
            onChange={(e) => handleInputChange(0, e.target.value)}
            min={min}
            max={max}
            className={styles.priceInput}
            placeholder="Min"
            aria-label="Minimum price"
          />
        </div>
        <span className={styles.priceSeparator}>-</span>
        <div className={styles.priceInputGroup}>
          <span className={styles.currencySymbol}>$</span>
          <input
            type="number"
            value={localValue[1]}
            onChange={(e) => handleInputChange(1, e.target.value)}
            min={min}
            max={max}
            className={styles.priceInput}
            placeholder="Max"
            aria-label="Maximum price"
          />
        </div>
      </div>

      <div className={styles.sliderContainer}>
        <div className={styles.sliderTrack}>
          <div
            className={styles.sliderRange}
            style={{
              left: `${((localValue[0] - min) / (max - min)) * 100}%`,
              width: `${((localValue[1] - localValue[0]) / (max - min)) * 100}%`,
            }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={localValue[0]}
          onChange={(e) => handleSliderChange(0, e.target.value)}
          className={`${styles.slider} ${styles.sliderMin}`}
          aria-label="Minimum price slider"
          title="Minimum price"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={localValue[1]}
          onChange={(e) => handleSliderChange(1, e.target.value)}
          className={`${styles.slider} ${styles.sliderMax}`}
          aria-label="Maximum price slider"
          title="Maximum price"
        />
      </div>

      <div className={styles.sliderLabels}>
        <span>${min}</span>
        <span>${max}+</span>
      </div>
    </div>
  )
}

// Advanced Filter Panel Component
function AdvancedFilterPanel({ isOpen, onClose, filters, onFilterChange }: AdvancedFilterPanelProps) {

  if (!isOpen) return null

  return (
    <div className={styles.advancedFilterOverlay}>
      <div className={styles.advancedFilterPanel}>
        <div className={styles.advancedFilterHeader}>
          <h3 className={styles.advancedFilterTitle}>Advanced Filters</h3>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close advanced filters">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className={styles.advancedFilterContent}>
          <div className={styles.filterGrid}>
            {/* Hourly Rate */}
            <div className={styles.filterSection}>
              <PriceRangeSlider
                label="Price per lesson"
                min={3}
                max={100}
                value={filters.hourlyRate}
                onChange={(value: [number, number]) => onFilterChange("hourlyRate", value)}
              />
            </div>

            {/* Availability */}
            <div className={styles.filterSection}>
              <label className={styles.filterLabel}>Availability</label>
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxOption}>
                  <input
                    type="checkbox"
                    checked={filters.isAvailable}
                    onChange={(e) => onFilterChange("isAvailable", e.target.checked)}
                  />
                  <span>Available now</span>
                </label>
              </div>
            </div>

            {/* Verification Status */}
            <div className={styles.filterSection}>
              <label className={styles.filterLabel}>Verification</label>
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxOption}>
                  <input
                    type="checkbox"
                    checked={filters.isVerified}
                    onChange={(e) => onFilterChange("isVerified", e.target.checked)}
                  />
                  <span>Verified tutors only</span>
                </label>
              </div>
            </div>

            {/* Experience Level */}
            <div className={styles.filterSection}>
              <label className={styles.filterLabel}>Teaching Experience</label>
              <div className={styles.experienceOptions}>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="experience"
                    value="any"
                    checked={filters.experience === "any"}
                    onChange={(e) => onFilterChange("experience", e.target.value)}
                  />
                  <span>Any experience</span>
                </label>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="experience"
                    value="1+"
                    checked={filters.experience === "1+"}
                    onChange={(e) => onFilterChange("experience", e.target.value)}
                  />
                  <span>1+ years</span>
                </label>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="experience"
                    value="3+"
                    checked={filters.experience === "3+"}
                    onChange={(e) => onFilterChange("experience", e.target.value)}
                  />
                  <span>3+ years</span>
                </label>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="experience"
                    value="5+"
                    checked={filters.experience === "5+"}
                    onChange={(e) => onFilterChange("experience", e.target.value)}
                  />
                  <span>5+ years</span>
                </label>
              </div>
            </div>

            {/* Average Rating */}
            <div className={styles.filterSection}>
              <label className={styles.filterLabel}>Minimum Rating</label>
              <div className={styles.ratingOptions}>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="rating"
                    value={0}
                    checked={filters.averageRating === 0}
                    onChange={(e) => onFilterChange("averageRating", Number(e.target.value))}
                  />
                  <span>Any rating</span>
                </label>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="rating"
                    value={4}
                    checked={filters.averageRating === 4}
                    onChange={(e) => onFilterChange("averageRating", Number(e.target.value))}
                  />
                  <span>4+ stars</span>
                </label>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="rating"
                    value={4.5}
                    checked={filters.averageRating === 4.5}
                    onChange={(e) => onFilterChange("averageRating", Number(e.target.value))}
                  />
                  <span>4.5+ stars</span>
                </label>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="rating"
                    value={5}
                    checked={filters.averageRating === 5}
                    onChange={(e) => onFilterChange("averageRating", Number(e.target.value))}
                  />
                  <span>5 stars only</span>
                </label>
              </div>
            </div>

            {/* Total Reviews */}
            <div className={styles.filterSection}>
              <label className={styles.filterLabel}>Minimum Reviews</label>
              <div className={styles.reviewOptions}>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="reviews"
                    value={0}
                    checked={filters.totalReviews === 0}
                    onChange={(e) => onFilterChange("totalReviews", Number(e.target.value))}
                  />
                  <span>Any number</span>
                </label>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="reviews"
                    value={10}
                    checked={filters.totalReviews === 10}
                    onChange={(e) => onFilterChange("totalReviews", Number(e.target.value))}
                  />
                  <span>10+ reviews</span>
                </label>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="reviews"
                    value={50}
                    checked={filters.totalReviews === 50}
                    onChange={(e) => onFilterChange("totalReviews", Number(e.target.value))}
                  />
                  <span>50+ reviews</span>
                </label>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="reviews"
                    value={100}
                    checked={filters.totalReviews === 100}
                    onChange={(e) => onFilterChange("totalReviews", Number(e.target.value))}
                  />
                  <span>100+ reviews</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.advancedFilterFooter}>
          <button
            onClick={() => {
              // Clear all filters
              onFilterChange("hourlyRate", [3, 100])
              onFilterChange("isAvailable", false)
              onFilterChange("isVerified", false)
              onFilterChange("experience", "any")
              onFilterChange("averageRating", 0)
              onFilterChange("totalReviews", 0)
            }}
            className={styles.clearAllButton}
          >
            Clear All
          </button>
          <button onClick={onClose} className={styles.applyFiltersButton}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}

// Header Component
function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) setUser(JSON.parse(userStr));
    }
  }, []);

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
            <Link href="/search" className={`${styles.navLink} ${styles.activeNavLink}`}>
              Find tutors
            </Link>
            <Link href="/#become-tutor" className={styles.navLink}>
              Become a tutor
            </Link>
          </nav>
          <div className={styles.headerActions}>
            {user ? (
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setDropdownOpen((open) => !open)}
                  className={styles.loginButton}
                >
                  Menu
              </button>
                {dropdownOpen && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "100%",
                      background: "#fff",
                      border: "1px solid #eee",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      zIndex: 10,
                      minWidth: 120,
                    }}
                  >
                    <div
                      style={{ padding: "8px 16px", cursor: "pointer" }}
                      onClick={() => {
                        setDropdownOpen(false);
                        if ((user as User)?.userType === "student") {
                          window.location.href = "/student-dash";
                        } else if ((user as User)?.userType === "tutor") {
                          window.location.href = "/tutor-dash";
                        }
                      }}
                    >
                      Dashboard
            </div>
                    <div
                      style={{ padding: "8px 16px", cursor: "pointer" }}
                      onClick={() => {
                        localStorage.clear();
                        window.location.href = "/landing-page";
                      }}
                    >
                      Logout
                    </div>
                  </div>
                )}
              </div>
            ) : (
            <Link href="/auth/login" className={styles.loginButton}>
              Log In
            </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// Enhanced Filter Bar Component
function FilterBar({ filters, onFilterChange, searchQuery, onSearchChange, onOpenAdvancedFilters }: FilterBarProps) {
  const subjects = [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
    "Italian",
    "Portuguese",
    "Russian",
    "Arabic",
  ];
  const languages = [
    "English",
    "French",
    "Spanish",
    "German",
    "Arabic",
    "Chinese",
    "Japanese",
    "Russian",
    "Portuguese",
    "Italian"
  ];
  const teachingMethods = [
    "Online",
    "In-person",
    "Hybrid"
  ];
  const ratings = [
    { label: "Any rating", value: 0 },
    { label: "4+ stars", value: 4 },
    { label: "4.5+ stars", value: 4.5 },
    { label: "5 stars", value: 5 }
  ];
  const quickPriceRanges = [
    { label: "$3 - $40+", value: [3, 40] as [number, number] },
    { label: "$5 - $15", value: [5, 15] as [number, number] },
    { label: "$15 - $25", value: [15, 25] as [number, number] },
    { label: "$25 - $40", value: [25, 40] as [number, number] },
    { label: "$40+", value: [40, 100] as [number, number] },
  ];

  // Add new filter states for language, location, teaching methods, and rating
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [location, setLocation] = useState("");
  const [selectedTeachingMethod, setSelectedTeachingMethod] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);

  const moroccanCities = [
    "Casablanca", "Rabat", "Fes", "Marrakech", "Agadir", "Tangier", "Meknes", "Oujda", "Kenitra", "Tetouan", "Safi", "El Jadida", "Beni Mellal", "Nador", "Taza", "Khouribga", "Settat", "Berrechid", "Khemisset", "Larache", "Guelmim", "Ksar El Kebir", "Taourirt", "Berkane", "Khenifra", "Inezgane", "Temara", "Sidi Slimane", "Mohammedia", "Sidi Kacem", "Sidi Bennour", "Errachidia", "Guercif", "Ouarzazate", "Dakhla", "Essaouira", "Tiznit", "Taroudant", "Tiflet", "Tan-Tan", "Ouazzane", "Sefrou", "Youssoufia", "Martil", "Midelt", "Azrou", "Ait Melloul", "Fnideq", "Skhirat", "Jerada", "Benslimane", "Ait Ourir"
  ];

  return (
    <div className={styles.filterSection}>
      <div className={styles.sectionContent}>
        <div className={styles.mainFilters}>
          {/* Subject */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>I want to learn</label>
            <div className={styles.selectWrapper}>
              <select
                value={filters.subject}
                onChange={(e) => onFilterChange("subject", e.target.value)}
                className={styles.filterSelect}
                aria-label="Select subject to learn"
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              {filters.subject && (
                <button
                  onClick={() => onFilterChange("subject", "")}
                  className={styles.clearButton}
                  aria-label="Clear subject filter"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          {/* Price per lesson */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Price per lesson</label>
            <select
              value={`${filters.hourlyRate[0]}-${filters.hourlyRate[1]}`}
              onChange={(e) => {
                const range = quickPriceRanges.find((r) => `${r.value[0]}-${r.value[1]}` === e.target.value)
                if (range) onFilterChange("hourlyRate", range.value)
              }}
              className={styles.filterSelect}
              aria-label="Select price range"
            >
              {quickPriceRanges.map((range) => (
                <option key={`${range.value[0]}-${range.value[1]}`} value={`${range.value[0]}-${range.value[1]}`}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
          {/* Language */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Language</label>
            <select
              value={selectedLanguage}
              onChange={e => setSelectedLanguage(e.target.value)}
              className={styles.filterSelect}
              aria-label="Select language"
            >
              <option value="">Any</option>
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
          {/* Location */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Location</label>
            <select
              value={location}
              onChange={e => setLocation(e.target.value)}
              className={styles.filterSelect}
              aria-label="Select location"
            >
              <option value="">Any</option>
              {moroccanCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          {/* Teaching Methods */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Teaching Methods</label>
            <select
              value={selectedTeachingMethod}
              onChange={e => setSelectedTeachingMethod(e.target.value)}
              className={styles.filterSelect}
              aria-label="Select teaching method"
            >
              <option value="">Any</option>
              {teachingMethods.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>
          {/* Rating */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Rating</label>
            <select
              value={selectedRating}
              onChange={e => setSelectedRating(Number(e.target.value))}
              className={styles.filterSelect}
              aria-label="Select rating"
            >
              {ratings.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            </div>
          </div>
      </div>
    </div>
  );
}

// Tutor Card Component (unchanged)
function TutorCard({ tutor }: TutorCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)

  return (
    <div className={styles.tutorCard}>
      <div className={styles.tutorCardContent}>
        {/* Left Side - Profile */}
        <div className={styles.tutorProfile}>
          <div className={styles.tutorImageWrapper}>
            <Image
              src={tutor.image || "/placeholder.svg"}
              alt={tutor.name}
              width={120}
              height={120}
              className={styles.tutorImage}
            />
            {tutor.isOnline && <div className={styles.onlineIndicator}></div>}
          </div>
        </div>

        {/* Center - Info */}
        <div className={styles.tutorInfo}>
          <div className={styles.tutorHeader}>
            <div className={styles.tutorNameRow}>
              <h3 className={styles.tutorName}>
                <Link href={`/tutor/${tutor.id}`} className={styles.tutorNameLink}>
                  {tutor.name}
                  <span className={styles.countryFlag}>{tutor.flag}</span>
                  {tutor.isNative && <span className={styles.nativeFlag}>{tutor.nativeFlag}</span>}
                </Link>
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`${styles.favoriteButton} ${isFavorited ? styles.favorited : ""}`}
                  aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart className="w-5 h-5" />
                </button>
              </h3>

              <div className={styles.tutorBadges}>
                {tutor.isProfessional && <span className={styles.professionalBadge}>Professional</span>}
                {tutor.isSuperTutor && <span className={styles.superTutorBadge}>Super Tutor</span>}
              </div>
            </div>

            <div className={styles.tutorDetails}>
              <div className={styles.tutorSubject}>
                <Globe className="w-4 h-4" />
                <span>{tutor.subject}</span>
              </div>

              <div className={styles.tutorStats}>
                <div className={styles.statItem}>
                  <Users className="w-4 h-4" />
                  <span>
                    {tutor.activeStudents} active students • {tutor.totalLessons} lessons
                  </span>
                </div>
              </div>

              <div className={styles.tutorLanguages}>
                <span>Speaks {tutor.languages.join(", ")}</span>
              </div>

              <div className={styles.tutorDescription}>
                <p>{tutor.description}</p>
                <button className={styles.readMoreButton}>Read more</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className={styles.tutorActions}>
          <div className={styles.tutorRating}>
            <div className={styles.ratingRow}>
              <Star className={styles.starIcon} />
              <span className={styles.ratingNumber}>{tutor.rating}</span>
            </div>
            <div className={styles.reviewCount}>{tutor.reviews} reviews</div>
          </div>

          <div className={styles.tutorPrice}>
            <span className={styles.priceAmount}>${tutor.price}</span>
            <span className={styles.priceUnit}>50-min lesson</span>
          </div>

          <div className={styles.actionButtons}>
            <button className={styles.bookTrialButton}>Book trial lesson</button>
            <Link href={`/profile`} className={styles.sendMessageButton}>
              View Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Video/Schedule (for some tutors) */}
      {tutor.hasVideo && (
        <div className={styles.tutorVideo}>
          <div className={styles.videoThumbnail}>
            <div className={styles.playButton}>
              <Video className="w-8 h-8" />
            </div>
            <span className={styles.videoLabel}>TEACHER {tutor.name.split(" ")[0].toUpperCase()}</span>
          </div>
          <button className={styles.viewScheduleButton}>View full schedule</button>
        </div>
      )}
    </div>
  )
}

// Main Search Page Component
export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    subject: "Any",
    hourlyRate: [3, 100],
    experience: "any",
    isVerified: false,
    isAvailable: false,
    averageRating: 0,
    totalReviews: 0,
    sortBy: "Our top picks",
  })

  // Fetch tutors from Firestore
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutors = async () => {
      setLoading(true);
      setError(null);
      try {
        const q = query(collection(db, "users"), where("isTutor", "==", true));
        const snapshot = await getDocs(q);
        const tutorsData: Tutor[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.Name || data.name || "Unknown",
            flag: data.flag || "",
            nativeFlag: data.nativeFlag || "",
            isNative: data.isNative || false,
            subject: data.subjects?.[0] || "",
            rating: data.averageRating || 0,
            reviews: data.totalReviews || 0,
            price: data.hourlyRate || 0,
            activeStudents: data.activeStudents || 0,
            totalLessons: data.totalLessons || 0,
            languages: data.languages || [],
            description: data.bio || "",
            isProfessional: data.isVerified || false,
            isSuperTutor: data.isSuperTutor || false,
            isOnline: data.isOnline || false,
            hasVideo: false,
            image: data.profilePicture || "",
          };
        });
        setTutors(tutorsData);
      } catch (err) {
        setError("Failed to load tutors.");
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, []);

  const [filteredTutors, setFilteredTutors] = useState<Tutor[]>([])

  useEffect(() => {
    setFilteredTutors(tutors);
  }, [searchQuery, filters, tutors])

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  if (loading) {
    return <div className={styles.container}><Header /><div style={{padding: 40, textAlign: 'center'}}>Loading tutors...</div></div>;
  }
  if (error) {
    return <div className={styles.container}><Header /><div style={{padding: 40, textAlign: 'center', color: 'red'}}>{error}</div></div>;
  }

  return (
    <div className={styles.container}>
      <Header />

      {/* Page Title */}
      <section className={styles.titleSection}>
        <div className={styles.sectionContent}>
          <h1 className={styles.pageTitle}>Tutors & teachers for private classes</h1>
        </div>
      </section>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onOpenAdvancedFilters={() => setShowAdvancedFilters(true)}
      />

      {/* Advanced Filter Panel */}
      <AdvancedFilterPanel
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Results Section */}
      <section className={styles.resultsSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.resultsTitle}>
            {filteredTutors.length.toLocaleString()} {filters.subject === "Any" ? "tutors" : `${filters.subject} teachers`} that match your needs
          </h2>

          <div className={styles.tutorGrid}>
            {filteredTutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
