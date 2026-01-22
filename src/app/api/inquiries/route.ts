import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET - Fetch inquiries (for student or landlord)
export async function GET(request: NextRequest) {
  try {
    const db = await getDb();

    const searchParams = request.nextUrl.searchParams;
    const studentId = searchParams.get("studentId");
    const landlordId = searchParams.get("landlordId");
    const propertyId = searchParams.get("propertyId");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Build query
    const query: any = {};

    if (studentId) {
      query.studentId = studentId;
    }

    if (landlordId) {
      query.landlordId = landlordId;
    }

    if (propertyId) {
      query.propertyId = propertyId;
    }

    if (status) {
      query.status = status;
    }

    // Get total count
    const total = await db.collection("inquiries").countDocuments(query);

    // Fetch inquiries with pagination
    const inquiries = await db
      .collection("inquiries")
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Get property details for each inquiry
    const propertyIds = [...new Set(inquiries.map((i) => i.propertyId))];
    const properties = await db
      .collection("properties")
      .find({
        _id: {
          $in: propertyIds.map((id) => {
            try {
              return new ObjectId(id);
            } catch {
              return id;
            }
          }),
        },
      })
      .toArray();

    const propertyMap = new Map(properties.map((p) => [p._id.toString(), p]));

    // Transform inquiries with property details
    const transformedInquiries = inquiries.map((inquiry) => {
      const property = propertyMap.get(inquiry.propertyId);
      return {
        ...inquiry,
        id: inquiry._id.toString(),
        _id: undefined,
        property: property
          ? {
              id: property._id.toString(),
              title: property.title,
              slug: property.slug,
              city: property.city,
              rent: property.rent,
              image: property.images?.[0]?.url,
            }
          : null,
      };
    });

    return NextResponse.json({
      success: true,
      inquiries: transformedInquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch inquiries" },
      { status: 500 },
    );
  }
}

// POST - Create a new inquiry
export async function POST(request: NextRequest) {
  try {
    const db = await getDb();

    const body = await request.json();

    // Validate required fields
    const requiredFields = ["propertyId", "studentId", "message"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 },
        );
      }
    }

    // Get property to find landlord
    let property;
    try {
      property = await db.collection("properties").findOne({
        _id: new ObjectId(body.propertyId),
      });
    } catch {
      property = await db.collection("properties").findOne({
        slug: body.propertyId,
      });
    }

    if (!property) {
      return NextResponse.json(
        { success: false, message: "Property not found" },
        { status: 404 },
      );
    }

    // Get student details
    const student = await db.collection("users").findOne({
      _id: new ObjectId(body.studentId),
    });

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 },
      );
    }

    // Check for existing pending inquiry
    const existingInquiry = await db.collection("inquiries").findOne({
      propertyId: property._id.toString(),
      studentId: body.studentId,
      status: { $in: ["PENDING", "CONTACTED"] },
    });

    if (existingInquiry) {
      return NextResponse.json(
        {
          success: false,
          message: "You already have a pending inquiry for this property",
        },
        { status: 400 },
      );
    }

    // Create inquiry
    const inquiry = {
      propertyId: property._id.toString(),
      landlordId: property.landlordId,
      studentId: body.studentId,
      studentName: student.name,
      studentEmail: student.email,
      studentPhone: student.phone || body.phone || "",
      message: body.message,
      preferredMoveIn: body.preferredMoveIn
        ? new Date(body.preferredMoveIn)
        : null,
      status: "PENDING", // PENDING, CONTACTED, SCHEDULED, VISITED, RENTED, REJECTED, CANCELLED
      scheduledVisit: null,
      landlordNotes: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("inquiries").insertOne(inquiry);

    // Increment inquiry count on property
    await db
      .collection("properties")
      .updateOne({ _id: property._id }, { $inc: { inquiryCount: 1 } });

    return NextResponse.json({
      success: true,
      message: "Inquiry sent successfully",
      inquiry: {
        ...inquiry,
        id: result.insertedId.toString(),
      },
    });
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create inquiry" },
      { status: 500 },
    );
  }
}

// PUT - Update an inquiry (landlord response, status change)
export async function PUT(request: NextRequest) {
  try {
    const db = await getDb();

    const body = await request.json();
    const { id, userId, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Inquiry ID is required" },
        { status: 400 },
      );
    }

    // Find inquiry
    const inquiry = await db.collection("inquiries").findOne({
      _id: new ObjectId(id),
    });

    if (!inquiry) {
      return NextResponse.json(
        { success: false, message: "Inquiry not found" },
        { status: 404 },
      );
    }

    // Verify user is landlord or student of this inquiry
    if (inquiry.landlordId !== userId && inquiry.studentId !== userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 },
      );
    }

    // Prepare update data
    const updates: any = {
      updatedAt: new Date(),
    };

    if (updateData.status) {
      updates.status = updateData.status;
    }

    if (updateData.scheduledVisit) {
      updates.scheduledVisit = new Date(updateData.scheduledVisit);
      updates.status = "SCHEDULED";
    }

    if (updateData.landlordNotes !== undefined) {
      updates.landlordNotes = updateData.landlordNotes;
    }

    // Update inquiry
    await db
      .collection("inquiries")
      .updateOne({ _id: new ObjectId(id) }, { $set: updates });

    return NextResponse.json({
      success: true,
      message: "Inquiry updated successfully",
    });
  } catch (error) {
    console.error("Error updating inquiry:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update inquiry" },
      { status: 500 },
    );
  }
}

// DELETE - Cancel an inquiry (student only)
export async function DELETE(request: NextRequest) {
  try {
    const db = await getDb();

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const studentId = searchParams.get("studentId");

    if (!id || !studentId) {
      return NextResponse.json(
        { success: false, message: "Inquiry ID and student ID are required" },
        { status: 400 },
      );
    }

    // Find inquiry and verify ownership
    const inquiry = await db.collection("inquiries").findOne({
      _id: new ObjectId(id),
    });

    if (!inquiry) {
      return NextResponse.json(
        { success: false, message: "Inquiry not found" },
        { status: 404 },
      );
    }

    if (inquiry.studentId !== studentId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 },
      );
    }

    // Update status to cancelled instead of deleting
    await db
      .collection("inquiries")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: "CANCELLED", updatedAt: new Date() } },
      );

    return NextResponse.json({
      success: true,
      message: "Inquiry cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling inquiry:", error);
    return NextResponse.json(
      { success: false, message: "Failed to cancel inquiry" },
      { status: 500 },
    );
  }
}
