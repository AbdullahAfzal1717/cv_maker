import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ChatSession from "@/lib/models/chatSession.model";
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
    const session = await ChatSession.findById(id).lean();
    if (!session) {
      throw new ApiError("Session not found", 404);
    }
    if (session.userId.toString() !== user._id.toString()) {
      throw new ApiError("Unauthorized access", 403);
    }
    return NextResponse.json({ success: true, session });
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getUserFromRequest(request);
    await connectDB();
    const { id } = await params;
    const { title, isPinned } = await request.json();

    const session = await ChatSession.findById(id);
    if (!session) {
      throw new ApiError("Session not found", 404);
    }
    if (session.userId.toString() !== user._id.toString()) {
      throw new ApiError("Unauthorized access", 403);
    }

    if (title !== undefined) {
      if (!title.trim()) {
        throw new ApiError("Title cannot be empty", 400);
      }
      session.title = title.trim();
    }
    if (isPinned !== undefined) {
      session.isPinned = Boolean(isPinned);
    }

    await session.save();
    return NextResponse.json({ success: true, session });
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getUserFromRequest(request);
    await connectDB();
    const { id } = await params;
    const session = await ChatSession.findById(id);
    if (!session) {
      throw new ApiError("Session not found", 404);
    }
    if (session.userId.toString() !== user._id.toString()) {
      throw new ApiError("Unauthorized access", 403);
    }
    await ChatSession.deleteOne({ _id: id });
    return NextResponse.json({ success: true, message: "Session deleted" });
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
