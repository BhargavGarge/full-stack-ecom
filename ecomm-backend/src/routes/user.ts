import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  newUser,
} from "../controllers/user.js";
import { adminOnly } from "../middleware/auth.js";

const app = express.Router();

// route - /api/v1/user/new
app.post("/new", newUser as any);

// Route - /api/v1/user/all
app.get("/all", adminOnly as any, getAllUsers as any);

// Route - /api/v1/user/dynamicID
app
  .route("/:id")
  .get(getUser as any)
  .delete(adminOnly as any, deleteUser as any);

export default app;
