// User Types
export interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Trip Types
export interface Trip {
  id: string;
  title: string;
  description?: string;
  destination: string;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  status: TripStatus;
  userId: string;
  activities: Activity[];
  chatSessions: ChatSession[];
  createdAt: Date;
  updatedAt: Date;
}

export enum TripStatus {
  PLANNING = 'PLANNING',
  BOOKED = 'BOOKED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

// Activity Types
export interface Activity {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startTime?: Date;
  endTime?: Date;
  cost?: number;
  type: ActivityType;
  dayNumber: number;
  tripId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ActivityType {
  SIGHTSEEING = 'SIGHTSEEING',
  RESTAURANT = 'RESTAURANT',
  TRANSPORT = 'TRANSPORT',
  ACCOMMODATION = 'ACCOMMODATION',
  ENTERTAINMENT = 'ENTERTAINMENT',
  SHOPPING = 'SHOPPING',
  RELAXATION = 'RELAXATION',
  ADVENTURE = 'ADVENTURE',
  CULTURE = 'CULTURE',
  OTHER = 'OTHER'
}

// Chat Types
export interface ChatSession {
  id: string;
  title?: string;
  userId: string;
  tripId?: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  content: string;
  role: MessageRole;
  chatSessionId: string;
  createdAt: Date;
}

export enum MessageRole {
  USER = 'USER',
  ASSISTANT = 'ASSISTANT',
  SYSTEM = 'SYSTEM'
}

// AI Response Types
export interface AIResponse {
  content: string;
  suggestions?: string[];
  tripData?: Partial<Trip>;
  activities?: Partial<Activity>[];
}

export interface ChatRequest {
  message: string;
  sessionId?: string;
  tripId?: string;
  context?: {
    userPreferences?: UserPreferences;
    currentTrip?: Partial<Trip>;
  };
}

export interface UserPreferences {
  budget?: number;
  travelStyle?: 'budget' | 'comfort' | 'luxury';
  interests?: string[];
  duration?: number;
  season?: 'spring' | 'summer' | 'autumn' | 'winter';
  groupSize?: number;
  accessibility?: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface CreateTripForm {
  title: string;
  destination: string;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  description?: string;
}

export interface UpdateTripForm extends Partial<CreateTripForm> {
  status?: TripStatus;
}

export interface CreateActivityForm {
  title: string;
  description?: string;
  location?: string;
  startTime?: Date;
  endTime?: Date;
  cost?: number;
  type: ActivityType;
  dayNumber: number;
}

// Search & Filter Types
export interface TripFilters {
  status?: TripStatus;
  destination?: string;
  startDate?: Date;
  endDate?: Date;
  budgetMin?: number;
  budgetMax?: number;
}

export interface SearchParams {
  query?: string;
  filters?: TripFilters;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'startDate' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// UI State Types
export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error?: string;
}

export interface TripState {
  trips: Trip[];
  currentTrip?: Trip;
  isLoading: boolean;
  error?: string;
}

export interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  language: 'de' | 'en';
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

// Weather & Location Types
export interface WeatherInfo {
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export interface LocationInfo {
  name: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  timezone: string;
  currency: string;
  language: string[];
}

// Budget & Cost Types
export interface BudgetBreakdown {
  accommodation: number;
  transportation: number;
  food: number;
  activities: number;
  shopping: number;
  other: number;
  total: number;
}

export interface CostEstimate {
  min: number;
  max: number;
  average: number;
  currency: string;
  breakdown: BudgetBreakdown;
} 