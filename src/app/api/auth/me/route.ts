import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { SafeUser, TokenPayload } from "@/types/auth";

const JWT_SECRET =
  process.env.JWT_SECRET || "uninest-secret-key-change-in-production";

// GET - Get current user from token
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated", user: null },
        { status: 401 },
      );
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    const db = await getDb();
    const usersCollection = db.collection("users");

    // Find user
    const user = await usersCollection.findOne({ id: decoded.userId });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found", user: null },
        { status: 404 },
      );
    }

    // Safe user object
    const safeUser: SafeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone || undefined,
      image: user.image || undefined,
      role: user.role,
      createdAt: user.createdAt,
    };

    return NextResponse.json({
      success: true,
      user: safeUser,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { success: false, message: "Invalid token", user: null },
      { status: 401 },
    );
  }
}

// DELETE - Logout (clear cookie)
export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  response.cookies.set("auth-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
