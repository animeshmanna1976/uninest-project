import { z } from "zod";

// Auth Schemas
export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    role: z.enum(["STUDENT", "LANDLORD"]),
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Invalid phone number")
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Student Profile Schema
export const studentProfileSchema = z.object({
  studentId: z.string().optional(),
  collegeName: z.string().min(2, "College name is required"),
  course: z.string().optional(),
  yearOfStudy: z.number().min(1).max(6).optional(),
  graduationYear: z.number().min(2024).max(2035).optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  dateOfBirth: z.date().optional(),
  preferredAreas: z.array(z.string()).optional(),
  budgetMin: z.number().min(0).optional(),
  budgetMax: z.number().min(0).optional(),
  moveInDate: z.date().optional(),
  emergencyName: z.string().optional(),
  emergencyPhone: z.string().optional(),
  emergencyRelation: z.string().optional(),
});

// Landlord Profile Schema
export const landlordProfileSchema = z.object({
  businessName: z.string().optional(),
  businessType: z.enum(["individual", "company", "agent"]),
  gstNumber: z.string().optional(),
  panNumber: z.string().optional(),
  autoReply: z.boolean().default(false),
  autoReplyMessage: z.string().optional(),
});

// Property Schema
export const propertySchema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(100, "Title too long"),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(2000, "Description too long"),
  propertyType: z.enum([
    "PG",
    "HOSTEL",
    "FLAT",
    "APARTMENT",
    "ROOM",
    "SHARED_ROOM",
    "HOUSE",
    "VILLA",
  ]),

  // Location
  address: z.string().min(10, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  landmark: z.string().optional(),
  nearbyColleges: z.array(z.string()).optional(),

  // Property Details
  totalBeds: z.number().min(1, "At least 1 bed required"),
  availableBeds: z.number().min(0),
  totalRooms: z.number().min(1),
  bathrooms: z.number().min(1),
  floorNumber: z.number().optional(),
  totalFloors: z.number().optional(),
  propertyAge: z.number().optional(),
  carpetArea: z.number().optional(),

  // Pricing
  rent: z.number().min(100, "Rent must be at least ₹100"),
  deposit: z.number().min(0),
  maintenanceCharges: z.number().min(0).default(0),
  electricityCharges: z
    .enum(["included", "separate", "shared"])
    .default("separate"),
  waterCharges: z.enum(["included", "separate", "shared"]).default("included"),
  otherCharges: z.number().min(0).default(0),
  otherChargesDetails: z.string().optional(),

  // Preferences
  genderPreference: z.enum(["MALE", "FEMALE", "OTHER", "ANY"]).default("ANY"),
  occupancyType: z.string().default("any"),
  preferredTenants: z.array(z.string()).optional(),

  // Furnishing
  furnishing: z
    .enum(["FULLY_FURNISHED", "SEMI_FURNISHED", "UNFURNISHED"])
    .default("SEMI_FURNISHED"),

  // House Rules
  nonVegAllowed: z.boolean().default(true),
  smokingAllowed: z.boolean().default(false),
  drinkingAllowed: z.boolean().default(false),
  petsAllowed: z.boolean().default(false),
  visitorsAllowed: z.boolean().default(true),
  gateClosingTime: z.string().optional(),
  additionalRules: z.array(z.string()).optional(),

  // Availability
  availableFrom: z.date(),
  minimumStay: z.number().min(1).default(1),
  noticePeriod: z.number().min(1).default(1),

  // Amenities
  amenityIds: z.array(z.string()).optional(),
});

// Review Schema
export const reviewSchema = z.object({
  propertyId: z.string(),
  overallRating: z.number().min(1).max(5),
  cleanlinessRating: z.number().min(1).max(5).optional(),
  locationRating: z.number().min(1).max(5).optional(),
  valueRating: z.number().min(1).max(5).optional(),
  ownerRating: z.number().min(1).max(5).optional(),
  safetyRating: z.number().min(1).max(5).optional(),
  amenitiesRating: z.number().min(1).max(5).optional(),
  title: z.string().max(100).optional(),
  content: z
    .string()
    .min(20, "Review must be at least 20 characters")
    .max(1000),
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),
  stayDuration: z.number().optional(),
  stayPeriod: z.string().optional(),
});

// Message Schema
export const messageSchema = z.object({
  receiverId: z.string(),
  content: z.string().min(1, "Message cannot be empty").max(1000),
  propertyId: z.string().optional(),
});

// Visit Request Schema
export const visitRequestSchema = z.object({
  propertyId: z.string(),
  preferredDate: z.date(),
  preferredTime: z.string(),
  alternateDate: z.date().optional(),
  alternateTime: z.string().optional(),
  visitorMessage: z.string().max(500).optional(),
});

// Search Schema
export const searchSchema = z.object({
  query: z.string().optional(),
  city: z.string().optional(),
  propertyType: z.array(z.string()).optional(),
  minRent: z.number().optional(),
  maxRent: z.number().optional(),
  gender: z.enum(["MALE", "FEMALE", "ANY"]).optional(),
  furnishing: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  occupancyType: z.string().optional(),
  nearCollege: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  radius: z.number().optional(), // in km
  sortBy: z
    .enum(["relevance", "price_low", "price_high", "newest", "rating"])
    .optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(20),
});

// Roommate Profile Schema
export const roommateProfileSchema = z.object({
  isLookingForRoommate: z.boolean(),
  hasProperty: z.boolean().default(false),
  propertyDetails: z.string().optional(),
  bio: z.string().max(500).optional(),
  interests: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  occupation: z.string().optional(),
  preferredGender: z.enum(["MALE", "FEMALE", "OTHER", "ANY"]).default("ANY"),
  preferredAgeMin: z.number().min(18).optional(),
  preferredAgeMax: z.number().max(50).optional(),
  preferredBudget: z.number().optional(),
  preferredArea: z.string().optional(),
});

// Report Schema
export const reportSchema = z.object({
  type: z.enum([
    "FAKE_LISTING",
    "MISLEADING_INFO",
    "INAPPROPRIATE_CONTENT",
    "SCAM",
    "HARASSMENT",
    "SPAM",
    "OTHER",
  ]),
  propertyId: z.string().optional(),
  reportedUserId: z.string().optional(),
  reason: z.string().min(20, "Please provide more details").max(1000),
  evidence: z.array(z.string()).optional(),
});

// Contact Schema
export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(20).max(1000),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type StudentProfileInput = z.infer<typeof studentProfileSchema>;
export type LandlordProfileInput = z.infer<typeof landlordProfileSchema>;
export type PropertyInput = z.infer<typeof propertySchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
export type VisitRequestInput = z.infer<typeof visitRequestSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type RoommateProfileInput = z.infer<typeof roommateProfileSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
