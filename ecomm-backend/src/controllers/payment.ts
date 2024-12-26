// allCoupons,
// applyDiscount,
// createPaymentIntent,
// deleteCoupon,
// getCoupon,
// newCoupon,
// updateCoupon,

import { TryCatch } from "../middleware/error.js";
import { Coupon } from "../models/coupon.js";
import { ErrorHandler } from "../utils/utility-class.js";

export const allCoupons = () => {};
export const applyDiscount = () => {};
export const createPaymentIntent = () => {};
export const deleteCoupon = () => {};
export const getCoupon = () => {};
export const newCoupon = TryCatch(async (req, res, next) => {
  const { code, amount } = req.body;

  if (!code || !amount)
    return next(new ErrorHandler("Please enter both coupon and amount", 400));

  await Coupon.create({ code, amount });

  return res.status(201).json({
    success: true,
    message: `Coupon ${code} Created Successfully`,
  });
});

export const updateCoupon = () => {};
