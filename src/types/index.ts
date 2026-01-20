// Property types for JSON data
export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  propertyType: string;
  roomType: string;
  bhk: number | null;
  bedsPerRoom: number;
  roomSize: string;
  status: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  landmark: string;
  nearbyColleges: string[];
  distanceFromCollege: string;
  totalBeds: number;
  availableBeds: number;
  totalRooms: number;
  bathrooms: number;
  floorNumber: number;
  totalFloors: number;
  rent: number;
  deposit: number;
  maintenanceCharges: number;
  electricityCharges: string;
  waterCharges: string;
  foodCharges: number | null;
  foodIncluded: boolean;
  mealsPerDay: number;
  genderPreference: string;
  occupancyType: string;
  furnishing: string;
  furnishingDetails: string[];
  nonVegAllowed: boolean;
  smokingAllowed: boolean;
  drinkingAllowed: boolean;
  petsAllowed: boolean;
  visitorsAllowed: boolean;
  oppositeSexAllowed: boolean;
  gateClosingTime: string | null;
  availableFrom: string;
  minimumStay: number;
  noticePeriod: number;
  isVerified: boolean;
  isFeatured: boolean;
  viewCount: number;
  images: PropertyImage[];
  amenities: string[];
  averageRating: number;
  reviewCount: number;
  owner: PropertyOwner;
}

export interface PropertyImage {
  url: string;
  isPrimary: boolean;
  caption: string;
}

export interface PropertyOwner {
  id: string;
  name: string;
  image: string;
  phone: string;
  responseRate: number;
  responseTime: number;
  isVerified: boolean;
}

// Property card for listings
export interface PropertyCard {
  id: string;
  title: string;
  slug: string;
  propertyType: string;
  rent: number;
  deposit: number;
  city: string;
  address: string;
  genderPreference: string;
  furnishing: string;
  availableBeds: number;
  totalBeds: number;
  isVerified: boolean;
  isFeatured: boolean;
  images: { url: string; isPrimary: boolean }[];
  averageRating?: number;
  reviewCount?: number;
  distance?: number;
  latitude?: number | null;
  longitude?: number | null;
}

// Search filters
export interface SearchFilters {
  query?: string;
  city?: string;
  propertyType?: string[];
  minRent?: number;
  maxRent?: number;
  gender?: string;
  furnishing?: string[];
  amenities?: string[];
  occupancyType?: string;
  nearCollege?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  sortBy?: "relevance" | "price_low" | "price_high" | "newest" | "rating";
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// User type for local JSON data
export interface User {
  id: string;
  name: string;
  email?: string;
  image?: string;
  phone?: string;
}

// Student Profile
export interface StudentProfile {
  id: string;
  userId: string;
  college?: string;
  course?: string;
  year?: number;
}

// Landlord Profile
export interface LandlordProfile {
  id: string;
  userId: string;
  companyName?: string;
  verified: boolean;
}

// User profiles
export interface UserWithProfile extends User {
  studentProfile?: StudentProfile | null;
  landlordProfile?: LandlordProfile | null;
}

// Conversation
export interface ConversationWithParticipants {
  id: string;
  propertyId?: string;
  participants: {
    user: Pick<User, "id" | "name" | "image">;
    lastReadAt?: Date;
  }[];
  messages: MessageWithSender[];
  updatedAt: Date;
}

export interface MessageWithSender {
  id: string;
  content: string;
  senderId: string;
  sender: Pick<User, "id" | "name" | "image">;
  createdAt: Date;
  isRead: boolean;
}

// Dashboard stats
export interface LandlordDashboardStats {
  totalProperties: number;
  activeListings: number;
  totalViews: number;
  totalInquiries: number;
  pendingVisits: number;
  averageRating: number;
  totalReviews: number;
  recentInquiries: InquiryPreview[];
  propertyPerformance: PropertyPerformance[];
}

export interface PropertyPerformance {
  id: string;
  title: string;
  views: number;
  inquiries: number;
  favorites: number;
  status: string;
}

export interface InquiryPreview {
  id: string;
  property: { title: string };
  user: { name: string; image?: string };
  message: string;
  createdAt: Date;
}

// Student dashboard
export interface StudentDashboardStats {
  savedProperties: number;
  recentlyViewed: number;
  activeApplications: number;
  scheduledVisits: number;
  wishlist: PropertyCard[];
  recommendations: PropertyCard[];
}

// Admin dashboard
export interface AdminDashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalLandlords: number;
  totalProperties: number;
  activeListings: number;
  pendingVerifications: number;
  pendingReports: number;
  recentActivity: ActivityPreview[];
  userGrowth: GrowthData[];
  propertyGrowth: GrowthData[];
}

export interface ActivityPreview {
  id: string;
  action: string;
  user: { name: string };
  entity?: string;
  createdAt: Date;
}

export interface GrowthData {
  date: string;
  count: number;
}

// Map types
export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  rent: number;
  type: string;
}

// Notification types
export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: Date;
}

// Form states
export interface FormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error?: string;
}

// Upload types
export interface UploadedFile {
  url: string;
  name: string;
  size: number;
  type: string;
}

// Comparison
export interface ComparisonProperty {
  id: string;
  title: string;
  rent: number;
  deposit: number;
  propertyType: string;
  furnishing: string;
  amenities: string[];
  rating: number;
  image: string;
}
