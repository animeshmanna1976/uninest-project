"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Home,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  MapPin,
  Bed,
  Bath,
  IndianRupee,
  Users,
  Loader2,
  ArrowLeft,
  Building2,
  MessageSquare,
  TrendingUp,
  Filter,
  LayoutGrid,
  List,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

interface Property {
  id: string;
  title: string;
  slug: string;
  propertyType: string;
  address: string;
  city: string;
  rent: number;
  deposit: number;
  totalBeds: number;
  availableBeds: number;
  bathrooms: number;
  genderPreference: string;
  images: { url: string; isPrimary: boolean }[];
  status: string;
  isVerified: boolean;
  isFeatured: boolean;
  viewCount: number;
  inquiryCount: number;
  createdAt: string;
}

export default function LandlordPropertiesPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    } else if (!authLoading && user?.role !== "landlord") {
      router.push("/dashboard/student");
    }
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (user?.id) {
      fetchProperties();
    }
  }, [user?.id]);

  const fetchProperties = async () => {
    try {
      const res = await fetch(`/api/properties?landlordId=${user?.id}`);
      const data = await res.json();
      if (data.success) {
        setProperties(data.properties);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProperty = async () => {
    if (!propertyToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(
        `/api/properties?id=${propertyToDelete.id}&landlordId=${user?.id}`,
        { method: "DELETE" },
      );
      const data = await res.json();
      if (data.success) {
        setProperties(properties.filter((p) => p.id !== propertyToDelete.id));
      }
    } catch (error) {
      console.error("Error deleting property:", error);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setPropertyToDelete(null);
    }
  };

  const togglePropertyStatus = async (property: Property) => {
    const newStatus = property.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      const res = await fetch("/api/properties", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: property.id,
          landlordId: user?.id,
          status: newStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProperties(
          properties.map((p) =>
            p.id === property.id ? { ...p, status: newStatus } : p,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating property status:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "INACTIVE":
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
            <EyeOff className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || property.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/landlord">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">My Properties</h1>
                <p className="text-sm text-muted-foreground">
                  Manage your property listings
                </p>
              </div>
            </div>
            <Link href="/dashboard/landlord/add-property">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="container py-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search properties..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{properties.length}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {properties.filter((p) => p.status === "ACTIVE").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950">
                  <Eye className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {properties.reduce((sum, p) => sum + (p.viewCount || 0), 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-950">
                  <MessageSquare className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {properties.reduce(
                      (sum, p) => sum + (p.inquiryCount || 0),
                      0,
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">Inquiries</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Properties Grid/List */}
        {filteredProperties.length === 0 ? (
          <Card className="py-16">
            <CardContent className="text-center">
              <Building2 className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No properties found
              </h3>
              <p className="text-muted-foreground mb-4">
                {properties.length === 0
                  ? "You haven't added any properties yet."
                  : "No properties match your filters."}
              </p>
              {properties.length === 0 && (
                <Link href="/dashboard/landlord/add-property">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Property
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card
                key={property.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-video">
                  <img
                    src={
                      property.images?.[0]?.url ||
                      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400"
                    }
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {getStatusBadge(property.status)}
                    {property.isVerified && (
                      <Badge className="bg-blue-100 text-blue-700">
                        Verified
                      </Badge>
                    )}
                    {property.isFeatured && (
                      <Badge className="bg-yellow-100 text-yellow-700">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-3 right-3 h-8 w-8"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/properties/${property.slug}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dashboard/landlord/edit-property/${property.id}`}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => togglePropertyStatus(property)}
                      >
                        {property.status === "ACTIVE" ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => {
                          setPropertyToDelete(property);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {property.propertyType}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {property.genderPreference === "MALE"
                        ? "Boys"
                        : property.genderPreference === "FEMALE"
                          ? "Girls"
                          : "Any"}
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-1 line-clamp-1">
                    {property.title}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                    <MapPin className="h-3 w-3" />
                    {property.city}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Bed className="h-3.5 w-3.5" />
                      {property.availableBeds}/{property.totalBeds}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="h-3.5 w-3.5" />
                      {property.bathrooms}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {property.viewCount || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" />
                      {property.inquiryCount || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div>
                      <span className="text-lg font-bold text-primary">
                        ₹{property.rent.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        /month
                      </span>
                    </div>
                    <Link
                      href={`/dashboard/landlord/edit-property/${property.id}`}
                    >
                      <Button size="sm" variant="outline">
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProperties.map((property) => (
              <Card
                key={property.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="flex">
                  <div className="w-48 h-36 flex-shrink-0">
                    <img
                      src={
                        property.images?.[0]?.url ||
                        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400"
                      }
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex gap-2">
                          {getStatusBadge(property.status)}
                          <Badge variant="secondary">
                            {property.propertyType}
                          </Badge>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/properties/${property.slug}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dashboard/landlord/edit-property/${property.id}`}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => togglePropertyStatus(property)}
                            >
                              {property.status === "ACTIVE" ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setPropertyToDelete(property);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <h3 className="font-semibold mb-1">{property.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {property.address}, {property.city}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          {property.availableBeds}/{property.totalBeds} beds
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {property.viewCount || 0} views
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {property.inquiryCount || 0} inquiries
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-primary">
                          ₹{property.rent.toLocaleString()}/mo
                        </span>
                        <Link
                          href={`/dashboard/landlord/edit-property/${property.id}`}
                        >
                          <Button size="sm">Edit</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{propertyToDelete?.title}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProperty}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
