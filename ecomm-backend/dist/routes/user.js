import express from "express";
import { getAllUsers, getUser, newUser } from "../controllers/user.js";
const app = express.Router();
//route -/api/v1/user/new
app.post("/new", newUser);
//route -/api/v1/user/all
app.get("/all", getAllUsers);
//route -/api/v1/user/dynamicID
app.get("/:id", getUser);
export default app;
