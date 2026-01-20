"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
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
import roommatesData from "@/data/roommates.json";
import {
  Search,
  MapPin,
  Calendar,
  MessageCircle,
  BadgeCheck,
  GraduationCap,
  IndianRupee,
  Moon,
  Sun,
  Cigarette,
  Wine,
  Users,
} from "lucide-react";

type Roommate = (typeof roommatesData.roommates)[0];

export default function RoommatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");

  const filteredRoommates = useMemo(() => {
    let result = [...roommatesData.roommates];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.college.toLowerCase().includes(query) ||
          r.course.toLowerCase().includes(query) ||
          r.city.toLowerCase().includes(query),
      );
    }

    if (cityFilter && cityFilter !== "all") {
      result = result.filter((r) => r.city === cityFilter);
    }

    if (genderFilter && genderFilter !== "all") {
      result = result.filter((r) => r.gender === genderFilter);
    }

    return result;
  }, [searchQuery, cityFilter, genderFilter]);

  const cities = Array.from(
    new Set(roommatesData.roommates.map((r) => r.city)),
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-12">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Find Your Perfect Roommate
          </h1>
          <p className="text-muted-foreground text-lg">
            Connect with verified students looking for roommates near your
            college
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-40 bg-background border-b">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, college, or course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="text-sm text-muted-foreground mt-3">
            {filteredRoommates.length} roommates found
          </p>
        </div>
      </div>

      {/* Roommates Grid */}
      <div className="container py-8">
        {filteredRoommates.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No roommates found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters to find more results.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoommates.map((roommate) => (
              <RoommateCard key={roommate.id} roommate={roommate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RoommateCard({ roommate }: { roommate: Roommate }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        {/* Profile Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <Image
              src={roommate.image}
              alt={roommate.name}
              width={80}
              height={80}
              className="rounded-full object-cover w-20 h-20"
            />
            {roommate.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <BadgeCheck className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{roommate.name}</h3>
              <span className="text-muted-foreground">({roommate.age})</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <GraduationCap className="h-4 w-4" />
              <span className="line-clamp-1">{roommate.college}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {roommate.course} • {roommate.year}
            </p>
          </div>
        </div>

        {/* Location & Budget */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{roommate.city}</span>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium">
            <IndianRupee className="h-4 w-4" />
            <span>
              {roommate.budget.min.toLocaleString()} -{" "}
              {roommate.budget.max.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Move-in Date */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <Calendar className="h-4 w-4" />
          <span>
            Looking from {new Date(roommate.moveInDate).toLocaleDateString()}
          </span>
        </div>

        {/* About */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {roommate.about}
        </p>

        {/* Lifestyle Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="text-xs">
            {roommate.lifestyle.sleepSchedule === "Night Owl" ? (
              <Moon className="h-3 w-3 mr-1" />
            ) : (
              <Sun className="h-3 w-3 mr-1" />
            )}
            {roommate.lifestyle.sleepSchedule}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {roommate.lifestyle.foodPreference}
          </Badge>
          {roommate.lifestyle.smoking === "Non-smoker" && (
            <Badge variant="outline" className="text-xs text-green-600">
              <Cigarette className="h-3 w-3 mr-1" />
              Non-smoker
            </Badge>
          )}
        </div>

        {/* Interests */}
        <div className="flex flex-wrap gap-1 mb-4">
          {roommate.interests.slice(0, 4).map((interest) => (
            <Badge key={interest} variant="secondary" className="text-xs">
              {interest}
            </Badge>
          ))}
          {roommate.interests.length > 4 && (
            <Badge variant="secondary" className="text-xs">
              +{roommate.interests.length - 4}
            </Badge>
          )}
        </div>

        {/* Action Button */}
        <Button className="w-full">
          <MessageCircle className="h-4 w-4 mr-2" />
          Connect
        </Button>
      </CardContent>
    </Card>
  );
}
