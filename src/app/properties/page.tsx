"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import propertiesData from "@/data/properties.json";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Grid3X3,
  List,
  Heart,
  Star,
  Wifi,
  Car,
  Shield,
  BadgeCheck,
  Map,
} from "lucide-react";

// Dynamically import map component (Leaflet doesn't work with SSR)
const PropertyMap = dynamic(() => import("@/components/map/property-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-muted rounded-xl flex items-center justify-center">
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  ),
});

type Property = (typeof propertiesData.properties)[0];

type SortOption =
  | "relevance"
  | "price-low"
  | "price-high"
  | "rating"
  | "newest";

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<
    string | undefined
  >();

  // Filter states
  const [filters, setFilters] = useState({
    propertyType: "",
    priceRange: [0, 50000] as [number, number],
    gender: "",
  });

  // Watch for URL view parameter changes
  useEffect(() => {
    const view = searchParams.get("view");
    if (view === "map") {
      setViewMode("map");
    }
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProperties(propertiesData.properties);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Fetch wishlist from MongoDB
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch("/api/wishlist");
        const data = await res.json();
        setWishlist(data.propertyIds || []);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };
    fetchWishlist();
  }, []);

  const toggleWishlist = async (propertyId: string) => {
    try {
      const res = await fetch("/api/wishlist", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId }),
      });
      const data = await res.json();
      setWishlist(data.propertyIds || []);
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  const filteredProperties = useMemo(() => {
    let result = [...properties];

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.city.toLowerCase().includes(query) ||
          p.address.toLowerCase().includes(query),
      );
    }

    // Location filter
    if (location) {
      const loc = location.toLowerCase();
      result = result.filter(
        (p) =>
          p.city.toLowerCase().includes(loc) ||
          p.address.toLowerCase().includes(loc),
      );
    }

    // Property type filter
    if (filters.propertyType) {
      result = result.filter((p) => p.propertyType === filters.propertyType);
    }

    // Price range filter
    result = result.filter(
      (p) => p.rent >= filters.priceRange[0] && p.rent <= filters.priceRange[1],
    );

    // Gender filter
    if (filters.gender) {
      result = result.filter((p) => p.genderPreference === filters.gender);
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.rent - b.rent);
        break;
      case "price-high":
        result.sort((a, b) => b.rent - a.rent);
        break;
      case "rating":
        result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
    }

    return result;
  }, [properties, searchQuery, location, filters, sortBy]);

  const clearFilters = () => {
    setFilters({
      propertyType: "",
      priceRange: [0, 50000],
      gender: "",
    });
    setSearchQuery("");
    setLocation("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="sticky top-16 z-40 bg-background border-b">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, area, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Location Input */}
            <div className="relative w-full md:w-64">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="City or area..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Property Type Filter */}
            <Select
              value={filters.propertyType}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, propertyType: value }))
              }
            >
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="PG">PG</SelectItem>
                <SelectItem value="Hostel">Hostel</SelectItem>
                <SelectItem value="Flat">Flat</SelectItem>
                <SelectItem value="Room">Room</SelectItem>
              </SelectContent>
            </Select>

            {/* Gender Filter */}
            <Select
              value={filters.gender}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, gender: value }))
              }
            >
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="MALE">Boys</SelectItem>
                <SelectItem value="FEMALE">Girls</SelectItem>
                <SelectItem value="ANY">Co-ed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort and View Options */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              {isLoading
                ? "Searching..."
                : `${filteredProperties.length} properties found`}
            </p>

            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <Select
                value={sortBy}
                onValueChange={(value: SortOption) => setSortBy(value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="hidden md:flex items-center border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-none border-x"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "map" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("map")}
                  className="rounded-l-none"
                >
                  <Map className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="container py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No properties found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters to find more results.
            </p>
            <Button onClick={clearFilters}>Clear all filters</Button>
          </div>
        ) : viewMode === "map" ? (
          /* Map View */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Map Section */}
            <div className="lg:sticky lg:top-40 lg:h-[calc(100vh-200px)]">
              <PropertyMap
                properties={filteredProperties}
                selectedPropertyId={selectedPropertyId}
                onPropertySelect={(id) => setSelectedPropertyId(id)}
                className="h-full min-h-[400px]"
              />
            </div>

            {/* Property List beside map */}
            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {filteredProperties.map((property) => (
                <Card
                  key={property.id}
                  className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
                    selectedPropertyId === property.id
                      ? "ring-2 ring-primary"
                      : ""
                  }`}
                  onClick={() => setSelectedPropertyId(property.id)}
                >
                  <div className="flex">
                    <div className="relative w-32 h-32 flex-shrink-0">
                      <Image
                        src={property.images[0]?.url || "/placeholder.jpg"}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-3 flex-1">
                      <Link href={`/properties/${property.slug}`}>
                        <h3 className="font-semibold text-sm hover:text-primary line-clamp-1">
                          {property.title}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
                        <MapPin className="h-3 w-3" />
                        <span className="line-clamp-1">{property.address}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-bold text-primary text-sm">
                          ₹{property.rent.toLocaleString()}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {property.propertyType}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {property.genderPreference === "MALE"
                            ? "Boys"
                            : property.genderPreference === "FEMALE"
                              ? "Girls"
                              : "Co-ed"}
                        </Badge>
                        {property.averageRating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">
                              {property.averageRating}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {filteredProperties.map((property) => (
              <Card
                key={property.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <Link href={`/properties/${property.slug}`}>
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={property.images[0]?.url || "/placeholder.jpg"}
                        alt={property.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {property.isVerified && (
                      <Badge className="bg-green-500 text-white">
                        <BadgeCheck className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {property.isFeatured && (
                      <Badge className="bg-yellow-500 text-white">
                        Featured
                      </Badge>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(property.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        wishlist.includes(property.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                      }`}
                    />
                  </button>

                  {/* Price Badge */}
                  <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 rounded-full">
                    <span className="font-bold text-primary">
                      ₹{property.rent.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      /month
                    </span>
                  </div>
                </div>

                <CardContent className="p-4">
                  <Link href={`/properties/${property.slug}`}>
                    <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors line-clamp-1">
                      {property.title}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">
                      {property.address}, {property.city}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary">{property.propertyType}</Badge>
                    <Badge variant="outline">
                      {property.genderPreference === "MALE"
                        ? "Boys"
                        : property.genderPreference === "FEMALE"
                          ? "Girls"
                          : "Co-ed"}
                    </Badge>
                    {property.averageRating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {property.averageRating}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 text-muted-foreground text-xs">
                    {property.amenities.includes("wifi") && (
                      <div className="flex items-center gap-1">
                        <Wifi className="h-3 w-3" />
                        <span>WiFi</span>
                      </div>
                    )}
                    {property.amenities.includes("parking") && (
                      <div className="flex items-center gap-1">
                        <Car className="h-3 w-3" />
                        <span>Parking</span>
                      </div>
                    )}
                    {property.amenities.includes("security") && (
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        <span>Security</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
