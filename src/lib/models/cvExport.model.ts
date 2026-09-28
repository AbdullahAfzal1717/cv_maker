import mongoose, { HydratedDocument, Model, Schema, Types } from "mongoose";
import { IResumeData, ResumeDataSchema } from "./resumeData.schema";

export interface ICVExport {
  _id: string;

  userId: Types.ObjectId;

  profileId: string;

  exportLabel: string;

  profileNameSnapshot: string;

  contentHash: string;

  resumeData: IResumeData;

  createdAt: Date;
  updatedAt: Date;
}

export type CVExportDocument = HydratedDocument<ICVExport>;

type CVExportModel = Model<ICVExport>;

const CVExportSchema = new Schema<ICVExport, CVExportModel>(
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

    profileId: {
      type: String,
      required: true,
    },

    exportLabel: {
      type: String,
      required: true,
      trim: true,
    },

    profileNameSnapshot: {
      type: String,
      required: true,
      trim: true,
    },

    contentHash: {
      type: String,
      required: true,
    },

    resumeData: {
      type: ResumeDataSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const CVExport =
  (mongoose.models.CVExport as CVExportModel) ||
  mongoose.model<ICVExport, CVExportModel>("CVExport", CVExportSchema);

export default CVExport;
