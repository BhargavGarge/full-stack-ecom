import { myCache } from "../app.js";
import { TryCatch } from "../middleware/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import {
  calculatePercentage,
  getChartData,
  getInventory,
} from "../utils/db.js";

export const getDashboardStats = TryCatch(async (req, res, next) => {
  let stats = {};

  if (myCache.has("admin-stats"))
    stats = JSON.parse(myCache.get("admin-stats") as string);
  else {
    const today = new Date();
    const sixMonthAgo = new Date();
    sixMonthAgo.setMonth(sixMonthAgo.getMonth(), -6);
    const thisMonth = {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: today,
    };

    const lastMonth = {
      start: new Date(today.getFullYear(), today.getMonth() - 1),
      end: new Date(today.getFullYear(), today.getMonth(), 0),
    };

    const thisMonthProductsPromise = Product.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthProductsPromise = Product.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const thisMonthUserPromise = User.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthUserPromise = User.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const thisMonthOrderPromise = Order.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthOrderPromise = Order.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });
    const lastSixMonthPromise = Order.find({
      createdAt: {
        $gte: sixMonthAgo,
        $lte: today,
      },
    });
    const latestTransctionsPromise = Order.find({})
      .select(["orderItems", "discount", "total"])
      .limit(4);
    //promise it
    const [
      thisMonthProducts,
      thisMonthOrder,
      thisMonthUser,
      lastMonthProducts,
      lastMonthOrder,
      lastMonthUser,
      productsCount,
      usersCount,
      allOrders,
      lastSixMonthOrders,
      categories,
      femaleUsersCount,
      latestTransaction,
    ] = await Promise.all([
      thisMonthProductsPromise,
      thisMonthOrderPromise,
      thisMonthUserPromise,
      lastMonthProductsPromise,
      lastMonthOrderPromise,
      lastMonthUserPromise,
      Product.countDocuments(),
      User.countDocuments(),
      Order.find({}).select("total"),
      lastSixMonthPromise,
      Product.distinct("category"),
      User.countDocuments({ gender: "female" }),
      latestTransctionsPromise,
    ]);

    //revenue
    const thisMonthRevenue = thisMonthOrder.reduce(
      (total, order: { total: number }) => total + (order.total || 0),
      0
    );
    const lastMonthRevenue = lastMonthOrder.reduce(
      (total, order: { total: number }) => total + (order.total || 0),
      0
    );

    const changePercent = {
      revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
      product: calculatePercentage(
        thisMonthProducts.length,
        lastMonthProducts.length
      ),
      user: calculatePercentage(thisMonthUser.length, lastMonthUser.length),
      order: calculatePercentage(thisMonthOrder.length, lastMonthOrder.length),
    };
    const Revenue = allOrders.reduce(
      (total, order: { total: number }) => total + (order.total || 0),
      0
    );
    const count = {
      Revenue,
      user: usersCount,
      product: productsCount,
      order: allOrders.length,
    };

    const orderMonthCounts = new Array(6).fill(0);
    const orderMonthyRevenue = new Array(6).fill(0);

    lastSixMonthOrders.forEach((order) => {
      const creationDate = order.createdAt;
      const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
      if (monthDiff < 6) {
        orderMonthCounts[6 - monthDiff - 1] += 1;
        orderMonthyRevenue[6 - monthDiff - 1] += order.total;
      }
    });

    const categoryCount = await getInventory({
      categories,
      productsCount,
    });

    const userRatio = {
      male: usersCount - femaleUsersCount,
      female: femaleUsersCount,
    };
    const modifyTransaction = latestTransaction.map((i) => ({
      _id: i._id,
      amount: i.total,
      discount: i.discount,
      quantity: i.orderItems.length,
      status: i.status,
    }));
    stats = {
      userRatio,
      categoryCount,
      changePercent,
      count,
      chart: {
        order: orderMonthCounts,
        revenue: orderMonthyRevenue,
      },
      latestTransaction: modifyTransaction,
    };
    myCache.set("admin-stats", JSON.stringify(stats));
  }
  return res.status(200).json({
    message: "Dashboard stats retrieved successfully",
    data: stats,
  });
});

