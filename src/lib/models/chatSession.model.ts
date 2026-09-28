import mongoose, { HydratedDocument, Model, Schema, Types } from "mongoose";

export interface IChatMessage {
  role: "user" | "model" | "system";
  text: string;
  timestamp: Date;
}

export interface IChatSession {
  _id: string;

  userId: Types.ObjectId;

  title: string;

  isPinned: boolean;

  messages: IChatMessage[];

  createdAt: Date;
  updatedAt: Date;
}

export type ChatSessionDocument = HydratedDocument<IChatSession>;

type ChatSessionModel = Model<IChatSession>;

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    role: {
      type: String,
      enum: ["user", "model", "system"],
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  },
);

const ChatSessionSchema = new Schema<IChatSession, ChatSessionModel>(
  {
    _id: {
      type: String,
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      default: "New Chat",
      trim: true,
    },

    isPinned: {
      type: Boolean,
      default: false,
    },

    messages: {
      type: [ChatMessageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const ChatSession =
  (mongoose.models.ChatSession as ChatSessionModel) ||
  mongoose.model<IChatSession, ChatSessionModel>(
    "ChatSession",
    ChatSessionSchema,
  );

export default ChatSession;
