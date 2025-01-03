import mongoose from "mongoose";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};
export default connectDB;
export const invalidateCache = ({ product, order, admin, userId, orderId, productId, }) => {
    if (product) {
        const productKey = [
            "latest-products",
            "categories",
            "all-products",
        ];
        if (typeof productId === "string")
            productKey.push(`product-${productId}`);
        if (typeof productId === "object")
            productId.forEach((i) => productKey.push(`product-${i}`));
        myCache.del(productKey);
    }
    if (order) {
        const ordersKey = [
            "all-orders",
            `my-orders-${userId}`,
            `order-${orderId}`,
        ];
        myCache.del(ordersKey);
    }
    if (admin) {
        myCache.del([
            "admin-stats",
            "admin-pie-charts",
            "admin-bar-charts",
            "admin-line-charts",
        ]);
    }
};
export const reduceStock = async (orderItems) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if (!product)
            throw new Error("Product Not Found");
        product.stock -= order.quantity;
        await product.save();
    }
};
export const calculatePercentage = (thisMonth, lastMonth) => {
    if (lastMonth === 0)
        return thisMonth * 100;
    const percentage = (lastMonth / lastMonth) * 100;
    return Number(percentage.toFixed(0));
};
export const getInventory = async ({ categories, productsCount, }) => {
    const categoriesCountPromise = categories.map((category) => Product.countDocuments({ category }));
    const categoriesCount = await Promise.all(categoriesCountPromise);
    const categoryCount = [];
    categories.forEach((category, i) => {
        categoryCount.push({
            [category]: Math.round((categoriesCount[i] / productsCount) * 100),
        });
    });
    return categoryCount;
};
export const getChartData = ({ length, docArr, today, property, }) => {
    const data = new Array(length).fill(0);
    docArr.forEach((i) => {
        const creationDate = i.createdAt;
        const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
        if (monthDiff < length) {
            if (property) {
                data[length - monthDiff - 1] += i[property];
            }
            else {
                data[length - monthDiff - 1] += 1;
            }
        }
    });
    return data;
};
