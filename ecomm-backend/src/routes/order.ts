import express from "express";
import {
  allOrders,
  deleteOrder,
  getSingleOrder,
  myOrders,
  newOrder,
  processOrder,
} from "../controllers/order.js";
import { adminOnly } from "../middleware/auth.js";

const app = express.Router();

// route - /api/v1/order/new
app.post("/new", newOrder as any);

// route - /api/v1/order/my
app.get("/my", myOrders as any);

// route - /api/v1/order/my
app.get("/all", adminOnly as any, allOrders as any);

app
  .route("/:id")
  .get(getSingleOrder as any)
  .put(adminOnly as any, processOrder as any)
  .delete(adminOnly as any, deleteOrder as any);

export default app;
