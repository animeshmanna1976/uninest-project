"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Home,
  ArrowLeft,
  Loader2,
  Building2,
  MapPin,
  IndianRupee,
  Bed,
  Bath,
  Users,
  Wifi,
  Car,
  Shield,
  Utensils,
  Shirt,
  Tv,
  Wind,
  Droplets,
  Dumbbell,
  ImagePlus,
  X,
  Check,
} from "lucide-react";

const PROPERTY_TYPES = [
  { value: "PG", label: "Paying Guest (PG)" },
  { value: "HOSTEL", label: "Hostel" },
  { value: "FLAT", label: "Flat/Apartment" },
  { value: "ROOM", label: "Single Room" },
];

const FURNISHING_OPTIONS = [
  { value: "FULLY_FURNISHED", label: "Fully Furnished" },
  { value: "SEMI_FURNISHED", label: "Semi Furnished" },
  { value: "UNFURNISHED", label: "Unfurnished" },
];

const GENDER_OPTIONS = [
  { value: "MALE", label: "Boys Only" },
  { value: "FEMALE", label: "Girls Only" },
  { value: "ANY", label: "Any Gender" },
];

const OCCUPANCY_OPTIONS = [
  { value: "single", label: "Single" },
  { value: "double", label: "Double Sharing" },
  { value: "triple", label: "Triple Sharing" },
  { value: "quadruple", label: "Four Sharing" },
  { value: "any", label: "Any" },
];

const AMENITIES = [
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "parking", label: "Parking", icon: Car },
  { id: "security", label: "24/7 Security", icon: Shield },
  { id: "mess", label: "Mess/Food", icon: Utensils },
  { id: "laundry", label: "Laundry", icon: Shirt },
  { id: "tv", label: "TV", icon: Tv },
  { id: "ac", label: "AC", icon: Wind },
  { id: "geyser", label: "Geyser", icon: Droplets },
  { id: "gym", label: "Gym", icon: Dumbbell },
  { id: "power_backup", label: "Power Backup", icon: Shield },
  { id: "water_purifier", label: "Water Purifier", icon: Droplets },
  { id: "cctv", label: "CCTV", icon: Shield },
];

