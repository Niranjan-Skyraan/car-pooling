import { Response } from "express";

export const sendSuccessResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: unknown
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    ...(data !== undefined && { data }),
  });
};

export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: unknown
): void => {

  console.log("Error Response: ", { statusCode, message, data });
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(data !== undefined && { data }),
  });
};