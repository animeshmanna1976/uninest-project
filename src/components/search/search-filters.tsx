"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  formatPrice,
  propertyTypes,
  furnishingTypes,
  genderOptions,
} from "@/lib/utils";
import type { SearchFilters } from "@/types";

interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
}

const amenitiesList = [
  { id: "wifi", label: "WiFi" },
  { id: "ac", label: "AC" },
  { id: "parking", label: "Parking" },
  { id: "laundry", label: "Laundry" },
  { id: "security", label: "Security" },
  { id: "cctv", label: "CCTV" },
  { id: "gym", label: "Gym" },
  { id: "power_backup", label: "Power Backup" },
  { id: "water_purifier", label: "Water Purifier" },
  { id: "mess", label: "Mess/Kitchen" },
  { id: "tv", label: "TV" },
  { id: "refrigerator", label: "Refrigerator" },
];

const sortOptions = [
  { value: "relevance", label: "Most Relevant" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Highest Rated" },
];

export function SearchFilters({
  filters,
  onFiltersChange,
  onSearch,
}: SearchFiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.minRent || 0,
    filters.maxRent || 50000,
  ]);

  const updateFilter = <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K],
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const togglePropertyType = (type: string) => {
    const current = filters.propertyType || [];
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    updateFilter("propertyType", updated);
  };

  const toggleAmenity = (amenity: string) => {
    const current = filters.amenities || [];
    const updated = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    updateFilter("amenities", updated);
  };

  const toggleFurnishing = (furnishing: string) => {
    const current = filters.furnishing || [];
    const updated = current.includes(furnishing)
      ? current.filter((f) => f !== furnishing)
      : [...current, furnishing];
    updateFilter("furnishing", updated);
  };

  const clearFilters = () => {
    onFiltersChange({});
    setPriceRange([0, 50000]);
  };

  const activeFiltersCount = [
    filters.propertyType?.length || 0,
    filters.furnishing?.length || 0,
    filters.amenities?.length || 0,
    filters.gender ? 1 : 0,
    filters.minRent || filters.maxRent ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Input
            placeholder="Search by location, college, or property name..."
            value={filters.query || ""}
            onChange={(e) => updateFilter("query", e.target.value)}
            icon={<Search className="h-4 w-4" />}
            className="h-12"
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={filters.city || ""}
            onValueChange={(value) => updateFilter("city", value)}
          >
            <SelectTrigger className="h-12 w-[180px]">
              <MapPin className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              <SelectItem value="mumbai">Mumbai</SelectItem>
              <SelectItem value="delhi">Delhi</SelectItem>
              <SelectItem value="bangalore">Bangalore</SelectItem>
              <SelectItem value="hyderabad">Hyderabad</SelectItem>
              <SelectItem value="chennai">Chennai</SelectItem>
              <SelectItem value="pune">Pune</SelectItem>
              <SelectItem value="kolkata">Kolkata</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-12 gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  Filters
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  )}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Price Range */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Price Range</Label>
                  <Slider
                    value={priceRange}
                    min={0}
                    max={100000}
                    step={1000}
                    onValueChange={(value) => {
                      setPriceRange(value as [number, number]);
                      updateFilter("minRent", value[0]);
                      updateFilter("maxRent", value[1]);
                    }}
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>

                <Separator />

                {/* Property Type */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    Property Type
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {propertyTypes.map((type) => (
                      <Badge
                        key={type.value}
                        variant={
                          filters.propertyType?.includes(type.value)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => togglePropertyType(type.value)}
                      >
                        {type.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Gender Preference */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    Gender Preference
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {genderOptions.map((option) => (
                      <Badge
                        key={option.value}
                        variant={
                          filters.gender === option.value
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() =>
                          updateFilter(
                            "gender",
                            filters.gender === option.value
                              ? undefined
                              : option.value,
                          )
                        }
                      >
                        {option.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Furnishing */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Furnishing</Label>
                  <div className="flex flex-wrap gap-2">
                    {furnishingTypes.map((type) => (
                      <Badge
                        key={type.value}
                        variant={
                          filters.furnishing?.includes(type.value)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => toggleFurnishing(type.value)}
                      >
                        {type.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Amenities */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Amenities</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {amenitiesList.map((amenity) => (
                      <div
                        key={amenity.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={amenity.id}
                          checked={filters.amenities?.includes(amenity.id)}
                          onCheckedChange={() => toggleAmenity(amenity.id)}
                        />
                        <Label
                          htmlFor={amenity.id}
                          className="cursor-pointer font-normal"
                        >
                          {amenity.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Near College */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    Near College/University
                  </Label>
                  <Input
                    placeholder="Enter college name..."
                    value={filters.nearCollege || ""}
                    onChange={(e) =>
                      updateFilter("nearCollege", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsFiltersOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setIsFiltersOpen(false);
                    onSearch();
                  }}
                >
                  Apply Filters
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button onClick={onSearch} className="h-12 px-8">
            Search
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.propertyType?.map((type) => (
            <Badge key={type} variant="secondary" className="gap-1">
              {propertyTypes.find((t) => t.value === type)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => togglePropertyType(type)}
              />
            </Badge>
          ))}
          {filters.gender && (
            <Badge variant="secondary" className="gap-1">
              {genderOptions.find((g) => g.value === filters.gender)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter("gender", undefined)}
              />
            </Badge>
          )}
          {filters.furnishing?.map((f) => (
            <Badge key={f} variant="secondary" className="gap-1">
              {furnishingTypes.find((t) => t.value === f)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleFurnishing(f)}
              />
            </Badge>
          ))}
          {(filters.minRent || filters.maxRent) && (
            <Badge variant="secondary" className="gap-1">
              {formatPrice(filters.minRent || 0)} -{" "}
              {formatPrice(filters.maxRent || 100000)}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  updateFilter("minRent", undefined);
                  updateFilter("maxRent", undefined);
                  setPriceRange([0, 50000]);
                }}
              />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        </div>
      )}

      {/* Sort Options */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing results for your search
        </p>
        <Select
          value={filters.sortBy || "relevance"}
          onValueChange={(value) =>
            updateFilter("sortBy", value as SearchFilters["sortBy"])
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
