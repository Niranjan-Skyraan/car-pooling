import { IOtp, ISignupLogin } from "../../interface/common/IAuth";
import { IServiceResponse } from "../../interface/common/IServiceResponse";
import { Driver } from "../../models/driver/driver.model";
import { Otp } from "../../models/common/otp.model";
import {
  generateAccessToken,
  generateRefreshToken,
  JwtPayload,
} from "../../utils/jwt.util";
import { generateOtp } from "../../utils/otp.util";

class AuthService {
  public async sendOtp(data: IOtp): Promise<IServiceResponse> {
    const { contactNumber, countryCode, purpose } = data;

    // Check whether the phone number is already registered
    const existingDriver = await Driver.findOne({
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

    if(!existingDriver && purpose === "LOGIN") {
      return {
        success: false,
        statusCode: 404,
        data: {},
        message: "Phone number is not registered",
      };
    }

    // Check whether an OTP was recently sent
    const recentOtp = await Otp.findOne({
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
    const otp = generateOtp(6);

    // OTP expires in 5 minutes
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Invalidate previous signup OTPs
    await Otp.updateMany(
      {
        contactNumber,
        purpose: purpose,
        isVerified: false,
        role: "DRIVER",
      },
      {
        $set: {
          isVerified: true,
        },
      },
    );

    // Create new OTP
    await Otp.create({
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

  public async verifyOtp(data: ISignupLogin): Promise<IServiceResponse> {
    const {
      contactNumber,
      countryCode,
      otp,
      purpose,
      deviceId,
      deviceType,
      deviceToken,
      name,
    } = data;

    const otpRecord = await Otp.findOne({
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

    const driver = await Driver.create({
      contactNumber,
      countryCode,
      name: name,
      deviceId: deviceId,
      deviceType: deviceType,
      deviceToken: deviceToken,
    });

    const accessToken = generateAccessToken({
      userId: driver._id.toString(),
      role: "DRIVER",
      deviceId: "some-device-id",
    });

    const refreshToken = generateRefreshToken({
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

  public async login(data: ISignupLogin): Promise<IServiceResponse> {
    debugger;
    const { contactNumber, countryCode, otp, purpose, deviceId, deviceType, deviceToken } = data;

    const otpRecord = await Otp.findOne({
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

    const driver = await Driver.findOne({
      contactNumber,
      countryCode,
    });

    console.log(driver)

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

    const accessToken = generateAccessToken({
      userId: driver._id.toString(),
      role: "DRIVER",
      deviceId: "some-device-id",
    });

    const refreshToken = generateRefreshToken({
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

export default new AuthService();
