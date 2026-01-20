"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Bed, Bath, Star, Shield, Sparkles } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatPrice,
  getPropertyTypeLabel,
  getGenderLabel,
  formatDistance,
} from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { PropertyCard as PropertyCardType } from "@/types";

interface PropertyCardProps {
  property: PropertyCardType;
  onWishlistToggle?: (id: string) => void;
  isWishlisted?: boolean;
  showDistance?: boolean;
}

export function PropertyCard({
  property,
  onWishlistToggle,
  isWishlisted = false,
  showDistance = false,
}: PropertyCardProps) {
  const [isLiked, setIsLiked] = useState(isWishlisted);
  const [imageError, setImageError] = useState(false);

  const primaryImage =
    property.images.find((img) => img.isPrimary)?.url ||
    property.images[0]?.url;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    onWishlistToggle?.(property.id);
  };

  return (
    <Link href={`/properties/${property.slug}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden">
          {primaryImage && !imageError ? (
            <Image
              src={primaryImage}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {property.isVerified && (
              <Badge variant="success" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Verified
              </Badge>
            )}
            {property.isFeatured && (
              <Badge variant="warning" className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Featured
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute right-3 top-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white",
              isLiked && "text-red-500",
            )}
            onClick={handleWishlistClick}
          >
            <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
          </Button>

          {/* Property Type Badge */}
          <Badge className="absolute bottom-3 left-3" variant="secondary">
            {getPropertyTypeLabel(property.propertyType)}
          </Badge>
        </div>

        <CardContent className="p-4">
          {/* Price */}
          <div className="mb-2 flex items-baseline justify-between">
            <div>
              <span className="text-xl font-bold text-primary">
                {formatPrice(property.rent)}
              </span>
              <span className="text-sm text-muted-foreground">/month</span>
            </div>
            {property.averageRating && property.averageRating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">
                  {property.averageRating.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({property.reviewCount})
                </span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="mb-2 line-clamp-1 font-semibold group-hover:text-primary">
            {property.title}
          </h3>

          {/* Location */}
          <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">
              {property.address}, {property.city}
            </span>
            {showDistance && property.distance && (
              <span className="ml-auto whitespace-nowrap font-medium text-primary">
                {formatDistance(property.distance)}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>
                {property.availableBeds}/{property.totalBeds} Beds
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs">
                {getGenderLabel(property.genderPreference)}
              </Badge>
            </div>
          </div>

          {/* Deposit */}
          <div className="mt-3 flex items-center justify-between border-t pt-3 text-sm">
            <span className="text-muted-foreground">Deposit:</span>
            <span className="font-medium">{formatPrice(property.deposit)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Loading skeleton for PropertyCard
export function PropertyCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <CardContent className="p-4">
        <div className="mb-2 h-6 w-1/2 animate-pulse rounded bg-muted" />
        <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="mb-3 h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="flex gap-4">
          <div className="h-4 w-16 animate-pulse rounded bg-muted" />
          <div className="h-4 w-16 animate-pulse rounded bg-muted" />
        </div>
      </CardContent>
    </Card>
  );
}
