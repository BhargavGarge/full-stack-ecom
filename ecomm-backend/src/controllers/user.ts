import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";
import { TryCatch } from "../middleware/error.js";
import { ErrorHandler } from "../utils/utility-class.js";

export const newUser = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, email, photo, gender, _id, dob } = req.body;
    let user = await User.findById(_id);
    if (user) {
      return res.status(200).json({
        success: true,
        message: `Welcome , ${user.name}`,
      });
    }
    if (!_id || !name || !email || !photo || !gender || !dob)
      return next(new ErrorHandler("Please fill all fields", 400));
    user = await User.create({
      name,
      email,
      photo,
      gender,
      _id,
      dob: new Date(dob),
    });

    res.status(201).json({
      success: true,
      message: `Welcome , ${user.name}`,
    });
  }
);
export const getAllUsers = TryCatch(async (req, res, next) => {
  const users = await User.find();
  return res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

//getUser
export const getUser = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("User not found", 404));
  return res.status(200).json({
    success: true,
    data: user,
  });
});
