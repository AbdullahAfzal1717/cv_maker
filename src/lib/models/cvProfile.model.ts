import mongoose, { HydratedDocument, Model, Schema, Types } from "mongoose";
import { IResumeData, ResumeDataSchema } from "./resumeData.schema";

export interface ICVProfile {
  _id: string;
  userId: Types.ObjectId;

  profileName: string;
  isMainProfile: boolean;
  status: "incomplete" | "complete";
  isAiGenerated: boolean;

  resumeData: IResumeData;

  createdAt: Date;
  updatedAt: Date;
}

export type CVProfileDocument = HydratedDocument<ICVProfile>;

type CVProfileModel = Model<ICVProfile>;

const CVProfileSchema = new Schema<ICVProfile, CVProfileModel>(
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

    profileName: {
      type: String,
      default: "My Resume",
    },

    isMainProfile: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["incomplete", "complete"],
      default: "incomplete",
    },

    isAiGenerated: {
      type: Boolean,
      default: false,
    },

    resumeData: {
      type: ResumeDataSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  },
);

const CVProfile =
  (mongoose.models.CVProfile as CVProfileModel) ||
  mongoose.model<ICVProfile, CVProfileModel>("CVProfile", CVProfileSchema);

export default CVProfile;
