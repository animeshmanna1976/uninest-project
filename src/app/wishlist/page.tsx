"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import propertiesData from "@/data/properties.json";
import {
  Heart,
  MapPin,
  Star,
  Trash2,
  ArrowLeft,
  Home,
  BadgeCheck,
  Loader2,
} from "lucide-react";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch wishlist from MongoDB
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch("/api/wishlist");
        const data = await res.json();
        setWishlist(data.propertyIds || []);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (propertyId: string) => {
    try {
      const res = await fetch(`/api/wishlist?propertyId=${propertyId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      setWishlist(data.propertyIds || []);
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const clearWishlist = async () => {
    try {
      const res = await fetch("/api/wishlist?clearAll=true", {
        method: "DELETE",
      });
      const data = await res.json();
      setWishlist(data.propertyIds || []);
    } catch (error) {
      console.error("Error clearing wishlist:", error);
    }
  };

  const wishlistedProperties = propertiesData.properties.filter((p) =>
    wishlist.includes(p.id),
  );

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Heart className="h-8 w-8 text-red-500 fill-red-500" />
              My Wishlist
            </h1>
            <p className="text-muted-foreground mt-1">
              {wishlistedProperties.length} saved properties
            </p>
          </div>
          {wishlistedProperties.length > 0 && (
            <Button variant="outline" onClick={clearWishlist}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* Content */}
        {wishlistedProperties.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
              <Heart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-muted-foreground mb-6">
              Start saving properties you like by clicking the heart icon
            </p>
            <Link href="/properties">
              <Button>
                <Home className="h-4 w-4 mr-2" />
                Browse Properties
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistedProperties.map((property) => (
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
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromWishlist(property.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-red-100 transition-colors"
                  >
                    <Heart className="h-5 w-5 fill-red-500 text-red-500" />
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

                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{property.propertyType}</Badge>
                    {property.averageRating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {property.averageRating}
                        </span>
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
