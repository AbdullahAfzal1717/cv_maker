import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/user.model";
import { getUserFromRequest } from "@/lib/middleware/auth";
import { ApiError } from "@/lib/utils/ApiError";

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getUserFromRequest(request);
    const updateData = await request.json();

    delete updateData.password;
    delete updateData.email;

    const user = await User.findByIdAndUpdate(
      currentUser._id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture || "",
        },
      },
    });
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
