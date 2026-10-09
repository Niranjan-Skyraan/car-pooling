"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtpSchema = exports.sendOtpSchema = void 0;
const zod_1 = require("zod");
const phoneSchema = zod_1.z.object({
    contactNumber: zod_1.z
        .string()
        .trim()
        .min(10, "Contact number must be at least 10 digits")
        .max(15, "Contact number must not exceed 15 digits")
        .regex(/^\d+$/, "Contact number must contain only digits"),
    purpose: zod_1.z.enum(["SIGNUP", "LOGIN"]),
    countryCode: zod_1.z
        .string()
        .trim()
        .regex(/^\+\d{1,4}$/, "Invalid country code")
        .optional(),
});
exports.sendOtpSchema = phoneSchema;
exports.verifyOtpSchema = phoneSchema.extend({
    otp: zod_1.z
        .string()
        .trim()
        .length(6, "OTP must be exactly 6 digits")
        .regex(/^\d+$/, "OTP must contain only digits"),
    deviceId: zod_1.z.string().min(1, "Device ID is required"),
    name: zod_1.z.string().trim().min(1, "Name cannot be empty").optional(),
    deviceType: zod_1.z.enum(["ANDROID", "IOS"]),
    deviceToken: zod_1.z.string().min(1, "Device token is required"),
});
