import mongoose, { Document, Schema } from "mongoose";

export interface IAccountDeleteReason extends Document {
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}

const accountDeleteReasonSchema = new Schema<IAccountDeleteReason>(
  {
    reason: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export const AccountDeleteReason =
  mongoose.model<IAccountDeleteReason>(
    "DriverAccountDeleteReason",
    accountDeleteReasonSchema
  );