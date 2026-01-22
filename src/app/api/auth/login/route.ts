import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { LoginRequest, SafeUser } from "@/types/auth";

const JWT_SECRET =
  process.env.JWT_SECRET || "uninest-secret-key-change-in-production";

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const usersCollection = db.collection("users");

    // Find user
    const user = await usersCollection.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    // Safe user object (without password)
    const safeUser: SafeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone || undefined,
      image: user.image || undefined,
      role: user.role,
      createdAt: user.createdAt,
    };

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
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
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Login failed" },
      { status: 500 },
    );
  }
}
