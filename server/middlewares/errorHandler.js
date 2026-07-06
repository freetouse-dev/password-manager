import ApiResponse from "../shared/response.js";

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.code === "ER_DUP_ENTRY") {
    statusCode = 409;
    message = "Duplicate entry found";
  }

  if (err.code === "ER_NO_REFERENCED_ROW_2") {
    statusCode = 400;
    message = "Referenced record not found";
  }

  if (process.env.NODE_ENV === "development") {
    console.error("Error:", err);
  }

  return ApiResponse.error(res, message, statusCode);
};
