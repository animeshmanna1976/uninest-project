import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RegisterRequest, SafeUser } from "@/types/auth";

const JWT_SECRET =
  process.env.JWT_SECRET || "uninest-secret-key-change-in-production";

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();
    const { name, email, password, phone, role } = body;

    // Validation
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    if (!["student", "landlord"].includes(role)) {
      return NextResponse.json(
        { success: false, message: "Invalid role" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const usersCollection = db.collection("users");

    // Check if user exists
    const existingUser = await usersCollection.findOne({
      email: email.toLowerCase(),
    });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const userId = `user-${Date.now()}`;
    const now = new Date();

    const newUser = {
      id: userId,
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      phone: phone || null,
      image: null,
      role,
      createdAt: now,
      updatedAt: now,
    };

    await usersCollection.insertOne(newUser);

    // Create profile based on role
    if (role === "student") {
      const profilesCollection = db.collection("studentProfiles");
      await profilesCollection.insertOne({
        userId,
        college: null,
        course: null,
        year: null,
        city: null,
        bio: null,
        createdAt: now,
      });
    } else if (role === "landlord") {
      const profilesCollection = db.collection("landlordProfiles");
      await profilesCollection.insertOne({
        userId,
        companyName: null,
        address: null,
        city: null,
        isVerified: false,
        totalProperties: 0,
        responseRate: 0,
        responseTime: 60,
        createdAt: now,
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId, email: newUser.email, role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Safe user object (without password)
    const safeUser: SafeUser = {
      id: userId,
      email: newUser.email,
      name: newUser.name,
      phone: newUser.phone || undefined,
      image: newUser.image || undefined,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      message: "Registration successful",
      user: safeUser,
      token,
    });

    // Set HTTP-only cookie for token
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Registration failed" },
      { status: 500 },
    );
  }
}
