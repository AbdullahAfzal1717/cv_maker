import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ChatSession from "@/lib/models/chatSession.model";
import { getUserFromRequest } from "@/lib/middleware/auth";
import { ApiError } from "@/lib/utils/ApiError";

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    await connectDB();
    const sessions = await ChatSession.find(
      { userId: user._id },
      { title: 1, isPinned: 1, updatedAt: 1 },
    )
      .sort({ updatedAt: -1 })
      .lean();
    return NextResponse.json({ success: true, sessions });
  } catch (error: unknown) {
    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, message }, { status: statusCode });
  }
}