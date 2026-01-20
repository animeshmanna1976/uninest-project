import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

// Default user ID (since we don't have auth)
const DEFAULT_USER_ID = "guest-user";

// GET - Fetch wishlist
export async function GET() {
  try {
    const db = await getDb();
    const wishlistCollection = db.collection("wishlists");

    const wishlist = await wishlistCollection.findOne({
      userId: DEFAULT_USER_ID,
    });

    if (!wishlist) {
      return NextResponse.json({ propertyIds: [] });
    }

    return NextResponse.json({ propertyIds: wishlist.propertyIds || [] });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 },
    );
  }
}

// POST - Add to wishlist
export async function POST(request: NextRequest) {
  try {
    const { propertyId } = await request.json();

    if (!propertyId) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const wishlistCollection = db.collection("wishlists");

    // Upsert - add propertyId to array if not exists
    await wishlistCollection.updateOne(
      { userId: DEFAULT_USER_ID },
      {
        $addToSet: { propertyIds: propertyId },
        $set: { updatedAt: new Date() },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true },
    );

    // Fetch updated wishlist
    const wishlist = await wishlistCollection.findOne({
      userId: DEFAULT_USER_ID,
    });

    return NextResponse.json({
      message: "Added to wishlist",
      propertyIds: wishlist?.propertyIds || [],
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json(
      { error: "Failed to add to wishlist" },
      { status: 500 },
    );
  }
}

// DELETE - Remove from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");
    const clearAll = searchParams.get("clearAll");

    const db = await getDb();
    const wishlistCollection = db.collection("wishlists");

    if (clearAll === "true") {
      // Clear entire wishlist
      await wishlistCollection.updateOne(
        { userId: DEFAULT_USER_ID },
        {
          $set: { propertyIds: [], updatedAt: new Date() },
        },
      );

      return NextResponse.json({
        message: "Wishlist cleared",
        propertyIds: [],
      });
    }

    if (!propertyId) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 },
      );
    }

    // Remove propertyId from array
    await wishlistCollection.updateOne(
      { userId: DEFAULT_USER_ID },
      {
        $pull: { propertyIds: propertyId } as any,
        $set: { updatedAt: new Date() },
      },
    );

    // Fetch updated wishlist
    const wishlist = await wishlistCollection.findOne({
      userId: DEFAULT_USER_ID,
    });

    return NextResponse.json({
      message: "Removed from wishlist",
      propertyIds: wishlist?.propertyIds || [],
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return NextResponse.json(
      { error: "Failed to remove from wishlist" },
      { status: 500 },
    );
  }
}

// PUT - Toggle wishlist (add if not exists, remove if exists)
export async function PUT(request: NextRequest) {
  try {
    const { propertyId } = await request.json();

    if (!propertyId) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const wishlistCollection = db.collection("wishlists");

    // Check if property is in wishlist
    const wishlist = await wishlistCollection.findOne({
      userId: DEFAULT_USER_ID,
      propertyIds: propertyId,
    });

    if (wishlist) {
      // Remove from wishlist
      await wishlistCollection.updateOne(
        { userId: DEFAULT_USER_ID },
        {
          $pull: { propertyIds: propertyId } as any,
          $set: { updatedAt: new Date() },
        },
      );
    } else {
      // Add to wishlist
      await wishlistCollection.updateOne(
        { userId: DEFAULT_USER_ID },
        {
          $addToSet: { propertyIds: propertyId },
          $set: { updatedAt: new Date() },
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true },
      );
    }

    // Fetch updated wishlist
    const updatedWishlist = await wishlistCollection.findOne({
      userId: DEFAULT_USER_ID,
    });

    return NextResponse.json({
      message: wishlist ? "Removed from wishlist" : "Added to wishlist",
      propertyIds: updatedWishlist?.propertyIds || [],
      isInWishlist: !wishlist,
    });
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    return NextResponse.json(
      { error: "Failed to toggle wishlist" },
      { status: 500 },
    );
  }
}
