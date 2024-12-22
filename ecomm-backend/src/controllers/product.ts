import { TryCatch } from "../middleware/error.js";
import { NewProductRequestBody } from "../types/types.js";
import { Request } from "express";
import { Product } from "../models/product.js";

export const newProduct = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const { name, category, price, stock } = req.body;
    const photo = req.file;
    await Product.create({
      name,
      category: category.toLowerCase(),
      price,
      stock,
      photo: photo?.path,
    });
    return res.status(201).json({ message: "Product created successfully" });
  }
);
