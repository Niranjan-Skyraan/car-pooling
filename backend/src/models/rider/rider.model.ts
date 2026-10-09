import mongoose, { Document, Schema } from "mongoose";
import { DeviceType, Gender } from "../../types/general.type";
import is from "zod/v4/locales/is.js";

export interface IRider extends Document {
  name: string;
  contactNumber: string;
  countryCode: string;
  email?: string;
  gender: Gender;
  dob: Date;
  profileImage?: string | null;
  deviceId: string | null;
  deviceType: DeviceType;
  deviceToken: string | null;
  phoneVerification: {
    isVerified: boolean;
  };
  isNotificationEnabled: boolean;
  isProfileCompleted: boolean;
  deletedAt: Date | null;
  deleteReasonId: Schema.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const riderSchema = new Schema<IRider>(
  {
    name: {
      type:String, 
      required: true,
      trim:true
    },

    countryCode: {
      type: String,
      trim: true,
      default: "+91",
    },
    
    contactNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email:{
      type: String,
      trim: true,
      lowercase: true,
    },
    
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
    },

    dob: {
      type: Date,
    },
    
    deviceId: {
      type: String,
      default: null,
    },

    deviceType: {
      type: String,
      enum: ["ANDROID", "IOS"],
      default: null,
    },

    deviceToken: {
      type: String,
      default: null,
    },

    phoneVerification: {
      isVerified: {
        type: Boolean,
        default: false,
      },
    },

    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
    isNotificationEnabled: {
      type: Boolean,
      default: true,  
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    deleteReasonId: {
      type: Schema.Types.ObjectId,
      ref: "RiderAccountDeleteReason",
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

export const Rider = mongoose.model<IRider>("Rider", riderSchema);