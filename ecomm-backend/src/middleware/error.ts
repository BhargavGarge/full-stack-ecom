import { ControllerType } from "../types/types.js";
import { ErrorHandler } from "../utils/utility-class.js";
import { Request, Response, NextFunction } from "express";

// Error handling middleware with the correct signature
export const errorMiddleware = (
  err: ErrorHandler, // Custom Error type
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message ||= "Internal Server Error";
  err.statusCode ||= 500;

  if (err.name === "CastError") err.message = "Invalid ID";

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export const TryCatch =
  (func: ControllerType) =>
  (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(func(req, res, next)).catch(next);
  };
