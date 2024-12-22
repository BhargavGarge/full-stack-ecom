import { User } from "../models/user.js";
import { ErrorHandler } from "../utils/utility-class.js";
import { TryCatch } from "./error.js";

//middleware to make sure only admin allowed
export const adminOnly = TryCatch(async (req, res, next) => {
  const { id } = req.query;
  if (!id) return next(new ErrorHandler("Please login first", 401));
  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("User not found", 404));
  if (user.role !== "admin")
    return next(new ErrorHandler("Access denied", 403));

  next();
});
