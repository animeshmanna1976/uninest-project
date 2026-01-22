// User roles
export type UserRole = "student" | "landlord";

// User interface for MongoDB
export interface User {
  _id?: string;
  id: string;
  email: string;
  password: string; // hashed
  name: string;
  phone?: string;
  image?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Student profile
export interface StudentProfile {
  userId: string;
  college?: string;
  course?: string;
  year?: number;
  city?: string;
  bio?: string;
}

// Landlord profile
export interface LandlordProfile {
  userId: string;
  companyName?: string;
  address?: string;
  city?: string;
  isVerified: boolean;
  totalProperties: number;
  responseRate: number;
  responseTime: number; // in minutes
}

// Auth request/response types
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: SafeUser;
  token?: string;
}

// Safe user (without password)
export interface SafeUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  image?: string;
  role: UserRole;
  createdAt: Date;
}

// Session/Token payload
export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  exp: number;
}

// Property listing by landlord
export interface PropertyListing {
  id: string;
  landlordId: string;
  title: string;
  slug: string;
  description: string;
  propertyType: "PG" | "HOSTEL" | "FLAT" | "ROOM";
  roomType: "private" | "sharing" | "entire";
  bhk?: number | null;
  bedsPerRoom: number;
  roomSize: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "REJECTED";
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  landmark?: string;
  nearbyColleges: string[];
  distanceFromCollege?: string;
  totalBeds: number;
  availableBeds: number;
  totalRooms: number;
  bathrooms: number;
  floorNumber?: number;
  totalFloors?: number;
  rent: number;
  deposit: number;
  maintenanceCharges?: number;
  electricityCharges: "included" | "separate";
  waterCharges: "included" | "separate";
  foodCharges?: number | null;
  foodIncluded: boolean;
  mealsPerDay?: number;
  genderPreference: "MALE" | "FEMALE" | "ANY";
  occupancyType: "single" | "double" | "triple" | "quadruple" | "any";
  furnishing: "FULLY_FURNISHED" | "SEMI_FURNISHED" | "UNFURNISHED";
  furnishingDetails: string[];
  amenities: string[];
  rules: {
    nonVegAllowed: boolean;
    smokingAllowed: boolean;
    drinkingAllowed: boolean;
    petsAllowed: boolean;
    visitorsAllowed: boolean;
    oppositeSexAllowed: boolean;
    gateClosingTime?: string | null;
  };
  images: { url: string; isPrimary: boolean; caption?: string }[];
  availableFrom: string;
  minimumStay: number;
  noticePeriod: number;
  isVerified: boolean;
  isFeatured: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Inquiry from students
export interface PropertyInquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  landlordId: string;
  message: string;
  status: "pending" | "contacted" | "visited" | "closed";
  createdAt: Date;
  updatedAt: Date;
}
