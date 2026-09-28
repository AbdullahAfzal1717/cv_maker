import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CVExport from "@/lib/models/cvExport.model";
import { getUserFromRequest } from "@/lib/middleware/auth";
import { ApiError } from "@/lib/utils/ApiError";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getUserFromRequest(request);
    await connectDB();
    const { id } = await params;
    const exportDoc = await CVExport.findOne({ _id: id, userId: user._id });
    if (!exportDoc) {
      throw new ApiError("CV Export not found", 404);
    }
    return NextResponse.json({ success: true, data: exportDoc });
  } catch (error: unknown) {
    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, message }, { status: statusCode });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getUserFromRequest(request);
    await connectDB();
    const { id } = await params;
    const result = await CVExport.deleteOne({ _id: id, userId: user._id });
    if (result.deletedCount === 0) {
      throw new ApiError("CV Export not found", 404);
    }
    return NextResponse.json({ success: true, message: "CV Export deleted successfully" });
  } catch (error: unknown) {
    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, message }, { status: statusCode });
  }
}