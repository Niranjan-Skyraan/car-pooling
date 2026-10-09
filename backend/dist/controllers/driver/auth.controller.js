"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_js_1 = __importDefault(require("../../services/driver/auth.service.js"));
const response_util_1 = require("../../utils/response.util");
class AuthController {
    sendOtp = async (req, res) => {
        try {
            const { contactNumber, countryCode, purpose } = req.body;
            const result = await auth_service_js_1.default.sendOtp({ contactNumber, countryCode, purpose });
            if (!result.success) {
                (0, response_util_1.sendErrorResponse)(res, result.statusCode, result.message, result.data);
                return;
            }
            (0, response_util_1.sendSuccessResponse)(res, result.statusCode, result.message, result.data);
        }
        catch (error) {
            console.error("Send OTP error:", error);
            (0, response_util_1.sendErrorResponse)(res, 500, "Something went wrong while sending OTP");
        }
    };
    verifyOtp = async (req, res) => {
        try {
            const { contactNumber, countryCode, otp, purpose, deviceId, deviceType, deviceToken, name } = req.body;
            const result = await auth_service_js_1.default.verifyOtp({
                contactNumber,
                countryCode,
                otp,
                purpose,
                deviceId,
                deviceType,
                deviceToken,
                name
            });
            if (!result.success) {
                console.log(result);
                (0, response_util_1.sendErrorResponse)(res, result.statusCode, result.message, result.data);
                return;
            }
            (0, response_util_1.sendSuccessResponse)(res, result.statusCode, result.message, result.data);
        }
        catch (error) {
            console.error("Verify OTP error:", error);
            (0, response_util_1.sendErrorResponse)(res, 500, "Something went wrong while verifying OTP");
        }
    };
    login = async (req, res) => {
        try {
            debugger;
            const { contactNumber, countryCode, otp, purpose, deviceId, deviceType, deviceToken } = req.body;
            const result = await auth_service_js_1.default.login({ contactNumber, countryCode, otp, purpose, deviceId, deviceType, deviceToken });
            if (!result.success) {
                (0, response_util_1.sendErrorResponse)(res, result.statusCode, result.message, result.data);
                return;
            }
            (0, response_util_1.sendSuccessResponse)(res, result.statusCode, result.message, result.data);
        }
        catch (error) {
            console.error("Login Error", error);
            (0, response_util_1.sendErrorResponse)(res, 500, "Something went wrong while logging in");
        }
    };
}
exports.default = new AuthController();
