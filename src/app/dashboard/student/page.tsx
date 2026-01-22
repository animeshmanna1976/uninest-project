"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import propertiesData from "@/data/properties.json";
import {
  Home,
  Heart,
  Search,
  MessageSquare,
  Calendar,
  Settings,
  LogOut,
  Loader2,
  LayoutDashboard,
  User,
  Bell,
  ChevronRight,
  MapPin,
  Star,
  Eye,
  Clock,
  GraduationCap,
} from "lucide-react";

export default function StudentDashboard() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    } else if (!isLoading && user?.role !== "student") {
      router.push("/dashboard/landlord");
    }
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch wishlist
        const wishlistRes = await fetch("/api/wishlist");
        const wishlistData = await wishlistRes.json();
        setWishlist(wishlistData.propertyIds || []);

        // Fetch student's inquiries
        const inquiriesRes = await fetch(
          `/api/inquiries/student?userId=${user.id}`,
        );
        const inquiriesData = await inquiriesRes.json();
        if (inquiriesData.success) {
          setInquiries(inquiriesData.inquiries || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingData(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const wishlistedProperties = propertiesData.properties.filter((p) =>
    wishlist.includes(p.id),
  );

  const recentlyViewed = propertiesData.properties.slice(0, 4);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-background border-r hidden lg:block">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-lg">
                <Home className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">UniNest</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            <Link
              href="/dashboard/student"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium"
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/properties"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
            >
              <Search className="h-5 w-5" />
              Browse Properties
            </Link>
            <Link
              href="/wishlist"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
            >
              <Heart className="h-5 w-5" />
              Saved Properties
              {wishlist.length > 0 && (
                <Badge className="ml-auto" variant="secondary">
                  {wishlist.length}
                </Badge>
              )}
            </Link>
            <Link
              href="/dashboard/student/inquiries"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
              My Inquiries
            </Link>
            <Link
              href="/roommates"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
            >
              <User className="h-5 w-5" />
              Find Roommates
            </Link>
            <Link
              href="/dashboard/student/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.name}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.name?.split(" ")[0]}!
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Link href="/properties">
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  Find Property
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Saved Properties
                </CardTitle>
                <Heart className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{wishlist.length}</div>
                <p className="text-xs text-muted-foreground">
                  properties in wishlist
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Inquiries Sent
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inquiries.length}</div>
                <p className="text-xs text-muted-foreground">
                  {inquiries.filter((i) => i.status === "pending").length}{" "}
                  pending
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Properties Viewed
                </CardTitle>
                <Eye className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Scheduled Visits
                </CardTitle>
                <Calendar className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">upcoming visits</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Saved Properties */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Saved Properties</CardTitle>
                    <CardDescription>
                      Properties you&apos;ve added to wishlist
                    </CardDescription>
                  </div>
                  <Link href="/wishlist">
                    <Button variant="outline" size="sm">
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {loadingData ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : wishlistedProperties.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-2">No saved properties</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Start exploring and save properties you like
                      </p>
                      <Link href="/properties">
                        <Button>
                          <Search className="h-4 w-4 mr-2" />
                          Browse Properties
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {wishlistedProperties.slice(0, 4).map((property) => (
                        <Link
                          key={property.id}
                          href={`/properties/${property.slug}`}
                          className="group block"
                        >
                          <div className="flex gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                            <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={
                                  property.images[0]?.url || "/placeholder.jpg"
                                }
                                alt={property.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate group-hover:text-primary">
                                {property.title}
                              </h4>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                <MapPin className="h-3 w-3" />
                                {property.city}
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <span className="font-semibold text-primary">
                                  ₹{property.rent.toLocaleString()}
                                </span>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs">
                                    {property.averageRating}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recently Viewed */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Recommended For You</CardTitle>
                  <CardDescription>Based on your preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentlyViewed.map((property) => (
                      <Link
                        key={property.id}
                        href={`/properties/${property.slug}`}
                        className="group block"
                      >
                        <div className="flex gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                          <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={
                                property.images[0]?.url || "/placeholder.jpg"
                              }
                              alt={property.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate group-hover:text-primary">
                              {property.title}
                            </h4>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3" />
                              {property.city}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="font-semibold text-primary">
                                ₹{property.rent.toLocaleString()}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {property.propertyType}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Content */}
            <div>
              {/* Recent Inquiries */}
              <Card>
                <CardHeader>
                  <CardTitle>My Inquiries</CardTitle>
                  <CardDescription>
                    Status of your property inquiries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingData ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : inquiries.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">
                        No inquiries yet. Contact landlords to get started!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {inquiries.slice(0, 5).map((inquiry) => (
                        <div key={inquiry.id} className="p-3 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-sm truncate flex-1">
                              {inquiry.propertyTitle}
                            </p>
                            <Badge
                              variant={
                                inquiry.status === "contacted"
                                  ? "default"
                                  : inquiry.status === "pending"
                                    ? "secondary"
                                    : "outline"
                              }
                              className="text-xs ml-2"
                            >
                              {inquiry.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/properties" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Search className="h-4 w-4 mr-2" />
                      Search Properties
                    </Button>
                  </Link>
                  <Link href="/properties?view=map" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <MapPin className="h-4 w-4 mr-2" />
                      View on Map
                    </Button>
                  </Link>
                  <Link href="/roommates" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Find Roommates
                    </Button>
                  </Link>
                  <Link href="/dashboard/student/settings" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
