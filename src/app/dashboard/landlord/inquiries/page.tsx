"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Loader2,
  Search,
  MessageSquare,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  CalendarPlus,
  Filter,
  User,
  Home,
  IndianRupee,
} from "lucide-react";

interface Inquiry {
  id: string;
  propertyId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  message: string;
  preferredMoveIn: string | null;
  status: string;
  scheduledVisit: string | null;
  landlordNotes: string;
  createdAt: string;
  property: {
    id: string;
    title: string;
    slug: string;
    city: string;
    rent: number;
    image: string;
  } | null;
}

const statusOptions = [
  {
    value: "PENDING",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    value: "CONTACTED",
    label: "Contacted",
    color: "bg-blue-100 text-blue-700",
  },
  {
    value: "SCHEDULED",
    label: "Visit Scheduled",
    color: "bg-purple-100 text-purple-700",
  },
  {
    value: "VISITED",
    label: "Visited",
    color: "bg-indigo-100 text-indigo-700",
  },
  { value: "RENTED", label: "Rented", color: "bg-green-100 text-green-700" },
  { value: "REJECTED", label: "Rejected", color: "bg-red-100 text-red-700" },
  {
    value: "CANCELLED",
    label: "Cancelled",
    color: "bg-gray-100 text-gray-700",
  },
];

