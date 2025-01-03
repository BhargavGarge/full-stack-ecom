import express from "express";
import {
  getAdminProducts,
  getAllCategories,
  getDeleteProduct,
  getlatestProducts,
  getProducts,
  getSingleProduct,
  newProduct,
  updateProduct,
} from "../controllers/product.js";
import { singleUpload } from "../middleware/multer.js";
import { adminOnly } from "../middleware/auth.js";

const app = express.Router();

app.post("/new", adminOnly as any, singleUpload, newProduct as any);
app.get("/latest", getlatestProducts as any);
app.get("/categories", getAllCategories as any);
app.get("/admin-products", getAdminProducts as any);
app
  .route("/:id")
  .get(getSingleProduct as any)
  .put(adminOnly as any, singleUpload, updateProduct as any)
  .delete(adminOnly as any, getDeleteProduct as any);
app.get("/all", getProducts as any);

export default app;
