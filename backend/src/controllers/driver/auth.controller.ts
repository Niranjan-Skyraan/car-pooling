import { Request, Response } from "express";

import AuthService from "../../services/driver/auth.service.js";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/response.util";

class AuthController {

  public sendOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { contactNumber, countryCode, purpose } = req.body ;

      const result = await AuthService.sendOtp({ contactNumber, countryCode, purpose });

      if (!result.success) {
        sendErrorResponse(res, result.statusCode, result.message, result.data);
        return;
      }

      sendSuccessResponse( res, result.statusCode, result.message, result.data);
    } catch (error) {
      console.error("Send OTP error:", error);
      sendErrorResponse(res, 500, "Something went wrong while sending OTP");
    }
  };

  public verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { contactNumber, countryCode, otp, purpose, deviceId, deviceType, deviceToken, name} = req.body;

      const result = await AuthService.verifyOtp({
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
        console.log(result)
        sendErrorResponse(res, result.statusCode, result.message, result.data);
        return;
      }

      sendSuccessResponse( res, result.statusCode, result.message, result.data);
    } catch (error) {
      console.error("Verify OTP error:", error);
      sendErrorResponse(res, 500, "Something went wrong while verifying OTP");
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      debugger
      const { contactNumber, countryCode, otp, purpose, deviceId, deviceType, deviceToken } = req.body ;

      const result = await AuthService.login({ contactNumber, countryCode, otp, purpose, deviceId, deviceType, deviceToken  });

      if (!result.success) {
        sendErrorResponse(res, result.statusCode, result.message, result.data);
        return;
      }

      sendSuccessResponse( res, result.statusCode, result.message, result.data);
    } catch (error) {
      console.error("Login Error", error);
      sendErrorResponse(res, 500, "Something went wrong while logging in");
    }
  }

}

export default new AuthController();