export default function LandlordInquiriesPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    } else if (!authLoading && user?.role !== "landlord") {
      router.push("/dashboard/student");
    }
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (user?.id) {
      fetchInquiries();
    }
  }, [user?.id]);

  const fetchInquiries = async () => {
    try {
      const res = await fetch(`/api/inquiries?landlordId=${user?.id}`);
      const data = await res.json();
      if (data.success) {
        setInquiries(data.inquiries);
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateInquiryStatus = async (inquiryId: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: inquiryId,
          userId: user?.id,
          status: newStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(
          inquiries.map((i) =>
            i.id === inquiryId ? { ...i, status: newStatus } : i,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const scheduleVisit = async () => {
    if (!selectedInquiry || !scheduleDate || !scheduleTime) return;
    setIsUpdating(true);

    try {
      const scheduledVisit = new Date(`${scheduleDate}T${scheduleTime}`);
      const res = await fetch("/api/inquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedInquiry.id,
          userId: user?.id,
          scheduledVisit: scheduledVisit.toISOString(),
          landlordNotes: notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(
          inquiries.map((i) =>
            i.id === selectedInquiry.id
              ? {
                  ...i,
                  status: "SCHEDULED",
                  scheduledVisit: scheduledVisit.toISOString(),
                  landlordNotes: notes,
                }
              : i,
          ),
        );
        setScheduleDialogOpen(false);
        setSelectedInquiry(null);
        setScheduleDate("");
        setScheduleTime("");
        setNotes("");
      }
    } catch (error) {
      console.error("Error scheduling visit:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const option = statusOptions.find((o) => o.value === status);
    return (
      <Badge className={option?.color || "bg-gray-100 text-gray-700"}>
        {option?.label || status}
      </Badge>
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.property?.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      inquiry.studentEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || inquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = inquiries.filter((i) => i.status === "PENDING").length;

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
          <div className="flex items-center gap-4">
            <Link href="/dashboard/landlord">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                Inquiries
                {pendingCount > 0 && (
                  <Badge className="bg-red-500 text-white">
                    {pendingCount} new
                  </Badge>
                )}
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage inquiries from potential tenants
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="container py-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email or property..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-3xl font-bold">{inquiries.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">
                  {pendingCount}
                </p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">
                  {inquiries.filter((i) => i.status === "SCHEDULED").length}
                </p>
                <p className="text-sm text-muted-foreground">Scheduled</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {inquiries.filter((i) => i.status === "RENTED").length}
                </p>
                <p className="text-sm text-muted-foreground">Rented</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inquiries List */}
        {filteredInquiries.length === 0 ? (
          <Card className="py-16">
            <CardContent className="text-center">
              <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No inquiries found</h3>
              <p className="text-muted-foreground">
                {inquiries.length === 0
                  ? "You haven't received any inquiries yet."
                  : "No inquiries match your filters."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredInquiries.map((inquiry) => (
              <Card key={inquiry.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Property Info */}
                    {inquiry.property && (
                      <div className="md:w-48 p-4 bg-muted/50 flex gap-3 items-start">
                        <img
                          src={
                            inquiry.property.image ||
                            "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=100"
                          }
                          alt={inquiry.property.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <Link href={`/properties/${inquiry.property.slug}`}>
                            <h4 className="font-medium text-sm line-clamp-2 hover:text-primary">
                              {inquiry.property.title}
                            </h4>
                          </Link>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {inquiry.property.city}
                          </p>
                          <p className="text-xs font-medium text-primary mt-1">
                            ₹{inquiry.property.rent.toLocaleString()}/mo
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Main Content */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              {inquiry.studentName}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {inquiry.studentEmail}
                              </span>
                              {inquiry.studentPhone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {inquiry.studentPhone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(inquiry.status)}
                          <span className="text-xs text-muted-foreground">
                            {formatDate(inquiry.createdAt)}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 bg-muted/50 p-3 rounded-lg">
                        "{inquiry.message}"
                      </p>

                      {inquiry.preferredMoveIn && (
                        <p className="text-sm text-muted-foreground mb-3">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          Preferred move-in:{" "}
                          {formatDate(inquiry.preferredMoveIn)}
                        </p>
                      )}

                      {inquiry.scheduledVisit && (
                        <div className="flex items-center gap-2 text-sm text-purple-600 mb-3">
                          <CalendarPlus className="h-4 w-4" />
                          Visit scheduled:{" "}
                          {formatDateTime(inquiry.scheduledVisit)}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-3 border-t">
                        {inquiry.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() =>
                                updateInquiryStatus(inquiry.id, "CONTACTED")
                              }
                              disabled={isUpdating}
                            >
                              <Phone className="h-4 w-4 mr-1" />
                              Mark Contacted
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedInquiry(inquiry);
                                setScheduleDialogOpen(true);
                              }}
                            >
                              <CalendarPlus className="h-4 w-4 mr-1" />
                              Schedule Visit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600"
                              onClick={() =>
                                updateInquiryStatus(inquiry.id, "REJECTED")
                              }
                              disabled={isUpdating}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}

                        {inquiry.status === "CONTACTED" && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedInquiry(inquiry);
                              setScheduleDialogOpen(true);
                            }}
                          >
                            <CalendarPlus className="h-4 w-4 mr-1" />
                            Schedule Visit
                          </Button>
                        )}

                        {inquiry.status === "SCHEDULED" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() =>
                                updateInquiryStatus(inquiry.id, "VISITED")
                              }
                              disabled={isUpdating}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Mark Visited
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedInquiry(inquiry);
                                setScheduleDialogOpen(true);
                              }}
                            >
                              <Calendar className="h-4 w-4 mr-1" />
                              Reschedule
                            </Button>
                          </>
                        )}

                        {inquiry.status === "VISITED" && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() =>
                              updateInquiryStatus(inquiry.id, "RENTED")
                            }
                            disabled={isUpdating}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Mark as Rented
                          </Button>
                        )}

                        <a
                          href={`mailto:${inquiry.studentEmail}`}
                          className="ml-auto"
                        >
                          <Button size="sm" variant="ghost">
                            <Mail className="h-4 w-4 mr-1" />
                            Email
                          </Button>
                        </a>
                        {inquiry.studentPhone && (
                          <a href={`tel:${inquiry.studentPhone}`}>
                            <Button size="sm" variant="ghost">
                              <Phone className="h-4 w-4 mr-1" />
                              Call
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Schedule Visit Dialog */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Property Visit</DialogTitle>
            <DialogDescription>
              Schedule a visit for {selectedInquiry?.studentName} to view the
              property.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Time</label>
                <Input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes (optional)</label>
              <Textarea
                placeholder="Any notes for this visit..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setScheduleDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={scheduleVisit}
              disabled={!scheduleDate || !scheduleTime || isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                "Schedule Visit"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
