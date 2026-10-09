import { z } from "zod";

const phoneSchema = z.object({
  contactNumber: z
    .string()
    .trim()
    .min(10, "Contact number must be at least 10 digits")
    .max(15, "Contact number must not exceed 15 digits")
    .regex(/^\d+$/, "Contact number must contain only digits"),
  purpose: z.enum(["SIGNUP", "LOGIN"]),
  countryCode: z
    .string()
    .trim()
    .regex(/^\+\d{1,4}$/, "Invalid country code")
    .optional(),
});
export const sendOtpSchema = phoneSchema;
export type SendOtp = z.infer<typeof sendOtpSchema>;


export const verifyOtpSchema = phoneSchema.extend({
  otp: z
    .string()
    .trim()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only digits"),
  deviceId: z.string().min(1, "Device ID is required"),
  name: z.string().trim().min(1, "Name cannot be empty").optional(),
  deviceType: z.enum(["ANDROID", "IOS"]),
  deviceToken: z.string().min(1, "Device token is required"),
});


export type VerifyOtp = z.infer<typeof verifyOtpSchema>;


