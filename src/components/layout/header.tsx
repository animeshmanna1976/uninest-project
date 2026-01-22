"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Home,
  Search,
  Heart,
  Menu,
  X,
  Building,
  Users,
  Map,
  User,
  LogIn,
  LogOut,
  LayoutDashboard,
  Settings,
  ChevronDown,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/properties", label: "Properties", icon: Building },
  { href: "/properties?view=map", label: "Map", icon: Map },
  { href: "/roommates", label: "Roommates", icon: Users },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const dashboardLink =
    user?.role === "landlord" ? "/dashboard/landlord" : "/dashboard/student";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Home className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold">UniNest</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <Link href="/properties" className="hidden md:block">
            <Button size="sm" variant="outline" className="gap-2">
              <Search className="h-4 w-4" />
              Find Housing
            </Button>
          </Link>

          {/* Auth Section */}
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 hidden md:flex">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-[100px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user.role === "landlord" ? "Property Owner" : "Student"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={dashboardLink} className="cursor-pointer">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wishlist" className="cursor-pointer">
                    <Heart className="h-4 w-4 mr-2" />
                    Wishlist
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`${dashboardLink}/settings`}
                    className="cursor-pointer"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t bg-background md:hidden">
          <nav className="container flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}

            <div className="border-t my-2" />

            {isAuthenticated && user ? (
              <>
                <div className="px-3 py-2 flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user.role === "landlord" ? "Property Owner" : "Student"}
                    </p>
                  </div>
                </div>
                <Link
                  href={dashboardLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link
                  href={`${dashboardLink}/settings`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-red-600"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    Log in
                  </Button>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button className="w-full justify-start gap-2">
                    <User className="h-4 w-4" />
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
