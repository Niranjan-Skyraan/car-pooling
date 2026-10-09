"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_js_1 = __importDefault(require("../../controllers/rider/auth.controller.js"));
const validate_middleware_js_1 = require("../../middlewares/validate.middleware.js");
const auth_validators_js_1 = require("../../validators/common/auth.validators.js");
const authRouter = (0, express_1.Router)();
/**
 * @swagger
 * /api/rider/auth/send-otp:
 *   post:
 *     summary: Send OTP
 *     description: Sends a 6-digit OTP to the rider's contact number for signup or login.
 *     tags:
 *       - Rider Authentication
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contactNumber
 *               - purpose
 *             properties:
 *               contactNumber:
 *                 type: string
 *                 description: Rider's contact number containing 10 to 15 digits
 *                 minLength: 10
 *                 maxLength: 15
 *                 pattern: '^\d+$'
 *                 example: "9876543210"
 *
 *               countryCode:
 *                 type: string
 *                 description: Optional country calling code
 *                 pattern: '^\+\d{1,4}$'
 *                 example: "+91"
 *
 *               purpose:
 *                 type: string
 *                 description: Purpose of the OTP request
 *                 enum:
 *                   - SIGNUP
 *                   - LOGIN
 *                 example: "SIGNUP"
 *
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "OTP sent successfully"
 *
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             examples:
 *               invalidContactNumber:
 *                 summary: Invalid contact number
 *                 value:
 *                   success: false
 *                   message: "Contact number must be at least 10 digits"
 *
 *               invalidCountryCode:
 *                 summary: Invalid country code
 *                 value:
 *                   success: false
 *                   message: "Invalid country code"
 *
 *       409:
 *         description: Phone number is already registered
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "This phone number is already registered"
 *
 *       429:
 *         description: OTP was recently requested
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Please wait before requesting another OTP"
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Something went wrong while sending OTP"
 */
authRouter.post("/send-otp", (0, validate_middleware_js_1.validate)(auth_validators_js_1.sendOtpSchema), auth_controller_js_1.default.sendOtp);
/**
 * @swagger
 * /api/rider/auth/verify-otp:
 *   post:
 *     summary: Verify rider OTP
 *     description: Verifies the OTP sent to the rider's contact number and returns access and refresh tokens.
 *     tags:
 *       - Rider Authentication
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contactNumber
 *               - otp
 *               - purpose
 *               - deviceId
 *               - deviceType
 *               - deviceToken
 *             properties:
 *               contactNumber:
 *                 type: string
 *                 description: Rider contact number used to request the OTP
 *                 example: "9876543210"
 *
 *               countryCode:
 *                 type: string
 *                 description: Country calling code
 *                 example: "+91"
 *
 *               otp:
 *                 type: string
 *                 description: Six-digit OTP received by the rider
 *                 example: "123456"
 *
 *               name:
 *                 type: string
 *                 description: Rider's full name
 *                 example: "John Doe"
 *
 *               purpose:
 *                 type: string
 *                 description: Purpose for which the OTP was generated
 *                 example: "SIGNUP"
 *
 *               deviceId:
 *                 type: string
 *                 description: Unique identifier of the rider's device
 *                 example: "device-abc-123"
 *
 *               deviceType:
 *                 type: string
 *                 description: Rider's mobile device platform
 *                 enum:
 *                   - ANDROID
 *                   - IOS
 *                 example: "ANDROID"
 *
 *               deviceToken:
 *                 type: string
 *                 description: Firebase Cloud Messaging device token used for push notifications
 *                 example: "fcm-device-token-example"
 *
 *     responses:
 *       200:
 *         description: OTP verified successfully and authentication tokens generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "OTP verified successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       description: Short-lived JWT access token
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     refreshToken:
 *                       type: string
 *                       description: Long-lived JWT refresh token
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *       400:
 *         description: Invalid, expired, or already used OTP
 *         content:
 *           application/json:
 *             examples:
 *               otpNotFound:
 *                 summary: OTP not found or already used
 *                 value:
 *                   success: false
 *                   statusCode: 400
 *                   data: {}
 *                   message: "OTP not found or already used"
 *
 *               otpExpired:
 *                 summary: OTP expired
 *                 value:
 *                   success: false
 *                   statusCode: 400
 *                   data: {}
 *                   message: "OTP has expired"
 *
 *               invalidOtp:
 *                 summary: Invalid OTP
 *                 value:
 *                   success: false
 *                   statusCode: 400
 *                   data: {}
 *                   message: "Invalid OTP"
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               statusCode: 500
 *               data: {}
 *               message: "Something went wrong while verifying OTP"
 */
