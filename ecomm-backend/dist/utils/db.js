import mongoose from "mongoose";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";
const mongoURI = "mongodb+srv://bhargaavvv:1234@cluster0.ixk63.mongodb.net/Ecomm?retryWrites=true&w=majority&appName=Cluster0";
const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {});
        console.log("MongoDB connected successfully");
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};
export default connectDB;
export const invalidateCache = async ({ product, order, admin, }) => {
    if (product) {
        const productKey = [
            "latest-products",
            "categories",
            "all-products",
        ];
        const products = await Product.find({}).select("_id");
        products.forEach((i) => {
            const id = i._id;
        });
        myCache.del(productKey);
    }
};
