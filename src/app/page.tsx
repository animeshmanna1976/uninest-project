"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  Shield,
  MapPin,
  Users,
  Star,
  ArrowRight,
  Building,
  CheckCircle,
  Home,
  Heart,
  Sparkles,
  Zap,
  Clock,
  BadgeCheck,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import propertiesData from "@/data/properties.json";

const features = [
  {
    icon: Shield,
    title: "100% Verified",
    description: "Every property is personally verified by our team",
    color: "bg-green-500/10 text-green-600",
  },
  {
    icon: MapPin,
    title: "Near Your College",
    description: "Find accommodation within walking distance",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: Users,
    title: "Find Roommates",
    description: "Connect with like-minded students",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    icon: Zap,
    title: "Instant Booking",
    description: "Schedule visits and book in minutes",
    color: "bg-orange-500/10 text-orange-600",
  },
];

const stats = [
  { value: "10K+", label: "Properties", icon: Building },
  { value: "50K+", label: "Students", icon: Users },
  { value: "100+", label: "Cities", icon: MapPin },
  { value: "4.8", label: "Rating", icon: Star },
];

const popularCities = [
  {
    name: "Delhi",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400",
    properties: 2500,
  },
  {
    name: "Kolkata",
    image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=400",
    properties: 1200,
  },
  {
    name: "Bangalore",
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400",
    properties: 2800,
  },
  {
    name: "Mumbai",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400",
    properties: 3200,
  },
  {
    name: "Pune",
    image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400",
    properties: 1500,
  },
  {
    name: "Chennai",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400",
    properties: 1200,
  },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Get featured properties (first 6)
  const featuredProperties = propertiesData.properties.slice(0, 6);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/properties?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/properties");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800" />

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />

        <div className="container relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                <Sparkles className="w-4 h-4 mr-2" />
                #1 Student Housing Platform
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Find Your
                <span className="relative mx-3">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    Perfect
                  </span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 12"
                    fill="none"
                  >
                    <path
                      d="M2 10C50 4 150 4 198 10"
                      stroke="url(#gradient)"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0"
                        y1="0"
                        x2="200"
                        y2="0"
                      >
                        <stop stopColor="#2563eb" />
                        <stop offset="1" stopColor="#9333ea" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                <br />
                Home Near College
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                Discover verified PGs, hostels & flats. Connect with trusted
                landlords. Find compatible roommates. All in one place.
              </p>

              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto lg:mx-0">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by college, city, or area..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="h-14 pl-12 pr-4 text-base rounded-xl border-2 focus:border-blue-500 transition-colors"
                  />
                </div>
                <Button
                  size="lg"
                  onClick={handleSearch}
                  className="h-14 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25"
                >
                  Search
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Quick Links */}
              <div className="mt-6 flex flex-wrap gap-2 justify-center lg:justify-start">
                <span className="text-sm text-muted-foreground">Popular:</span>
                {[
                  "Heritage IT Kolkata",
                  "IIT Delhi",
                  "BITS Pilani",
                  "Christ University",
                ].map((item) => (
                  <Link
                    key={item}
                    href={`/properties?q=${encodeURIComponent(item)}`}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Content - Stats Cards */}
            <div className="hidden lg:block relative">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className={`p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border shadow-lg transform hover:scale-105 transition-all duration-300 ${
                      index % 2 === 0 ? "translate-y-4" : "-translate-y-4"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                        <stat.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 p-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg animate-bounce">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-5 w-5" />
                  <span className="font-semibold">100% Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              Why UniNest?
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything You Need in One Place
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-800"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`inline-flex p-4 rounded-2xl ${feature.color} mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <Badge variant="outline" className="mb-4">
                Featured
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                Popular Properties
              </h2>
            </div>
            <Link href="/properties">
              <Button variant="outline" className="gap-2">
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <Link key={property.id} href={`/properties/${property.slug}`}>
                <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={property.images[0]?.url || "/placeholder.jpg"}
                      alt={property.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {property.isVerified && (
                        <Badge className="bg-green-500 text-white">
                          <BadgeCheck className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center justify-between text-white">
                        <span className="text-2xl font-bold">
                          ₹{property.rent.toLocaleString()}
                        </span>
                        <span className="text-sm opacity-80">/month</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{property.city}</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <Badge variant="secondary">{property.propertyType}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {property.averageRating}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              Explore
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Popular Cities</h2>
            <p className="text-muted-foreground mt-2">
              Find properties in top student destinations
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularCities.map((city) => (
              <Link
                key={city.name}
                href={`/properties?location=${city.name.toLowerCase()}`}
              >
                <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div className="relative h-32 overflow-hidden">
                    <Image
                      src={city.image}
                      alt={city.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-semibold">{city.name}</h3>
                      <p className="text-xs opacity-80">
                        {city.properties}+ properties
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-white/20 text-white border-0">
              How It Works
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Find Your Home in 3 Steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                icon: Search,
                title: "Search",
                desc: "Enter your college or preferred location",
              },
              {
                step: 2,
                icon: Building,
                title: "Compare",
                desc: "Filter by price, amenities & preferences",
              },
              {
                step: 3,
                icon: CheckCircle,
                title: "Book",
                desc: "Schedule visits and secure your place",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="relative inline-flex">
                  <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4">
                    <item.icon className="h-10 w-10" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white text-blue-600 font-bold flex items-center justify-center">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-white/80">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/properties">
              <Button size="lg" variant="secondary" className="gap-2">
                Start Searching
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              Reviews
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              What Students Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Priya S.",
                college: "IIT Delhi",
                text: "Found a perfect PG within my budget. The verified listings gave me confidence!",
                rating: 5,
              },
              {
                name: "Rahul V.",
                college: "BITS Pilani",
                text: "The roommate finder helped me connect with great flatmates. Highly recommend!",
                rating: 5,
              },
              {
                name: "Ananya P.",
                college: "Mumbai Univ",
                text: "Super easy to use! Booked my hostel in just 2 days. Amazing platform.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="relative">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.college}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdjJoLTYweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNhKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-50" />
            <CardContent className="relative z-10 p-12 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Find Your New Home?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                Join 50,000+ students who found their perfect accommodation
                through UniNest
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/properties">
                  <Button size="lg" variant="secondary" className="gap-2 px-8">
                    <Search className="h-5 w-5" />
                    Browse Properties
                  </Button>
                </Link>
                <Link href="/properties?view=map">
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 px-8 border-white/30 text-white hover:bg-white/10"
                  >
                    <MapPin className="h-5 w-5" />
                    Explore on Map
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
