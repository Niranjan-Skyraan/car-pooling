
import mongoose, { Document, Schema } from "mongoose";
import { OtpPurpose, UserRole } from "../../types/general.type";


export interface IOtp extends Document {
  contactNumber: string;
  countryCode?: string;
  otp: string;
  purpose: OtpPurpose;
  role: UserRole;
  expiresAt: Date;
  isVerified: boolean;
  attempts: number;
  createdAt: Date;
  updatedAt: Date;
}

const otpSchema = new Schema<IOtp>(
  {
    contactNumber: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    countryCode: {
      type: String,
      trim: true,
    },

    otp: {
      type: String,
      required: true,
    },

    purpose: {
      type: String,
      enum: ["SIGNUP", "LOGIN"],
      required: true,
    },

    role: {
      type: String,
      enum: ["DRIVER", "RIDER"],
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    attempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Automatically delete expired OTP documents.
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Otp = mongoose.model<IOtp>("Otp", otpSchema);
