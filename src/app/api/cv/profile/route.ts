import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CVProfile from "@/lib/models/cvProfile.model";
import { getUserFromRequest } from "@/lib/middleware/auth";
import { ApiError } from "@/lib/utils/ApiError";

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    await connectDB();
    const profiles = await CVProfile.find({ userId: user._id }).sort({
      updatedAt: -1,
    });
    return NextResponse.json({ success: true, data: profiles });
  } catch (error: unknown) {
    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, message },
      { status: statusCode },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    await connectDB();
    const { _id, profileName, isMainProfile, status, resumeData } =
      await request.json();

    let profile = await CVProfile.findOne({ _id, userId: user._id });

    if (profile) {
      profile.profileName = profileName || profile.profileName;
      profile.isMainProfile =
        isMainProfile !== undefined ? isMainProfile : profile.isMainProfile;
      profile.status = status || profile.status;
      profile.resumeData = resumeData || profile.resumeData;
      await profile.save();
    } else {
      profile = new CVProfile({
        _id,
        userId: user._id,
        profileName: profileName || "My Resume",
        isMainProfile: isMainProfile || false,
        status: status || "incomplete",
        resumeData: resumeData || {},
      });
      await profile.save();
    }

    if (isMainProfile === true) {
      await CVProfile.updateMany(
        { userId: user._id, _id: { $ne: profile._id } },
        { isMainProfile: false },
        { timestamps: false },
      );
    }

    return NextResponse.json({ success: true, data: profile });
  } catch (error: unknown) {
    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, message },
      { status: statusCode },
    );
  }
}
