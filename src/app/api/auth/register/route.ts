import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/user.model";
import { generateToken } from "@/lib/utils/generateToken";
import { ApiError } from "@/lib/utils/ApiError";

function formatUser(user: {
  _id: unknown;
  username: string;
  email: string;
  profilePicture?: string;
}) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    profilePicture: user.profilePicture || "",
  };
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      throw new ApiError("username, email and password are required", 400);
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      throw new ApiError(
        "User already exists with this email or username",
        400,
      );
    }

    const user = await User.create({ username, email, password });
    const token = generateToken(user._id.toString());

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      data: { user: formatUser(user), token },
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
