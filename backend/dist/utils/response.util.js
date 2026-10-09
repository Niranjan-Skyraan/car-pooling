"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorResponse = exports.sendSuccessResponse = void 0;
const sendSuccessResponse = (res, statusCode, message, data) => {
    res.status(statusCode).json({
        success: true,
        message,
        ...(data !== undefined && { data }),
    });
};
exports.sendSuccessResponse = sendSuccessResponse;
const sendErrorResponse = (res, statusCode, message, data) => {
    console.log("Error Response: ", { statusCode, message, data });
    res.status(statusCode).json({
        success: false,
        message,
        ...(data !== undefined && { data }),
    });
};
exports.sendErrorResponse = sendErrorResponse;
