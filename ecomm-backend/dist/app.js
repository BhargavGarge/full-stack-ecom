import express from "express";
import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js";
import NodeCache from "node-cache";
import { errorMidleware } from "./middleware/error.js";
import connectDB from "./utils/db.js";
import morgan from "morgan";
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
connectDB();
export const myCache = new NodeCache();
app.use(morgan("dev"));
//using routes
app.get("/", (req, res) => {
    res.send("Welcome to E-commerce API");
});
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/uploads", express.static("uploads"));
//error handling middleware
app.use(errorMidleware);
app.listen(port, () => {
    console.log(`Express is running on port ${port}`);
});
