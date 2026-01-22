"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import {
  Home,
  Building2,
  Plus,
  Eye,
  MessageSquare,
  Star,
  TrendingUp,
  Users,
  Calendar,
  Settings,
  LogOut,
  Loader2,
  LayoutDashboard,
  List,
  Bell,
  ChevronRight,
  IndianRupee,
} from "lucide-react";

interface DashboardStats {
  totalProperties: number;
  activeListings: number;
  totalViews: number;
  totalInquiries: number;
  pendingInquiries: number;
  averageRating: number;
  monthlyRevenue: number;
}

export default function LandlordDashboard() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    activeListings: 0,
    totalViews: 0,
    totalInquiries: 0,
    pendingInquiries: 0,
    averageRating: 0,
    monthlyRevenue: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    } else if (!isLoading && user?.role !== "landlord") {
      router.push("/dashboard/student");
    }
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        // Fetch landlord's properties
        const propertiesRes = await fetch(
          `/api/properties/landlord?userId=${user.id}`,
        );
        const propertiesData = await propertiesRes.json();

        if (propertiesData.success) {
          setProperties(propertiesData.properties || []);

          // Calculate stats
          const props = propertiesData.properties || [];
          setStats({
            totalProperties: props.length,
            activeListings: props.filter((p: any) => p.status === "ACTIVE")
              .length,
            totalViews: props.reduce(
              (sum: number, p: any) => sum + (p.viewCount || 0),
              0,
            ),
            totalInquiries: propertiesData.totalInquiries || 0,
            pendingInquiries: propertiesData.pendingInquiries || 0,
            averageRating: propertiesData.averageRating || 0,
            monthlyRevenue: props.reduce(
              (sum: number, p: any) => sum + (p.rent || 0),
              0,
            ),
          });
        }

        // Fetch recent inquiries
        const inquiriesRes = await fetch(
          `/api/inquiries/landlord?userId=${user.id}&limit=5`,
        );
        const inquiriesData = await inquiriesRes.json();
        if (inquiriesData.success) {
          setRecentInquiries(inquiriesData.inquiries || []);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoadingData(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

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
              href="/dashboard/landlord"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium"
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/landlord/properties"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
            >
              <Building2 className="h-5 w-5" />
              My Properties
            </Link>
            <Link
              href="/dashboard/landlord/add-property"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Property
            </Link>
            <Link
              href="/dashboard/landlord/inquiries"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
              Inquiries
              {stats.pendingInquiries > 0 && (
                <Badge className="ml-auto">{stats.pendingInquiries}</Badge>
              )}
            </Link>
            <Link
              href="/dashboard/landlord/settings"
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
                <Building2 className="h-5 w-5 text-primary" />
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
              <Link href="/dashboard/landlord/add-property">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
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
                  Total Properties
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalProperties}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeListings} active listings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Views
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalViews.toLocaleString()}
                </div>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Inquiries
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalInquiries}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingInquiries} pending response
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Potential Revenue
                </CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{stats.monthlyRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">per month</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Properties List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>My Properties</CardTitle>
                    <CardDescription>
                      Manage your property listings
                    </CardDescription>
                  </div>
                  <Link href="/dashboard/landlord/properties">
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
                  ) : properties.length === 0 ? (
                    <div className="text-center py-8">
                      <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-2">No properties yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Start by adding your first property listing
                      </p>
                      <Link href="/dashboard/landlord/add-property">
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Property
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {properties.slice(0, 5).map((property) => (
                        <div
                          key={property.id}
                          className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                            {property.images?.[0]?.url ? (
                              <img
                                src={property.images[0].url}
                                alt={property.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Building2 className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">
                              {property.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {property.city} • ₹
                              {property.rent?.toLocaleString()}/mo
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                property.status === "ACTIVE"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {property.status}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Eye className="h-4 w-4" />
                              {property.viewCount || 0}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Inquiries */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Inquiries</CardTitle>
                  <CardDescription>
                    Latest messages from students
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingData ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : recentInquiries.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">
                        No inquiries yet
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentInquiries.map((inquiry) => (
                        <div key={inquiry.id} className="p-3 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-sm">
                              {inquiry.studentName}
                            </p>
                            <Badge
                              variant={
                                inquiry.status === "pending"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {inquiry.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {inquiry.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
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
                  <Link
                    href="/dashboard/landlord/add-property"
                    className="block"
                  >
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Property
                    </Button>
                  </Link>
                  <Link href="/dashboard/landlord/properties" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <List className="h-4 w-4 mr-2" />
                      Manage Listings
                    </Button>
                  </Link>
                  <Link href="/dashboard/landlord/settings" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Account Settings
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
