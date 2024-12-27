// getBarCharts,
// getDashboardStats,
// getLineCharts,
// getPieCharts,
import { myCache } from "../app.js";
import { TryCatch } from "../middleware/error.js";
export const getBarCharts = TryCatch(async (req, res, next) => { });
export const getLineCharts = TryCatch(async (req, res, next) => { });
export const getPieCharts = TryCatch(async (req, res, next) => { });
export const getDashboardStats = TryCatch(async (req, res, next) => {
    let stats;
    if (myCache.has("admin-stats"))
        stats = JSON.parse(myCache.get("admin-stats"));
    else {
        const today = new Date();
        const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    }
    return res.status(200).json({
        message: "Dashboard stats retrieved successfully",
        data: stats,
    });
});
