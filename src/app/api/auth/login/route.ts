import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/user.model";
import { generateToken } from "@/lib/utils/generateToken";
import { ApiError } from "@/lib/utils/ApiError";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { login, password } = await request.json();

    if (!login || !password) {
      throw new ApiError("login and password are required", 400);
    }

    const user = await User.findOne({
      email: login.toLowerCase().trim(),
    }).select("+password");

    if (!user) {
      throw new ApiError("Invalid credentials", 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError("Invalid credentials", 401);
    }

    const token = generateToken(user._id.toString());

    return NextResponse.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture || "",
        },
        token,
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