export const getPieCharts = TryCatch(async (req, res, next) => {
  let charts;
  if (myCache.has("admin-pie-chats"))
    charts = JSON.parse(myCache.get("admin-pie-chats") as string);
  else {
    const allOrderPromise = Order.find({}).select([
      "total",
      "disocunt",
      "subtotal",
      "tax",
      "shippingCharges",
    ]);
    const [
      processingOrder,
      ShippedOrder,
      deliverdOrder,
      categories,
      productsCount,
      productsOutOfStock,
      allOrders,
      AllUsers,
      AdminUsers,
      customerUsers,
    ] = await Promise.all([
      Order.countDocuments({ status: "Processing" }),
      Order.countDocuments({ status: "Shipped" }),
      Order.countDocuments({ status: "Delivered" }),
      Product.distinct("category"),
      Product.countDocuments({ stock: 0 }),
      Product.countDocuments(),
      allOrderPromise,
      User.find({}).select(["role", "dob"]),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "user" }),
    ]);

    const OrderFullFill = {
      Processing: processingOrder,
      Shipped: ShippedOrder,
      Delivered: deliverdOrder,
    };
    const ProductCategories = await getInventory({
      categories,
      productsCount,
    });

    const stockAvailable = {
      inStock: productsCount - productsOutOfStock,
      productsOutOfStock,
    };

    const totalGrossIncome = allOrders.reduce(
      (prev, order) => prev + ((order as any).total || 0),
      0
    );
    const discount = allOrders.reduce(
      (prev, order) => prev + ((order as any).discount || 0),
      0
    );
    const productionCost = allOrders.reduce(
      (prev, order) => prev + ((order as any).shippingCharges || 0),
      0
    );
    const burnt = allOrders.reduce(
      (prev, order) => prev + ((order as any).tax || 0),
      0
    );
    const MarketingCost = Math.round((totalGrossIncome as number) * (30 / 100));

    const netMargin =
      totalGrossIncome - discount - productionCost - burnt - MarketingCost;

    const revenueDistribution = {
      totalGrossIncome,
      discount,
      productionCost,
      burnt,
      MarketingCost,
      netMargin,
    };

    const userAgeGroup = {
      teen: AllUsers.filter((i) => i.age < 20).length,
      adult: AllUsers.filter((i) => i.age >= 20 && i.age < 40).length,
      old: AllUsers.filter((i) => i.age >= 40).length,
    };
    const adminCustomer = {
      admin: AdminUsers,
      customer: customerUsers,
    };
    charts = {
      OrderFullFill,
      ProductCategories,
      stockAvailable,
      revenueDistribution,
      userAgeGroup,
      adminCustomer,
    };
    myCache.set("admin-pie-chats", JSON.stringify(charts));
  }
  return res.status(200).json({
    message: "Dashboard stats retrieved successfully",
    data: charts,
  });
});

export const getBarCharts = TryCatch(async (req, res, next) => {
  let charts;
  const key = "admin-bar-charts";

  charts = await myCache.get(key);

  if (charts) charts = JSON.parse(charts);
  else {
    const today = new Date();

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const sixMonthProductPromise = Product.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const sixMonthUsersPromise = User.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const twelveMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: twelveMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const [products, users, orders] = await Promise.all([
      sixMonthProductPromise,
      sixMonthUsersPromise,
      twelveMonthOrdersPromise,
    ]);

    const productCounts = getChartData({ length: 6, today, docArr: products });
    const usersCounts = getChartData({ length: 6, today, docArr: users });
    const ordersCounts = getChartData({ length: 12, today, docArr: orders });

    charts = {
      users: usersCounts,
      products: productCounts,
      orders: ordersCounts,
    };

    await myCache.set(key, JSON.stringify(charts));
  }

  return res.status(200).json({
    success: true,
    charts,
  });
});

export const getLineCharts = TryCatch(async (req, res, next) => {
  let charts;
  const key = "admin-line-charts";

  charts = await myCache.get(key);

  if (charts) charts = JSON.parse(charts);
  else {
    const today = new Date();

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const baseQuery = {
      createdAt: {
        $gte: twelveMonthsAgo,
        $lte: today,
      },
    };

    const [products, users, orders] = await Promise.all([
      Product.find(baseQuery).select("createdAt"),
      User.find(baseQuery).select("createdAt"),
      Order.find(baseQuery).select(["createdAt", "discount", "total"]),
    ]);

    const productCounts = getChartData({ length: 12, today, docArr: products });
    const usersCounts = getChartData({ length: 12, today, docArr: users });
    const discount = getChartData({
      length: 12,
      today,
      docArr: orders,
      property: "discount",
    });
    const revenue = getChartData({
      length: 12,
      today,
      docArr: orders,
      property: "total",
    });

    charts = {
      users: usersCounts,
      products: productCounts,
      discount,
      revenue,
    };

    await myCache.set(key, JSON.stringify(charts));
  }

  return res.status(200).json({
    success: true,
    charts,
  });
});
