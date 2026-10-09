"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const driver_model_1 = require("../../models/driver/driver.model");
const otp_model_1 = require("../../models/common/otp.model");
const jwt_util_1 = require("../../utils/jwt.util");
const otp_util_1 = require("../../utils/otp.util");
class AuthService {
    async sendOtp(data) {
        const { contactNumber, countryCode, purpose } = data;
        // Check whether the phone number is already registered
        const existingDriver = await driver_model_1.Driver.findOne({
            contactNumber,
            countryCode,
        });
        if (existingDriver && purpose === "SIGNUP") {
            return {
                success: false,
                statusCode: 409,
                data: {},
                message: "This phone number is already registered",
            };
        }
        if (!existingDriver && purpose === "LOGIN") {
            return {
                success: false,
                statusCode: 404,
                data: {},
                message: "Phone number is not registered",
            };
        }
        // Check whether an OTP was recently sent
        const recentOtp = await otp_model_1.Otp.findOne({
            contactNumber,
            purpose: purpose,
            isVerified: false,
            countryCode,
            role: "DRIVER",
            createdAt: {
                $gte: new Date(Date.now() - 60 * 1000),
            },
        });
        if (recentOtp) {
            return {
                success: false,
                statusCode: 429,
                data: {},
                message: "Please wait before requesting another OTP",
            };
        }
        // Generate 6 digit OTP
        const otp = (0, otp_util_1.generateOtp)(6);
        // OTP expires in 5 minutes
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        // Invalidate previous signup OTPs
        await otp_model_1.Otp.updateMany({
            contactNumber,
            purpose: purpose,
            isVerified: false,
            role: "DRIVER",
        }, {
            $set: {
                isVerified: true,
            },
        });
        // Create new OTP
        await otp_model_1.Otp.create({
            contactNumber,
            countryCode,
            otp,
            purpose: purpose,
            expiresAt,
            isVerified: false,
            attempts: 0,
            role: "DRIVER",
        });
        // TODO:
        // Send OTP through SMS provider
        // await sendSms(contactNumber, otp);
        return {
            success: true,
            statusCode: 200,
            data: { otp: otp }, // For testing purposes, return the OTP in the response. Remove this in production.
            message: "OTP sent successfully",
        };
    }
    async verifyOtp(data) {
        const { contactNumber, countryCode, otp, purpose, deviceId, deviceType, deviceToken, name, } = data;
        const otpRecord = await otp_model_1.Otp.findOne({
            contactNumber,
            purpose: purpose,
            isVerified: false,
            role: "DRIVER",
            countryCode,
        }).sort({ createdAt: -1 });
        if (!otpRecord) {
            return {
                success: false,
                statusCode: 400,
                data: {},
                message: "OTP not found or already used",
            };
        }
        if (otpRecord.expiresAt < new Date()) {
            return {
                success: false,
                statusCode: 400,
                message: "OTP has expired",
            };
        }
        if (otpRecord.otp !== otp) {
            otpRecord.attempts += 1;
            await otpRecord.save();
            return {
                success: false,
                statusCode: 400,
                data: {},
                message: "Invalid OTP",
            };
        }
        otpRecord.isVerified = true;
        await otpRecord.save();
        const driver = await driver_model_1.Driver.create({
            contactNumber,
            countryCode,
            name: name,
            deviceId: deviceId,
            deviceType: deviceType,
            deviceToken: deviceToken,
        });
        const accessToken = (0, jwt_util_1.generateAccessToken)({
            userId: driver._id.toString(),
            role: "DRIVER",
            deviceId: "some-device-id",
        });
        const refreshToken = (0, jwt_util_1.generateRefreshToken)({
            userId: driver._id.toString(),
            role: "DRIVER",
            deviceId: "some-device-id",
        });
        return {
            success: true,
            statusCode: 200,
            data: {
                accessToken,
                refreshToken,
            },
            message: "OTP verified successfully",
        };
    }
    async login(data) {
        debugger;
        const { contactNumber, countryCode, otp, purpose, deviceId, deviceType, deviceToken } = data;
        const otpRecord = await otp_model_1.Otp.findOne({
            contactNumber,
            purpose: purpose,
            isVerified: false,
            role: "DRIVER",
            countryCode,
        }).sort({ createdAt: -1 });
        if (!otpRecord) {
            return {
                success: false,
                statusCode: 400,
                data: {},
                message: "OTP not found or already used",
            };
        }
        if (otpRecord.expiresAt < new Date()) {
            return {
                success: false,
                statusCode: 400,
                data: {},
                message: "OTP has expired",
            };
        }
        if (otpRecord.otp !== otp) {
            otpRecord.attempts += 1;
            await otpRecord.save();
            return {
                success: false,
                statusCode: 400,
                data: {},
                message: "Invalid OTP",
            };
        }
        const driver = await driver_model_1.Driver.findOne({
            contactNumber,
            countryCode,
        });
        console.log(driver);
        if (!driver) {
            return {
                success: false,
                statusCode: 404,
                data: {},
                message: "Driver account not found",
            };
        }
        otpRecord.isVerified = true;
        await otpRecord.save();
        driver.deviceId = deviceId;
        driver.deviceType = deviceType;
        driver.deviceToken = deviceToken;
        await driver.save();
        const accessToken = (0, jwt_util_1.generateAccessToken)({
            userId: driver._id.toString(),
            role: "DRIVER",
            deviceId: "some-device-id",
        });
        const refreshToken = (0, jwt_util_1.generateRefreshToken)({
            userId: driver._id.toString(),
            role: "DRIVER",
            deviceId: "some-device-id",
        });
        return {
            success: true,
            statusCode: 200,
            data: {
                accessToken,
                refreshToken,
            },
            message: "Login successful",
        };
    }
}
exports.default = new AuthService();
