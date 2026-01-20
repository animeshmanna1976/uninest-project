"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import propertiesData from "@/data/properties.json";
import reviewsData from "@/data/reviews.json";
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Star,
  Phone,
  MessageCircle,
  Calendar,
  Users,
  Home,
  Wifi,
  Car,
  Dumbbell,
  Utensils,
  Shield,
  Zap,
  Droplet,
  Wind,
  Tv,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Check,
  Clock,
  BadgeCheck,
  Navigation,
} from "lucide-react";

type Property = (typeof propertiesData.properties)[0];
type Review = (typeof reviewsData.reviews)[0];

const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="h-5 w-5" />,
  "Air Conditioning": <Wind className="h-5 w-5" />,
  Parking: <Car className="h-5 w-5" />,
  Gym: <Dumbbell className="h-5 w-5" />,
  "Food Included": <Utensils className="h-5 w-5" />,
  "24/7 Security": <Shield className="h-5 w-5" />,
  "Power Backup": <Zap className="h-5 w-5" />,
  Geyser: <Droplet className="h-5 w-5" />,
  TV: <Tv className="h-5 w-5" />,
  "Study Room": <BookOpen className="h-5 w-5" />,
};

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const slug = params.slug as string;
    const found = propertiesData.properties.find((p) => p.slug === slug);

    if (found) {
      setProperty(found);
      const propertyReviews = reviewsData.reviews.filter(
        (r) => r.propertyId === found.id,
      );
      setReviews(propertyReviews);

      // Fetch wishlist from MongoDB
      const fetchWishlist = async () => {
        try {
          const res = await fetch("/api/wishlist");
          const data = await res.json();
          const wishlistIds = data.propertyIds || [];
          setIsWishlisted(wishlistIds.includes(found.id));
        } catch (error) {
          console.error("Error fetching wishlist:", error);
        }
      };
      fetchWishlist();
    }

    setIsLoading(false);
  }, [params.slug]);

  const toggleWishlist = async () => {
    if (!property) return;

    try {
      const res = await fetch("/api/wishlist", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId: property.id }),
      });
      const data = await res.json();
      setIsWishlisted(data.isInWishlist);
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  const nextImage = () => {
    if (property) {
      setCurrentImageIndex((prev) =>
        prev === property.images.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const prevImage = () => {
    if (property) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? property.images.length - 1 : prev - 1,
      );
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-96 w-full rounded-xl" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div>
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The property you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Button onClick={() => router.push("/properties")}>
          Browse All Properties
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container py-4">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to listings
        </Button>
      </div>

      <div className="container pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="relative rounded-xl overflow-hidden aspect-video bg-muted">
              <Image
                src={property.images[currentImageIndex]?.url}
                alt={property.title}
                fill
                className="object-cover"
              />

              {/* Navigation Arrows */}
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {property.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition ${
                      idx === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {property.isVerified && (
                  <Badge className="bg-green-500">
                    <BadgeCheck className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {property.isFeatured && (
                  <Badge className="bg-yellow-500">Featured</Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={toggleWishlist}
                  className="p-2 rounded-full bg-white/90 hover:bg-white transition"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isWishlisted
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600"
                    }`}
                  />
                </button>
                <button className="p-2 rounded-full bg-white/90 hover:bg-white transition">
                  <Share2 className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {property.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 ${
                      idx === currentImageIndex ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`${property.title} - ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Title & Location */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {property.address}, {property.city}, {property.state}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-lg">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">
                    {property.averageRating}
                  </span>
                  <span className="text-muted-foreground">
                    ({property.reviewCount})
                  </span>
                </div>
              </div>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-4 mt-4">
                <Badge variant="secondary" className="gap-1">
                  <Home className="h-3 w-3" />
                  {property.propertyType}
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Users className="h-3 w-3" />
                  {property.genderPreference === "MALE"
                    ? "Boys Only"
                    : property.genderPreference === "FEMALE"
                      ? "Girls Only"
                      : "Co-ed"}
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Calendar className="h-3 w-3" />
                  Available from{" "}
                  {new Date(property.availableFrom).toLocaleDateString()}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="reviews">
                  Reviews ({reviews.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    About this property
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {property.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Property Highlights
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {property.amenities.slice(0, 6).map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-2 p-3 rounded-lg bg-muted/50"
                      >
                        {amenityIcons[amenity] || <Check className="h-5 w-5" />}
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">House Rules</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      {property.nonVegAllowed ? (
                        <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : (
                        <span className="h-5 w-5 text-red-500 mt-0.5">✗</span>
                      )}
                      <span>
                        Non-Veg{" "}
                        {property.nonVegAllowed ? "Allowed" : "Not Allowed"}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      {property.smokingAllowed ? (
                        <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : (
                        <span className="h-5 w-5 text-red-500 mt-0.5">✗</span>
                      )}
                      <span>
                        Smoking{" "}
                        {property.smokingAllowed ? "Allowed" : "Not Allowed"}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      {property.visitorsAllowed ? (
                        <Check className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : (
                        <span className="h-5 w-5 text-red-500 mt-0.5">✗</span>
                      )}
                      <span>
                        Visitors{" "}
                        {property.visitorsAllowed ? "Allowed" : "Not Allowed"}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <span>Gate closes at {property.gateClosingTime}</span>
                    </li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="amenities" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 p-4 rounded-lg border"
                    >
                      {amenityIcons[amenity] || (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="location" className="mt-6 space-y-6">
                <div className="rounded-xl overflow-hidden bg-muted h-64 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      Map integration coming soon
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {property.address}, {property.city}
                    </p>
                    {property.landmark && (
                      <p className="text-sm text-primary mt-1">
                        Near: {property.landmark}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Nearby Colleges
                  </h3>
                  <div className="space-y-3">
                    {property.nearbyColleges.map((college, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <BookOpen className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">{college}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6 space-y-6">
                {reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No reviews yet for this property.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarImage src={review.userImage} />
                              <AvatarFallback>
                                {review.userName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold">
                                    {review.userName}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Stayed for {review.stayDuration} months
                                  </p>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="font-medium">
                                    {review.overallRating}
                                  </span>
                                </div>
                              </div>
                              <h4 className="font-medium mt-3">
                                {review.title}
                              </h4>
                              <p className="text-muted-foreground mt-1">
                                {review.content}
                              </p>
                              {review.pros.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-sm font-medium text-green-600">
                                    Pros:
                                  </p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {review.pros.map((pro, idx) => (
                                      <Badge
                                        key={idx}
                                        variant="secondary"
                                        className="text-green-600"
                                      >
                                        {pro}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {review.cons.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-sm font-medium text-red-600">
                                    Cons:
                                  </p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {review.cons.map((con, idx) => (
                                      <Badge
                                        key={idx}
                                        variant="secondary"
                                        className="text-red-600"
                                      >
                                        {con}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                                <span>
                                  {new Date(
                                    review.createdAt,
                                  ).toLocaleDateString()}
                                </span>
                                {review.isVerified && (
                                  <Badge
                                    variant="outline"
                                    className="text-green-600"
                                  >
                                    <BadgeCheck className="h-3 w-3 mr-1" />
                                    Verified Stay
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Pricing Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">
                      ₹{property.rent.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground font-normal">
                      /month
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Security Deposit
                      </span>
                      <span className="font-medium">
                        ₹{property.deposit.toLocaleString()}
                      </span>
                    </div>
                    {property.maintenanceCharges > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Maintenance
                        </span>
                        <span className="font-medium">
                          ₹{property.maintenanceCharges.toLocaleString()}/month
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Electricity</span>
                      <span className="font-medium capitalize">
                        {property.electricityCharges}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Water</span>
                      <span className="font-medium capitalize">
                        {property.waterCharges}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Available from{" "}
                      {new Date(property.availableFrom).toLocaleDateString()}
                    </span>
                  </div>

                  <Button className="w-full" size="lg">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Visit
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </CardContent>
              </Card>

              {/* Owner Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Property Owner</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={property.owner.image} />
                      <AvatarFallback>
                        {property.owner.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{property.owner.name}</p>
                        {property.owner.isVerified && (
                          <BadgeCheck className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Responds in ~{property.owner.responseTime} mins
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Phone className="h-4 w-4 mr-2" />
                      {property.owner.phone}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Safety Tips */}
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">Safety Tip</p>
                      <p className="text-sm text-yellow-700 mt-1">
                        Always visit the property before making any payment.
                        Never transfer money without proper documentation.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
