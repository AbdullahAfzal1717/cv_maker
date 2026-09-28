import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "../mongodb";
import User from "../models/user.model";
import { ApiError } from "../utils/ApiError";

export async function getUserFromRequest(request: NextRequest) {
  // Step 1: Extract token from Authorization header
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError("Access denied. No token provided", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    // Step 2: Verify the token is valid and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    // Step 3: Connect to DB and find the user
    await connectDB();
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new ApiError("Token is not valid", 401);
    }

    return user;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Token is not valid", 401);
  }
}
