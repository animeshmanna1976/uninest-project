import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(date);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateSlug(title: string): string {
  const slug = slugify(title);
  const uniqueId = Math.random().toString(36).substring(2, 8);
  return `${slug}-${uniqueId}`;
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function formatDistance(distanceInKm: number): string {
  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)}m`;
  }
  return `${distanceInKm.toFixed(1)}km`;
}

export function getPropertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    PG: "PG",
    HOSTEL: "Hostel",
    FLAT: "Flat",
    APARTMENT: "Apartment",
    ROOM: "Single Room",
    SHARED_ROOM: "Shared Room",
    HOUSE: "House",
    VILLA: "Villa",
  };
  return labels[type] || type;
}

export function getFurnishingLabel(type: string): string {
  const labels: Record<string, string> = {
    FULLY_FURNISHED: "Fully Furnished",
    SEMI_FURNISHED: "Semi Furnished",
    UNFURNISHED: "Unfurnished",
  };
  return labels[type] || type;
}

export function getGenderLabel(gender: string): string {
  const labels: Record<string, string> = {
    MALE: "Boys Only",
    FEMALE: "Girls Only",
    OTHER: "Any Gender",
    ANY: "Any Gender",
  };
  return labels[gender] || "Any Gender";
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
}

export function maskEmail(email: string): string {
  const [username, domain] = email.split("@");
  const maskedUsername =
    username.substring(0, 2) + "*".repeat(username.length - 2);
  return `${maskedUsername}@${domain}`;
}

export function maskPhone(phone: string): string {
  return phone.substring(0, 2) + "*".repeat(6) + phone.substring(8);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred";
}

export const propertyTypes = [
  { value: "PG", label: "PG" },
  { value: "HOSTEL", label: "Hostel" },
  { value: "FLAT", label: "Flat" },
  { value: "APARTMENT", label: "Apartment" },
  { value: "ROOM", label: "Single Room" },
  { value: "SHARED_ROOM", label: "Shared Room" },
  { value: "HOUSE", label: "House" },
  { value: "VILLA", label: "Villa" },
];

export const furnishingTypes = [
  { value: "FULLY_FURNISHED", label: "Fully Furnished" },
  { value: "SEMI_FURNISHED", label: "Semi Furnished" },
  { value: "UNFURNISHED", label: "Unfurnished" },
];

export const genderOptions = [
  { value: "ANY", label: "Any Gender" },
  { value: "MALE", label: "Boys Only" },
  { value: "FEMALE", label: "Girls Only" },
];

export const occupancyTypes = [
  { value: "single", label: "Single Occupancy" },
  { value: "double", label: "Double Sharing" },
  { value: "triple", label: "Triple Sharing" },
  { value: "any", label: "Any" },
];
