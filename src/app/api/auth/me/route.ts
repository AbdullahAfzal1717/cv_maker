import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/middleware/auth";
import { ApiError } from "@/lib/utils/ApiError";

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
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
