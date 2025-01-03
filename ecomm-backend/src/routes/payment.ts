import express from "express";
adminOnly;
import {
  allCoupons,
  newCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  // createPaymentIntent,
  applyDiscount,
} from "../controllers/payment.js";
import { adminOnly } from "../middleware/auth.js";

const app = express.Router();

// route - /api/v1/payment/create
// app.post("/create", createPaymentIntent as any);

// route - /api/v1/payment/coupon/new
app.post("/discount", applyDiscount as any);

// route - /api/v1/payment/coupon/new
app.post("/coupon/new", adminOnly as any, newCoupon as any);

// route - /api/v1/payment/coupon/all
app.get("/coupon/all", adminOnly as any, allCoupons as any);

// route - /api/v1/payment/coupon/:id
app
  .route("/coupon/:id")
  .get(adminOnly as any, getCoupon as any)
  .put(adminOnly as any, updateCoupon as any)
  .delete(adminOnly as any, deleteCoupon as any);

export default app;
