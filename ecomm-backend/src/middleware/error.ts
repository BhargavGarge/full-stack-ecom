import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../utils/utility-class.js";
import { ControllerType } from "../types/types.js";

export const errorMidleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(err.statusCode || 400).json({
    error: err.message || "An error occurred",
    success: false,
  });
};

export const TryCatch = (fn: ControllerType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
