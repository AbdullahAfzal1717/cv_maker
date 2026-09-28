import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ChatSession from "@/lib/models/chatSession.model";
import { getUserFromRequest } from "@/lib/middleware/auth";
import {
  isSessionVague,
  generateChatResponse,
  generateSessionTitle,
} from "@/lib/services/aiChat.service";
import { ApiError } from "@/lib/utils/ApiError";

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    await connectDB();
    const { sessionId, text } = await request.json();

    if (!sessionId || !text) {
      throw new ApiError("sessionId and text are required", 400);
    }

    let session = await ChatSession.findById(sessionId);

    if (!session) {
      session = new ChatSession({
        _id: sessionId,
        userId: user._id,
        messages: [],
      });
    }

    if (session.userId.toString() !== user._id.toString()) {
      throw new ApiError("Unauthorized access to session", 403);
    }

    const userMessage = { role: "user" as const, text, timestamp: new Date() };
    session.messages.push(userMessage);

    const userMessages = session.messages.filter((m) => m.role === "user");
    if (userMessages.length === 1 && isSessionVague(session.messages)) {
      const cannedReply = {
        role: "model" as const,
        text: "Could you tell me a bit about your professional background?",
        timestamp: new Date(),
      };
      session.messages.push(cannedReply);
      await session.save();
      return NextResponse.json({ success: true, message: cannedReply });
    }

    const isFirstRealMessage =
      session.title === "New Chat" &&
      userMessages.length === 1 &&
      !isSessionVague(session.messages);

    let replyText: string;
    let generatedTitle: string | null = null;

    if (isFirstRealMessage) {
      const [rText, tText] = await Promise.all([
        generateChatResponse(session.messages),
        generateSessionTitle(text),
      ]);
      replyText = rText;
      generatedTitle = tText;
    } else {
      replyText = await generateChatResponse(session.messages);
    }

    const modelMessage = {
      role: "model" as const,
      text: replyText,
      timestamp: new Date(),
    };
    session.messages.push(modelMessage);

    if (isFirstRealMessage && generatedTitle) {
      session.title = generatedTitle;
    }

    await session.save();

    const responsePayload: Record<string, unknown> = {
      success: true,
      message: modelMessage,
    };
    if (isFirstRealMessage && generatedTitle) {
      responsePayload.title = generatedTitle;
    }
    return NextResponse.json(responsePayload);
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
