import express from "express";
import userRoute from "./routes/user.js";
import { errorMidleware } from "./middleware/error.js";
import connectDB from "./utils/db.js";
import morgan from "morgan";
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
connectDB();
app.use(morgan("dev"));
//using routes
app.get("/", (req, res) => {
    res.send("Welcome to E-commerce API");
});
app.use("/api/v1/user", userRoute);
//error handling middleware
app.use(errorMidleware);
app.listen(port, () => {
    console.log(`Express is running on port ${port}`);
});
