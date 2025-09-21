export interface Booking {
  id: string
  fieldName: string
  date: string
  time: string
  duration: number
  amount: number
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  paymentStatus: 'paid' | 'pending' | 'failed'
  bookingType: 'training' | 'match' | 'tournament' | 'casual'
}

export interface BookingDetails {
  _id: string
  field: Field
  date_requested: string
  time: string
  duration: number
  amount: number
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  payment_status: 'paid' | 'pending' | 'failed'
  booking_type: 'training' | 'match' | 'tournament' | 'casual'
  client?: UserProfile
}

export interface Activity {
  id: string
  type: 'booking' | 'payment' | 'cancellation' | 'review' | 'profile_update'
  description: string
  date: string
  status: 'success' | 'pending' | 'failed'
  amount?: number
}

export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  memberSince: string
  totalBookings: number
  totalSpent: number
  favoriteField: string
  avatar?: string
}

export interface UserType {
    _id: string;
    first_name: string;
    second_name: string;
    email: string;
    phone_number: string;
    date_of_birth: string;
    passwordResetCode?: string;
    password?: string;
    role?: 'Client' | 'Coach' | 'Admin';
    team_id?: string;
    profile_status?: 'Pending' | 'Completed';
    status?: string;
    coaching_notes?: Array<{
        note: string;
        createdAt: Date;
        postedBy: string;
    }>;
    createdAt?: Date;
    updatedAt?: Date;
}



export interface Payment {
  _id: string
  services: any[] // Array of services included in the payment
  booking_id: BookingDetails // Reference to Booking model
  final_amount_invoiced: number // Required final amount
  amount?: number // Alias for amountPaid - commonly used in frontend
  amountPaid?: number // Amount actually paid
  status?: 'pending' | 'completed' | 'failed' // Alias for payment_status - commonly used
  payment_method?: string // Payment method used (e.g., "Card", "Mobile Money", "Cash")
  payment_reference?: string // Transaction reference number
  payment_date?: string // Date when payment was made
  payment_status: 'Pending' | 'Completed' | 'Failed' // Payment status
  notes?: string // Additional notes about the payment
  vat?: number // VAT amount if applicable
  paymentType?: string // Type of payment (e.g., "Full", "Partial", "Deposit")
  phoneNumber?: string // Phone number for mobile payments
  currency?: string // Currency code (e.g., "KES", "USD")
  paymentLink?: string // Link to payment gateway
  receipt_pdf?: string // URL or path to receipt PDF
  postedBy?: UserProfile // Reference to User who created the payment
  
  // Populated fields when using with Mongoose populate
  booking?: {
    _id: string
    field?: {
      _id: string
      name: string
    }
    date_requested: string
    time: string
    duration: number
    status: string
  }
  
  // Timestamps from mongoose
  createdAt: string
  updatedAt: string
}

export interface TeamTypes {
  _id?: string
  name: string
  logo?: string
  matches?: MatchTypes[]
  members?: UserType[]
  points?: number
  coach?: UserType
  captain?: UserType
  status?: string

  achievements?: [{
    title: string,
    description: string,
    date: Date
  }],

  postedBy?: string
  editedBy?: UserType

  // Timestamps from mongoose
  createdAt?: string
  updatedAt?: string
}

export interface MatchTypes {
  _id?: string
  date: string
  time: string
  homeTeam: string | TeamTypes  // Can be ObjectId string or populated Team object
  awayTeam: string | TeamTypes  // Can be ObjectId string or populated Team object
  venue: string
  status?: string  // Changed to match schema default 'inactive'
  score?: {
    home: number
    away: number
  }
  postedBy: string | UserType  // Can be ObjectId string or populated User object
  editedBy?: string | UserType  // Optional, can be ObjectId string or populated User object
  // Timestamps from mongoose
  createdAt?: string
  updatedAt?: string
}

export interface League {
  id: string
  name: string
  description: string
  season: string
  status: 'active' | 'upcoming' | 'finished'
  teams: number
  matches: number
  prize?: string // Keep for backward compatibility
  startDate: string
  endDate: string
  prizePool: number
  registrationFee: number
  category: string
  level: string
  color: string
  isActive?: boolean
}

// Interface for team standings data
export interface StandingsTeam {
  id: string
  name: string
  played: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  points: number
  form: string[] // Array of 'W', 'D', 'L' results
}

// Interface for fixture/match data
export interface FixtureMatch {
  id: string
  homeTeam: string
  awayTeam: string
  date: string
  time: string
  venue: string
  status: 'upcoming' | 'live' | 'finished'
}

// Interface for league statistics
export interface LeagueStats {
  activeLeagues: number
  registeredTeams: number
  matchesPlayed: number
  totalPrizePool: string
}

export interface Field {
  // Basic Information
  _id: string
  name: string
  description: string
  
  // Pricing
  price_per_hour: number
  peak_hour_price?: number
  weekend_price?: number
  
  // Availability and Status
  status: 'active' | 'maintenance' | 'inactive' | 'under_construction'
  isAvailable: boolean
  
  // Operating Hours
  operatingHours?: {
    monday: { open: string; close: string; closed: boolean }
    tuesday: { open: string; close: string; closed: boolean }
    wednesday: { open: string; close: string; closed: boolean }
    thursday: { open: string; close: string; closed: boolean }
    friday: { open: string; close: string; closed: boolean }
    saturday: { open: string; close: string; closed: boolean }
    sunday: { open: string; close: string; closed: boolean }
  }
  
  // Booking Rules
  bookingRules?: {
    minBookingDuration: number
    maxBookingDuration: number
    advanceBookingDays: number
    cancellationHours: number
    requiresDeposit: boolean
    depositPercentage: number
  }
  
  // Maintenance and History
  lastMaintenance?: string
  nextMaintenance?: string
  maintenanceNotes?: Array<{
    date: string
    description: string
    cost?: number
    performedBy?: string
  }>
  
  // Statistics
  statistics?: {
    totalBookings: number
    totalRevenue: number
    averageRating: number
    utilizationRate: number
  }
  
  // Management
  postedBy?: string
  managedBy?: string[]
  
  // Settings
  settings?: {
    allowOnlineBooking: boolean
    requireApproval: boolean
    sendConfirmationEmail: boolean
    sendReminderEmail: boolean
    reminderHours: number
  }
  
  // Legacy/Computed properties for backward compatibility
  capacity?: number
  features?: string[]
  priceMultiplier?: number
}

