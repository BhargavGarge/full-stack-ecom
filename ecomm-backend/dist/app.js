import express from "express";
import userRoute from "./routes/user.js";
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
//using routes
app.get("/", (req, res) => {
    res.send("Welcome to E-commerce API");
});
app.use("/api/v1/user", userRoute);
//error handling middleware
app.use((err, req, res, next) => {
    return res.status(err.statusCode || 400).json({
        error: err.message || "An error occurred",
        success: false,
    });
});
app.listen(port, () => {
    console.log(`Express is running on port ${port}`);
});
