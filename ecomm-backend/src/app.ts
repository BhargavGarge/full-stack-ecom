import express, { Request, Response, NextFunction } from "express";
import userRoute from "./routes/user.js";
interface CustomError extends Error {
  statusCode?: number;
}
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

//using routes
app.get("/", (req, res) => {
  res.send("Welcome to E-commerce API");
});
app.use("/api/v1/user", userRoute);

//error handling middleware
app.use(
  (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
    res.status(err.statusCode || 400).json({
      error: err.message || "An error occurred",
      success: false,
    });
  }
);

app.listen(port, () => {
  console.log(`Express is running on port ${port}`);
});
