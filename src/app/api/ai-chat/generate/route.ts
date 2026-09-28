import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ChatSession from "@/lib/models/chatSession.model";
import { getUserFromRequest } from "@/lib/middleware/auth";
import {
  isSessionVague,
  generateCVExtraction,
} from "@/lib/services/aiChat.service";
import { ApiError } from "@/lib/utils/ApiError";

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    await connectDB();
    const { sessionId } = await request.json();

    if (!sessionId) {
      throw new ApiError("sessionId is required", 400);
    }

    const session = await ChatSession.findById(sessionId);
    if (!session) {
      throw new ApiError("Session not found", 404);
    }
    if (session.userId.toString() !== user._id.toString()) {
      throw new ApiError("Unauthorized access to session", 403);
    }

    const userMessages = session.messages.filter((m) => m.role === "user");
    const rawCombinedText = userMessages.map((m) => m.text).join(" ");

    const hasIdentity =
      /([A-Z][a-z]+ [A-Z][a-z]+)/.test(rawCombinedText) ||
      /(my name is|i am|i'm)\s+[a-z]+/i.test(rawCombinedText);
    const hasContact =
      /[\w.-]+@[\w.-]+\.\w+/.test(rawCombinedText) ||
      /(?:\+?[\d][\d\s-]{6,})/.test(rawCombinedText);

    if (isSessionVague(session.messages) || !hasIdentity || !hasContact) {
      throw new ApiError(
        "Please share your name and either an email or phone number before generating your CV.",
        400,
      );
    }

    const { data: resumeData, droppedFields } = await generateCVExtraction(
      session.messages,
    );
    return NextResponse.json({ success: true, resumeData, droppedFields });
  } catch (error: unknown) {
    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, message }, { status: statusCode });
  }
}