export default function AddPropertyPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Basic Info
    title: "",
    description: "",
    propertyType: "",
    roomType: "sharing",
    bhk: "",

    // Location
    address: "",
    city: "",
    state: "West Bengal",
    pincode: "",
    landmark: "",
    latitude: "",
    longitude: "",
    nearbyColleges: "",

    // Room Details
    totalRooms: "",
    totalBeds: "",
    availableBeds: "",
    bedsPerRoom: "",
    roomSize: "",
    bathrooms: "",
    floorNumber: "",
    totalFloors: "",

    // Pricing
    rent: "",
    deposit: "",
    maintenanceCharges: "",
    electricityCharges: "separate",
    waterCharges: "included",
    foodIncluded: false,
    foodCharges: "",
    mealsPerDay: "",

    // Preferences
    genderPreference: "",
    occupancyType: "double",
    furnishing: "",

    // Rules
    nonVegAllowed: true,
    smokingAllowed: false,
    drinkingAllowed: false,
    petsAllowed: false,
    visitorsAllowed: true,
    oppositeSexAllowed: false,
    gateClosingTime: "",

    // Other
    amenities: [] as string[],
    furnishingDetails: "",
    availableFrom: "",
    minimumStay: "6",
    noticePeriod: "1",
    images: [] as string[],
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    } else if (!authLoading && user?.role !== "landlord") {
      router.push("/dashboard/student");
    }
  }, [authLoading, isAuthenticated, user, router]);

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenityId: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((a) => a !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Ensure user is logged in and is a landlord
    if (!user?.id) {
      setError("You must be logged in to add a property");
      return;
    }

    if (user.role !== "landlord") {
      setError(
        "Only landlords can add properties. Please register as a landlord.",
      );
      return;
    }
    setIsSubmitting(true);

    try {
      // Create slug from title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const propertyData = {
        ...formData,
        slug: `${slug}-${Date.now()}`,
        landlordId: user?.id,
        bhk: formData.bhk ? parseInt(formData.bhk) : null,
        totalRooms: parseInt(formData.totalRooms) || 1,
        totalBeds: parseInt(formData.totalBeds) || 1,
        availableBeds: parseInt(formData.availableBeds) || 1,
        bedsPerRoom: parseInt(formData.bedsPerRoom) || 1,
        bathrooms: parseInt(formData.bathrooms) || 1,
        floorNumber: parseInt(formData.floorNumber) || 1,
        totalFloors: parseInt(formData.totalFloors) || 1,
        rent: parseInt(formData.rent) || 0,
        deposit: parseInt(formData.deposit) || 0,
        maintenanceCharges: parseInt(formData.maintenanceCharges) || 0,
        foodCharges: formData.foodIncluded
          ? parseInt(formData.foodCharges) || 0
          : null,
        mealsPerDay: formData.foodIncluded
          ? parseInt(formData.mealsPerDay) || 0
          : 0,
        latitude: parseFloat(formData.latitude) || 22.5,
        longitude: parseFloat(formData.longitude) || 88.4,
        minimumStay: parseInt(formData.minimumStay) || 6,
        noticePeriod: parseInt(formData.noticePeriod) || 1,
        nearbyColleges: formData.nearbyColleges
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        furnishingDetails: formData.furnishingDetails
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
        images:
          formData.images.length > 0
            ? formData.images.map((url, i) => ({
                url,
                isPrimary: i === 0,
                caption: "",
              }))
            : [
                {
                  url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
                  isPrimary: true,
                  caption: "Property",
                },
              ],
        rules: {
          nonVegAllowed: formData.nonVegAllowed,
          smokingAllowed: formData.smokingAllowed,
          drinkingAllowed: formData.drinkingAllowed,
          petsAllowed: formData.petsAllowed,
          visitorsAllowed: formData.visitorsAllowed,
          oppositeSexAllowed: formData.oppositeSexAllowed,
          gateClosingTime: formData.gateClosingTime || null,
        },
        status: "ACTIVE",
        isVerified: false,
        isFeatured: false,
        viewCount: 0,
      };

      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(propertyData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/landlord/properties");
        }, 2000);
      } else {
        setError(data.message || "Failed to add property");
      }
    } catch (err) {
      console.error("Error adding property:", err);
      setError("Failed to add property. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addImageUrl = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, url],
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Property Added!</h2>
            <p className="text-muted-foreground mb-4">
              Your property has been successfully listed. Redirecting to your
              properties...
            </p>
            <Loader2 className="h-5 w-5 animate-spin mx-auto text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background border-b">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/landlord">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Add New Property</h1>
              <p className="text-sm text-muted-foreground">
                Fill in the details to list your property
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="container py-8 max-w-4xl">
        {error && (
          <div className="mb-6 p-4 text-sm text-red-500 bg-red-50 dark:bg-red-950/50 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Provide basic details about your property
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Property Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Boys PG Near Heritage Institute"
                  value={formData.title}
                  onChange={(e) => updateFormData("title", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your property, facilities, nearby locations..."
                  value={formData.description}
                  onChange={(e) =>
                    updateFormData("description", e.target.value)
                  }
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Property Type *</Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) =>
                      updateFormData("propertyType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Gender Preference *</Label>
                  <Select
                    value={formData.genderPreference}
                    onValueChange={(value) =>
                      updateFormData("genderPreference", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDER_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.propertyType === "FLAT" && (
                  <div className="space-y-2">
                    <Label htmlFor="bhk">BHK</Label>
                    <Select
                      value={formData.bhk}
                      onValueChange={(value) => updateFormData("bhk", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select BHK" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 BHK</SelectItem>
                        <SelectItem value="2">2 BHK</SelectItem>
                        <SelectItem value="3">3 BHK</SelectItem>
                        <SelectItem value="4">4 BHK</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </CardTitle>
              <CardDescription>Where is your property located?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Full Address *</Label>
                <Input
                  id="address"
                  placeholder="Street address, area"
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="Kolkata"
                    value={formData.city}
                    onChange={(e) => updateFormData("city", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => updateFormData("state", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    placeholder="700001"
                    value={formData.pincode}
                    onChange={(e) => updateFormData("pincode", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="landmark">Landmark</Label>
                <Input
                  id="landmark"
                  placeholder="Near Heritage Institute, opposite SBI Bank"
                  value={formData.landmark}
                  onChange={(e) => updateFormData("landmark", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nearbyColleges">
                  Nearby Colleges (comma separated)
                </Label>
                <Input
                  id="nearbyColleges"
                  placeholder="Heritage Institute, Techno India, NSHM"
                  value={formData.nearbyColleges}
                  onChange={(e) =>
                    updateFormData("nearbyColleges", e.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Room Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bed className="h-5 w-5" />
                Room Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalRooms">Total Rooms</Label>
                  <Input
                    id="totalRooms"
                    type="number"
                    min="1"
                    value={formData.totalRooms}
                    onChange={(e) =>
                      updateFormData("totalRooms", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalBeds">Total Beds</Label>
                  <Input
                    id="totalBeds"
                    type="number"
                    min="1"
                    value={formData.totalBeds}
                    onChange={(e) =>
                      updateFormData("totalBeds", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availableBeds">Available Beds *</Label>
                  <Input
                    id="availableBeds"
                    type="number"
                    min="0"
                    value={formData.availableBeds}
                    onChange={(e) =>
                      updateFormData("availableBeds", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bedsPerRoom">Beds/Room</Label>
                  <Input
                    id="bedsPerRoom"
                    type="number"
                    min="1"
                    value={formData.bedsPerRoom}
                    onChange={(e) =>
                      updateFormData("bedsPerRoom", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roomSize">Room Size</Label>
                  <Input
                    id="roomSize"
                    placeholder="120 sq ft"
                    value={formData.roomSize}
                    onChange={(e) => updateFormData("roomSize", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min="1"
                    value={formData.bathrooms}
                    onChange={(e) =>
                      updateFormData("bathrooms", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="floorNumber">Floor</Label>
                  <Input
                    id="floorNumber"
                    type="number"
                    min="0"
                    value={formData.floorNumber}
                    onChange={(e) =>
                      updateFormData("floorNumber", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalFloors">Total Floors</Label>
                  <Input
                    id="totalFloors"
                    type="number"
                    min="1"
                    value={formData.totalFloors}
                    onChange={(e) =>
                      updateFormData("totalFloors", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Occupancy Type</Label>
                  <Select
                    value={formData.occupancyType}
                    onValueChange={(value) =>
                      updateFormData("occupancyType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {OCCUPANCY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Furnishing</Label>
                  <Select
                    value={formData.furnishing}
                    onValueChange={(value) =>
                      updateFormData("furnishing", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {FURNISHING_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="furnishingDetails">
                  Furnishing Details (comma separated)
                </Label>
                <Input
                  id="furnishingDetails"
                  placeholder="Bed, Mattress, Study Table, Chair, Cupboard, Fan"
                  value={formData.furnishingDetails}
                  onChange={(e) =>
                    updateFormData("furnishingDetails", e.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rent">Monthly Rent (₹) *</Label>
                  <Input
                    id="rent"
                    type="number"
                    min="0"
                    placeholder="6500"
                    value={formData.rent}
                    onChange={(e) => updateFormData("rent", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deposit">Security Deposit (₹) *</Label>
                  <Input
                    id="deposit"
                    type="number"
                    min="0"
                    placeholder="13000"
                    value={formData.deposit}
                    onChange={(e) => updateFormData("deposit", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maintenanceCharges">
                    Maintenance (₹/month)
                  </Label>
                  <Input
                    id="maintenanceCharges"
                    type="number"
                    min="0"
                    placeholder="500"
                    value={formData.maintenanceCharges}
                    onChange={(e) =>
                      updateFormData("maintenanceCharges", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Electricity Charges</Label>
                  <Select
                    value={formData.electricityCharges}
                    onValueChange={(value) =>
                      updateFormData("electricityCharges", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="included">Included in Rent</SelectItem>
                      <SelectItem value="separate">
                        Separate (As per usage)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Water Charges</Label>
                  <Select
                    value={formData.waterCharges}
                    onValueChange={(value) =>
                      updateFormData("waterCharges", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="included">Included in Rent</SelectItem>
                      <SelectItem value="separate">Separate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg border">
                <Checkbox
                  id="foodIncluded"
                  checked={formData.foodIncluded}
                  onCheckedChange={(checked) =>
                    updateFormData("foodIncluded", checked)
                  }
                />
                <Label htmlFor="foodIncluded" className="flex-1">
                  Food/Meals Included
                </Label>
                {formData.foodIncluded && (
                  <div className="flex gap-4">
                    <Input
                      type="number"
                      placeholder="Food charges"
                      className="w-32"
                      value={formData.foodCharges}
                      onChange={(e) =>
                        updateFormData("foodCharges", e.target.value)
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Meals/day"
                      className="w-24"
                      value={formData.mealsPerDay}
                      onChange={(e) =>
                        updateFormData("mealsPerDay", e.target.value)
                      }
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
              <CardDescription>Select available amenities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {AMENITIES.map((amenity) => (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => toggleAmenity(amenity.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      formData.amenities.includes(amenity.id)
                        ? "border-primary bg-primary/5 text-primary"
                        : "hover:bg-muted"
                    }`}
                  >
                    <amenity.icon className="h-5 w-5" />
                    <span className="text-sm">{amenity.label}</span>
                    {formData.amenities.includes(amenity.id) && (
                      <Check className="h-4 w-4 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rules */}
          <Card>
            <CardHeader>
              <CardTitle>House Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { id: "nonVegAllowed", label: "Non-veg Allowed" },
                  { id: "smokingAllowed", label: "Smoking Allowed" },
                  { id: "drinkingAllowed", label: "Drinking Allowed" },
                  { id: "petsAllowed", label: "Pets Allowed" },
                  { id: "visitorsAllowed", label: "Visitors Allowed" },
                  { id: "oppositeSexAllowed", label: "Opposite Sex Visitors" },
                ].map((rule) => (
                  <div key={rule.id} className="flex items-center gap-2">
                    <Checkbox
                      id={rule.id}
                      checked={
                        formData[rule.id as keyof typeof formData] as boolean
                      }
                      onCheckedChange={(checked) =>
                        updateFormData(rule.id, checked)
                      }
                    />
                    <Label htmlFor={rule.id}>{rule.label}</Label>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gateClosingTime">Gate Closing Time</Label>
                <Input
                  id="gateClosingTime"
                  type="time"
                  value={formData.gateClosingTime}
                  onChange={(e) =>
                    updateFormData("gateClosingTime", e.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImagePlus className="h-5 w-5" />
                Property Images
              </CardTitle>
              <CardDescription>
                Add image URLs for your property
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-lg overflow-hidden border"
                  >
                    <img
                      src={url}
                      alt={`Property ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 text-xs bg-primary text-white px-2 py-1 rounded">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 hover:bg-muted transition-colors"
                >
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Add Image URL
                  </span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="availableFrom">Available From</Label>
                  <Input
                    id="availableFrom"
                    type="date"
                    value={formData.availableFrom}
                    onChange={(e) =>
                      updateFormData("availableFrom", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimumStay">Minimum Stay (months)</Label>
                  <Input
                    id="minimumStay"
                    type="number"
                    min="1"
                    value={formData.minimumStay}
                    onChange={(e) =>
                      updateFormData("minimumStay", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="noticePeriod">Notice Period (months)</Label>
                  <Input
                    id="noticePeriod"
                    type="number"
                    min="1"
                    value={formData.noticePeriod}
                    onChange={(e) =>
                      updateFormData("noticePeriod", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Link href="/dashboard/landlord" className="flex-1">
              <Button variant="outline" className="w-full" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding Property...
                </>
              ) : (
                "Add Property"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
