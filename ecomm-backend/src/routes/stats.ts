import express from "express";

import { adminOnly } from "../middleware/auth.js";
import {
  getBarCharts,
  getDashboardStats,
  getLineCharts,
  getPieCharts,
} from "../controllers/stats.js";

const app = express.Router();

// route - /api/v1/dashboard/stats
app.get("/stats", adminOnly as any, getDashboardStats as any);

// route - /api/v1/dashboard/pie
app.get("/pie", adminOnly as any, getPieCharts as any);

// route - /api/v1/dashboard/bar
app.get("/bar", adminOnly as any, getBarCharts as any);

// route - /api/v1/dashboard/line
app.get("/line", adminOnly as any, getLineCharts as any);

export default app;
