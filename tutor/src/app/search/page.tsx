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
  priceRange: [number, number]
  availability: string[]
  specialties: string[]
  alsoSpeaks: string[]
  countries: string[]
  certifications: string[]
  experience: string
  lessonTypes: string[]
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
  id: number
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
  const availabilityOptions: Option[] = [
    { value: "morning", label: "Morning (6AM-12PM)", count: 1247 },
    { value: "afternoon", label: "Afternoon (12PM-6PM)", count: 2156 },
    { value: "evening", label: "Evening (6PM-10PM)", count: 1893 },
    { value: "night", label: "Night (10PM-6AM)", count: 567 },
    { value: "weekends", label: "Weekends", count: 1432 },
    { value: "flexible", label: "Flexible schedule", count: 892 },
  ]

  const specialtyOptions: Option[] = [
    { value: "conversational", label: "Conversational English", count: 3421 },
    { value: "business", label: "Business English", count: 2156 },
    { value: "ielts", label: "IELTS Preparation", count: 1789 },
    { value: "toefl", label: "TOEFL Preparation", count: 1234 },
    { value: "grammar", label: "Grammar", count: 2987 },
    { value: "pronunciation", label: "Pronunciation", count: 1876 },
    { value: "writing", label: "Academic Writing", count: 1543 },
    { value: "interview", label: "Job Interview Prep", count: 987 },
    { value: "kids", label: "English for Kids", count: 1654 },
    { value: "beginners", label: "English for Beginners", count: 2341 },
  ]

  const languageOptions: Option[] = [
    { value: "spanish", label: "Spanish", count: 1234 },
    { value: "french", label: "French", count: 987 },
    { value: "german", label: "German", count: 654 },
    { value: "chinese", label: "Chinese (Mandarin)", count: 543 },
    { value: "japanese", label: "Japanese", count: 432 },
    { value: "arabic", label: "Arabic", count: 321 },
    { value: "portuguese", label: "Portuguese", count: 298 },
    { value: "italian", label: "Italian", count: 267 },
    { value: "russian", label: "Russian", count: 234 },
    { value: "korean", label: "Korean", count: 198 },
  ]

  const countryOptions: Option[] = [
    { value: "us", label: "United States", count: 5432 },
    { value: "uk", label: "United Kingdom", count: 4321 },
    { value: "canada", label: "Canada", count: 2156 },
    { value: "australia", label: "Australia", count: 1876 },
    { value: "south-africa", label: "South Africa", count: 987 },
    { value: "ireland", label: "Ireland", count: 654 },
    { value: "new-zealand", label: "New Zealand", count: 432 },
    { value: "philippines", label: "Philippines", count: 1234 },
    { value: "india", label: "India", count: 2341 },
    { value: "nigeria", label: "Nigeria", count: 876 },
  ]

  const certificationOptions: Option[] = [
    { value: "tefl", label: "TEFL Certified", count: 2156 },
    { value: "tesol", label: "TESOL Certified", count: 1876 },
    { value: "celta", label: "CELTA Certified", count: 987 },
    { value: "delta", label: "DELTA Certified", count: 234 },
    { value: "cambridge", label: "Cambridge Certified", count: 654 },
    { value: "ielts-examiner", label: "IELTS Examiner", count: 123 },
  ]

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
            {/* Price Range */}
            <div className={styles.filterSection}>
              <PriceRangeSlider
                label="Price per lesson"
                min={3}
                max={100}
                value={filters.priceRange}
                onChange={(value: [number, number]) => onFilterChange("priceRange", value)}
              />
            </div>

            {/* Availability */}
            <div className={styles.filterSection}>
              <MultiSelect
                label="Availability"
                options={availabilityOptions}
                selected={filters.availability}
                onChange={(value: string[]) => onFilterChange("availability", value)}
                placeholder="Any time"
              />
            </div>

            {/* Specialties */}
            <div className={styles.filterSection}>
              <MultiSelect
                label="Specialties"
                options={specialtyOptions}
                selected={filters.specialties}
                onChange={(value: string[]) => onFilterChange("specialties", value)}
                placeholder="All specialties"
              />
            </div>

            {/* Also Speaks */}
            <div className={styles.filterSection}>
              <MultiSelect
                label="Also speaks"
                options={languageOptions}
                selected={filters.alsoSpeaks}
                onChange={(value: string[]) => onFilterChange("alsoSpeaks", value)}
                placeholder="Any language"
              />
            </div>

            {/* Country of Birth */}
            <div className={styles.filterSection}>
              <MultiSelect
                label="Country of birth"
                options={countryOptions}
                selected={filters.countries}
                onChange={(value: string[]) => onFilterChange("countries", value)}
                placeholder="Any country"
              />
            </div>

            {/* Certifications */}
            <div className={styles.filterSection}>
              <MultiSelect
                label="Certifications"
                options={certificationOptions}
                selected={filters.certifications}
                onChange={(value: string[]) => onFilterChange("certifications", value)}
                placeholder="Any certification"
              />
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

            {/* Lesson Type */}
            <div className={styles.filterSection}>
              <label className={styles.filterLabel}>Lesson Type</label>
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxOption}>
                  <input
                    type="checkbox"
                    checked={filters.lessonTypes.includes("individual")}
                    onChange={(e) => {
                      const newTypes = e.target.checked
                        ? [...filters.lessonTypes, "individual"]
                        : filters.lessonTypes.filter((t: string) => t !== "individual")
                      onFilterChange("lessonTypes", newTypes)
                    }}
                  />
                  <span>Individual lessons</span>
                </label>
                <label className={styles.checkboxOption}>
                  <input
                    type="checkbox"
                    checked={filters.lessonTypes.includes("group")}
                    onChange={(e) => {
                      const newTypes = e.target.checked
                        ? [...filters.lessonTypes, "group"]
                        : filters.lessonTypes.filter((t: string) => t !== "group")
                      onFilterChange("lessonTypes", newTypes)
                    }}
                  />
                  <span>Group lessons</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.advancedFilterFooter}>
          <button
            onClick={() => {
              // Clear all filters
              onFilterChange("priceRange", [3, 100])
              onFilterChange("availability", [])
              onFilterChange("specialties", [])
              onFilterChange("alsoSpeaks", [])
              onFilterChange("countries", [])
              onFilterChange("certifications", [])
              onFilterChange("experience", "any")
              onFilterChange("lessonTypes", [])
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
            <Link href="#" className={styles.navLink}>
              Corporate language training
            </Link>
            <Link href="/#become-tutor" className={styles.navLink}>
              Become a tutor
            </Link>
          </nav>
          <div className={styles.headerActions}>
            <div className={styles.dropdown}>
              <button className={styles.dropdownButton} aria-label="Language and currency selector">
                English, USD
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
            </div>
            <button className={styles.helpButton} aria-label="Help">
              <HelpCircle className="w-5 h-5" />
            </button>
            <Link href="/login" className={styles.loginButton}>
              Log In
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
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
  ]

  const quickPriceRanges = [
    { label: "$3 - $40+", value: [3, 40] as [number, number] },
    { label: "$5 - $15", value: [5, 15] as [number, number] },
    { label: "$15 - $25", value: [15, 25] as [number, number] },
    { label: "$25 - $40", value: [25, 40] as [number, number] },
    { label: "$40+", value: [40, 100] as [number, number] },
  ]

  const sortOptions = [
    "Our top picks",
    "Price: Low to high",
    "Price: High to low",
    "Most popular",
    "Best rated",
    "Most lessons",
  ]

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.availability.length > 0) count++
    if (filters.specialties.length > 0) count++
    if (filters.alsoSpeaks.length > 0) count++
    if (filters.countries.length > 0) count++
    if (filters.certifications.length > 0) count++
    if (filters.experience !== "any") count++
    if (filters.lessonTypes.length > 0) count++
    if (filters.priceRange[0] !== 3 || filters.priceRange[1] !== 100) count++
    return count
  }

  return (
    <div className={styles.filterSection}>
      <div className={styles.sectionContent}>
        {/* Main Filter Row */}
        <div className={styles.mainFilters}>
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

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Price per lesson</label>
            <select
              value={`${filters.priceRange[0]}-${filters.priceRange[1]}`}
              onChange={(e) => {
                const range = quickPriceRanges.find((r) => `${r.value[0]}-${r.value[1]}` === e.target.value)
                if (range) onFilterChange("priceRange", range.value)
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

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Availability</label>
            <button
              onClick={onOpenAdvancedFilters}
              className={`${styles.filterSelect} ${styles.filterButton} ${filters.availability.length > 0 ? styles.hasSelection : ""}`}
              aria-label="Select availability"
            >
              {filters.availability.length === 0
                ? "Any time"
                : filters.availability.length === 1
                  ? filters.availability[0]
                  : `${filters.availability.length} selected`}
              <ChevronDown className="w-4 h-4 ml-auto" />
            </button>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Advanced Filters</label>
            <button
              onClick={onOpenAdvancedFilters}
              className={`${styles.filterSelect} ${styles.filterButton} ${getActiveFiltersCount() > 0 ? styles.hasSelection : ""}`}
              aria-label="Open advanced filters"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              {getActiveFiltersCount() > 0 ? `${getActiveFiltersCount()} active` : "More filters"}
            </button>
          </div>
        </div>

        {/* Secondary Filter Row */}
        <div className={styles.secondaryFilters}>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange("sortBy", e.target.value)}
            className={styles.secondarySelect}
            aria-label="Sort results by"
          >
            {sortOptions.map((option) => (
              <option key={option} value={option}>
                Sort by: {option}
              </option>
            ))}
          </select>

          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by name or keyword"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={styles.searchInput}
              aria-label="Search tutors"
            />
          </div>
        </div>

        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <div className={styles.activeFilters}>
            <span className={styles.activeFiltersLabel}>Active filters:</span>
            <div className={styles.activeFilterTags}>
              {filters.priceRange[0] !== 3 || filters.priceRange[1] !== 100 ? (
                <span className={styles.activeFilterTag}>
                  ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  <button onClick={() => onFilterChange("priceRange", [3, 100])} aria-label="Remove price filter">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ) : null}

              {filters.availability.map((item: string) => (
                <span key={item} className={styles.activeFilterTag}>
                  {item}
                  <button
                    onClick={() =>
                      onFilterChange(
                        "availability",
                        filters.availability.filter((a: string) => a !== item),
                      )
                    }
                    aria-label={`Remove ${item} filter`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {filters.specialties.map((item: string) => (
                <span key={item} className={styles.activeFilterTag}>
                  {item}
                  <button
                    onClick={() =>
                      onFilterChange(
                        "specialties",
                        filters.specialties.filter((s: string) => s !== item),
                      )
                    }
                    aria-label={`Remove ${item} filter`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <button
                onClick={() => {
                  onFilterChange("priceRange", [3, 100])
                  onFilterChange("availability", [])
                  onFilterChange("specialties", [])
                  onFilterChange("alsoSpeaks", [])
                  onFilterChange("countries", [])
                  onFilterChange("certifications", [])
                  onFilterChange("experience", "any")
                  onFilterChange("lessonTypes", [])
                }}
                className={styles.clearAllFiltersButton}
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
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
    subject: "English",
    priceRange: [3, 100],
    availability: [],
    specialties: [],
    alsoSpeaks: [],
    countries: [],
    certifications: [],
    experience: "any",
    lessonTypes: [],
    sortBy: "Our top picks",
  })

  // Mock tutor data
  const [tutors] = useState<Tutor[]>([
    {
      id: 1,
      name: "Larry B.",
      flag: "🇺🇸",
      nativeFlag: "🇮🇹",
      isNative: true,
      subject: "English",
      rating: 5,
      reviews: 18,
      price: 15,
      activeStudents: 23,
      totalLessons: 263,
      languages: ["English (Proficient)", "Italian (Native)", "+4"],
      description:
        "Cambridge-Certified/ British School International Tutor with many years of experience — Hi! I'm a full-time English tutor with a CELTA certification",
      isProfessional: true,
      isSuperTutor: true,
      isOnline: true,
      hasVideo: true,
      image: "/placeholder.svg?height=120&width=120",
    },
    {
      id: 2,
      name: "Oumaima H.",
      flag: "🇲🇦",
      nativeFlag: "",
      isNative: false,
      subject: "English",
      rating: 5,
      reviews: 44,
      price: 20,
      activeStudents: 34,
      totalLessons: 4808,
      languages: ["English (Proficient)", "Urdu (Advanced)", "+6"],
      description:
        "ESL certified tutor with 4 years of experience — Hello preply people! Greetings from Morocco! My name is Oumaima. I'm 27 years old. I'm a TEFL",
      isProfessional: false,
      isSuperTutor: false,
      isOnline: false,
      hasVideo: false,
      image: "/placeholder.svg?height=120&width=120",
    },
    // Add more tutors as needed...
  ])

  const [filteredTutors, setFilteredTutors] = useState<Tutor[]>(tutors)

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  // Filter tutors based on search and filters
  useEffect(() => {
    let filtered = tutors

    // Apply sophisticated filtering logic here
    if (searchQuery) {
      filtered = filtered.filter(
        (tutor) =>
          tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tutor.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Price range filter
    filtered = filtered.filter((tutor) => tutor.price >= filters.priceRange[0] && tutor.price <= filters.priceRange[1])

    // Add more filtering logic based on other filters...

    setFilteredTutors(filtered)
  }, [searchQuery, filters, tutors])

  return (
    <div className={styles.container}>
      <Header />

      {/* Page Title */}
      <section className={styles.titleSection}>
        <div className={styles.sectionContent}>
          <h1 className={styles.pageTitle}>Online English tutors & teachers for private classes</h1>
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
            {filteredTutors.length.toLocaleString()} English teachers that match your needs
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
