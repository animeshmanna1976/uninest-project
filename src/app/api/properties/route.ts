import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET - Fetch properties (with filters)
export async function GET(request: NextRequest) {
  try {
    const db = await getDb();

    const searchParams = request.nextUrl.searchParams;
    const landlordId = searchParams.get("landlordId");
    const city = searchParams.get("city");
    const gender = searchParams.get("gender");
    const propertyType = searchParams.get("type");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const amenities = searchParams.get("amenities");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const featured = searchParams.get("featured");

    // Build query
    const query: any = {};

    if (landlordId) {
      query.landlordId = landlordId;
    }

    if (city) {
      query.city = { $regex: city, $options: "i" };
    }

    if (gender && gender !== "ANY") {
      query.genderPreference = { $in: [gender, "ANY"] };
    }

    if (propertyType) {
      query.propertyType = propertyType;
    }

    if (minPrice || maxPrice) {
      query.rent = {};
      if (minPrice) query.rent.$gte = parseInt(minPrice);
      if (maxPrice) query.rent.$lte = parseInt(maxPrice);
    }

    if (amenities) {
      const amenityList = amenities.split(",");
      query.amenities = { $all: amenityList };
    }

    if (status) {
      query.status = status;
    } else {
      // By default, only show active properties (unless landlord is querying their own)
      if (!landlordId) {
        query.status = "ACTIVE";
      }
    }

    if (featured === "true") {
      query.isFeatured = true;
    }

    // Get total count
    const total = await db.collection("properties").countDocuments(query);

    // Fetch properties with pagination
    const properties = await db
      .collection("properties")
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Transform _id to id for frontend
    const transformedProperties = properties.map((p) => ({
      ...p,
      id: p._id.toString(),
      _id: undefined,
    }));

    return NextResponse.json({
      success: true,
      properties: transformedProperties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch properties" },
      { status: 500 },
    );
  }
}

// POST - Create a new property
export async function POST(request: NextRequest) {
  try {
    const db = await getDb();

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "propertyType",
      "address",
      "city",
      "rent",
      "deposit",
      "landlordId",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 },
        );
      }
    }

    // Check if landlord exists - try with ObjectId first, then string
    let landlord = null;
    try {
      landlord = await db.collection("users").findOne({
        _id: new ObjectId(body.landlordId),
        role: "landlord",
      });
    } catch {
      // If ObjectId conversion fails, try finding by string id
      landlord = await db.collection("users").findOne({
        _id: body.landlordId,
        role: "landlord",
      });
    }

    if (!landlord) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid landlord - user not found or not a landlord",
        },
        { status: 400 },
      );
    }

    // Create property object
    const property = {
      // Basic Info
      title: body.title,
      slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: body.description,
      propertyType: body.propertyType,
      bhk: body.bhk || null,

      // Location
      address: body.address,
      city: body.city,
      state: body.state || "West Bengal",
      pincode: body.pincode || "",
      landmark: body.landmark || "",
      latitude: body.latitude || 22.5,
      longitude: body.longitude || 88.4,
      nearbyColleges: body.nearbyColleges || [],

      // Room Details
      totalRooms: body.totalRooms || 1,
      totalBeds: body.totalBeds || 1,
      availableBeds: body.availableBeds || 1,
      bedsPerRoom: body.bedsPerRoom || 1,
      roomSize: body.roomSize || "",
      bathrooms: body.bathrooms || 1,
      floorNumber: body.floorNumber || 1,
      totalFloors: body.totalFloors || 1,

      // Pricing
      rent: body.rent,
      deposit: body.deposit,
      maintenanceCharges: body.maintenanceCharges || 0,
      electricityCharges: body.electricityCharges || "separate",
      waterCharges: body.waterCharges || "included",
      foodIncluded: body.foodIncluded || false,
      foodCharges: body.foodCharges || null,
      mealsPerDay: body.mealsPerDay || 0,

      // Preferences
      genderPreference: body.genderPreference || "ANY",
      occupancyType: body.occupancyType || "double",
      furnishing: body.furnishing || "SEMI_FURNISHED",
      furnishingDetails: body.furnishingDetails || [],

      // Amenities
      amenities: body.amenities || [],

      // Rules
      rules: body.rules || {
        nonVegAllowed: true,
        smokingAllowed: false,
        drinkingAllowed: false,
        petsAllowed: false,
        visitorsAllowed: true,
        oppositeSexAllowed: false,
        gateClosingTime: null,
      },

      // Images
      images: body.images || [],

      // Availability
      availableFrom: body.availableFrom
        ? new Date(body.availableFrom)
        : new Date(),
      minimumStay: body.minimumStay || 6,
      noticePeriod: body.noticePeriod || 1,

      // Ownership
      landlordId: body.landlordId,
      landlordName: landlord.name,
      landlordPhone: landlord.phone || "",

      // Status
      status: body.status || "ACTIVE",
      isVerified: body.isVerified || false,
      isFeatured: body.isFeatured || false,

      // Metrics
      viewCount: 0,
      inquiryCount: 0,
      savedCount: 0,

      // Timestamps
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("properties").insertOne(property);

    // Update landlord's property count
    await db
      .collection("landlordProfiles")
      .updateOne(
        { userId: new ObjectId(body.landlordId) },
        { $inc: { propertyCount: 1 } },
      );

    return NextResponse.json({
      success: true,
      message: "Property created successfully",
      property: {
        ...property,
        id: result.insertedId.toString(),
      },
    });
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create property" },
      { status: 500 },
    );
  }
}

// PUT - Update a property
export async function PUT(request: NextRequest) {
  try {
    const db = await getDb();

    const body = await request.json();
    const { id, landlordId, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Property ID is required" },
        { status: 400 },
      );
    }

    // Find property and verify ownership
    const property = await db.collection("properties").findOne({
      _id: new ObjectId(id),
    });

    if (!property) {
      return NextResponse.json(
        { success: false, message: "Property not found" },
        { status: 404 },
      );
    }

    if (property.landlordId !== landlordId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 },
      );
    }

    // Update property
    const result = await db.collection("properties").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
    );

    return NextResponse.json({
      success: true,
      message: "Property updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error updating property:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update property" },
      { status: 500 },
    );
  }
}

// DELETE - Delete a property
export async function DELETE(request: NextRequest) {
  try {
    const db = await getDb();

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const landlordId = searchParams.get("landlordId");

    if (!id || !landlordId) {
      return NextResponse.json(
        { success: false, message: "Property ID and landlord ID are required" },
        { status: 400 },
      );
    }

    // Find property and verify ownership
    const property = await db.collection("properties").findOne({
      _id: new ObjectId(id),
    });

    if (!property) {
      return NextResponse.json(
        { success: false, message: "Property not found" },
        { status: 404 },
      );
    }

    if (property.landlordId !== landlordId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 },
      );
    }

    // Delete property
    await db.collection("properties").deleteOne({ _id: new ObjectId(id) });

    // Update landlord's property count
    await db
      .collection("landlordProfiles")
      .updateOne(
        { userId: new ObjectId(landlordId) },
        { $inc: { propertyCount: -1 } },
      );

    // Remove from all wishlists
    await db
      .collection("wishlists")
      .updateMany({}, { $pull: { propertyIds: id } as any });

    return NextResponse.json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting property:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete property" },
      { status: 500 },
    );
  }
}
