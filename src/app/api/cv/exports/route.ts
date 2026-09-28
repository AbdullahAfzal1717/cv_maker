import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import CVProfile from "@/lib/models/cvProfile.model";
import CVExport from "@/lib/models/cvExport.model";
import { getUserFromRequest } from "@/lib/middleware/auth";
import { hashResumeData, buildExportLabel } from "@/lib/utils/contentHash";
import { ApiError } from "@/lib/utils/ApiError";

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    await connectDB();
    const exports = await CVExport.find({ userId: user._id }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: exports });
  } catch (error: unknown) {
    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, message }, { status: statusCode });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    await connectDB();
    const { _id, profileId, profileName, resumeData } = await request.json();

    if (!profileId || !resumeData) {
      throw new ApiError("profileId and resumeData are required.", 400);
    }

    const profile = await CVProfile.findOne({ _id: profileId, userId: user._id });
    if (!profile) {
      throw new ApiError("CV Profile not found", 404);
    }

    const snapshotName = profileName || profile.profileName;
    const contentHash = hashResumeData(resumeData);
    const exportDoc = new CVExport({
      _id: _id || crypto.randomUUID(),
      userId: user._id,
      profileId,
      exportLabel: buildExportLabel(snapshotName),
      profileNameSnapshot: snapshotName,
      contentHash,
      resumeData,
    });

    await exportDoc.save();

    return NextResponse.json({ success: true, data: exportDoc }, { status: 201 });
  } catch (error: unknown) {
    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, message }, { status: statusCode });
  }
}