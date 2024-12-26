import express from "express";
import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js";
import NodeCache from "node-cache";
import connectDB from "./utils/db.js";
import morgan from "morgan";
import orderRoute from "./routes/order.js";
import dotenv from "dotenv";
import { errorMiddleware } from "./middleware/error.js";
import paymentRoute from "./routes/payment.js";
const app = express();
dotenv.config();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(morgan("dev"));
connectDB();
export const myCache = new NodeCache();
//using routes
app.get("/", (req, res) => {
    res.send("Welcome to E-commerce API");
});
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/uploads", express.static("uploads"));
//error handling middleware
app.use(errorMiddleware);
app.listen(port, () => {
    console.log(`Express is running on port ${port}`);
});
