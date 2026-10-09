import mongoose, { Document, Schema } from "mongoose";
import { DeviceType, Gender } from "../../types/general.type";

export interface IDriver extends Document {
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

  aadhaar: {
    number: string;
    frontImage: string;
    backImage: string;
  };

  drivingLicense: {
    number: string;
    frontImage: string;
    backImage: string;
    expiryDate: Date;
  };

  accountStatus: "ACTIVE" | "INACTIVE" | "DELETED" | "SUSPENDED";
  formStep: number;
  deletedAt: Date | null;
  deleteReasonId: mongoose.Types.ObjectId | null;
  isNotificationEnabled: boolean;
  suspendedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const driverSchema = new Schema<IDriver>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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

    email: {
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

    aadhaar: {
      number: {
        type: String,
        trim: true,
      },

      frontImage: {
        type: String,
      },

      backImage: {
        type: String,
      },
    },

    drivingLicense: {
      number: {
        type: String,
        trim: true,
      },

      frontImage: {
        type: String,
      },

      backImage: {
        type: String,
      },

      expiryDate: {
        type: Date,
      },
    
    },

    accountStatus: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "DELETED", "SUSPENDED"],
      default: "ACTIVE",
    },

    formStep: {
      type: Number,
      default: 1,
      min: 1,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    deleteReasonId: {
      type: Schema.Types.ObjectId,
      ref: "AccountDeleteReason",
      default: null,
    },

    isNotificationEnabled: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

export const Driver = mongoose.model<IDriver>(
  "Driver",
  driverSchema
);