authRouter.post("/verify-otp", (0, validate_middleware_js_1.validate)(auth_validators_js_1.verifyOtpSchema), auth_controller_js_1.default.verifyOtp);
/**
 * @swagger
 * /api/rider/auth/login:
 *   post:
 *     summary: Rider login using OTP
 *     description: |
 *       Verifies the rider's OTP and returns access and refresh tokens
 *       if the OTP is valid and the rider account exists.
 *     tags:
 *       - Rider Authentication
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contactNumber
 *               - otp
 *               - purpose
 *               - deviceId
 *               - deviceType
 *               - deviceToken
 *             properties:
 *               contactNumber:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 15
 *                 pattern: '^\d+$'
 *                 example: "9876543210"
 *                 description: Rider's registered contact number.
 *
 *               countryCode:
 *                 type: string
 *                 pattern: '^\+\d{1,4}$'
 *                 example: "+91"
 *                 description: Optional country calling code.
 *
 *               otp:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *                 pattern: '^\d{6}$'
 *                 example: "123456"
 *                 description: Six-digit OTP received by the rider.
 *
 *               purpose:
 *                 type: string
 *                 enum:
 *                   - LOGIN
 *                 example: "LOGIN"
 *                 description: Purpose of OTP verification for this endpoint.
 *
 *               deviceId:
 *                 type: string
 *                 example: "device-abc-123"
 *                 description: Unique identifier of the rider's device.
 *
 *               deviceType:
 *                 type: string
 *                 enum:
 *                   - ANDROID
 *                   - IOS
 *                 example: "ANDROID"
 *                 description: Rider's device platform.
 *
 *               deviceToken:
 *                 type: string
 *                 example: "fcm-device-token-example"
 *                 description: Firebase Cloud Messaging token for push notifications.
 *
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       description: Short-lived JWT used to access protected APIs.
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     refreshToken:
 *                       type: string
 *                       description: Long-lived JWT used to obtain a new access token.
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *
 *       400:
 *         description: Invalid, expired, or already-used OTP, or request validation failed.
 *         content:
 *           application/json:
 *             examples:
 *               otpNotFound:
 *                 summary: OTP not found or already used
 *                 value:
 *                   success: false
 *                   statusCode: 400
 *                   data: {}
 *                   message: "OTP not found or already used"
 *               otpExpired:
 *                 summary: OTP expired
 *                 value:
 *                   success: false
 *                   statusCode: 400
 *                   data: {}
 *                   message: "OTP has expired"
 *               invalidOtp:
 *                 summary: Invalid OTP
 *                 value:
 *                   success: false
 *                   statusCode: 400
 *                   data: {}
 *                   message: "Invalid OTP"
 *               validationError:
 *                 summary: Request validation failed
 *                 value:
 *                   success: false
 *                   message: "Validation error"
 *
 *       404:
 *         description: Rider account not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               statusCode: 404
 *               data: {}
 *               message: "Rider account not found"
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               statusCode: 500
 *               message: "Something went wrong while verifying OTP"
 */
authRouter.post("/login", (0, validate_middleware_js_1.validate)(auth_validators_js_1.verifyOtpSchema), auth_controller_js_1.default.login);
exports.default = authRouter;
