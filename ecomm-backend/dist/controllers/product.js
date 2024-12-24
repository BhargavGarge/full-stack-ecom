import { TryCatch } from "../middleware/error.js";
import { Product } from "../models/product.js";
import { ErrorHandler } from "../utils/utility-class.js";
import { rm } from "fs";
export const newProduct = TryCatch(async (req, res, next) => {
    const { name, category, price, stock } = req.body;
    const photo = req.file;
    if (!photo)
        return next(new ErrorHandler("Photo is required", 400));
    if (!name || !category || !price || !stock) {
        rm(photo.path, () => {
            console.log("Photo deleted");
        });
        return next(new ErrorHandler("All fields are required", 400));
    }
    await Product.create({
        name,
        category: category.toLowerCase(),
        price,
        stock,
        photo: photo?.path,
    });
    return res.status(201).json({ message: "Product created successfully" });
});
export const getlatestProducts = TryCatch(async (req, res, next) => {
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    return res.status(200).json({ products });
});
export const getAllCategories = TryCatch(async (req, res, next) => {
    const categories = await Product.distinct("category");
    return res.status(200).json({ categories });
});
export const getAdminProducts = TryCatch(async (req, res, next) => {
    const products = await Product.find({});
    return res.status(200).json({ products });
});
export const getSingleProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product)
        return next(new ErrorHandler("Product not found", 404));
    return res.status(200).json({ product });
});
export const updateProduct = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { name, category, price, stock } = req.body;
    const photo = req.file;
    const product = await Product.findById(id);
    if (!product)
        return next(new ErrorHandler("Product not found", 404));
    if (photo) {
        rm(product.photo, () => {
            console.log(" Old Photo deleted");
        });
        product.photo = photo.path;
    }
    if (name)
        product.name = name;
    if (category)
        product.category = category.toLowerCase();
    if (price)
        product.price = price;
    if (stock)
        product.stock = stock;
    await product.save();
    return res.status(201).json({ message: "Product Updated successfully" });
});
export const getDeleteProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product)
        return next(new ErrorHandler("Product not found", 404));
    rm(product.photo, () => {
        console.log("Photo deleted");
    });
    await Product.deleteOne();
    return res.status(200).json({
        message: "Product deleted successfully",
    });
});
//get all product
export const getProducts = TryCatch(async (req, res, next) => {
    const { search, category, price, sort } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCTS_LIMIT) || 8;
    const skip = (page - 1) * limit;
    // category,
    const baseQuery = {};
    if (search)
        baseQuery.name = {
            $regex: search,
            $options: "i",
        };
    if (price)
        baseQuery.price = {
            $lte: Number(price),
        };
    if (category)
        baseQuery.category = category;
    const productsPromise = Product.find(baseQuery)
        .sort(sort && { price: sort === "asc" ? 1 : -1 })
        .limit(limit)
        .skip(skip);
    const [productsFetched, filterOnlyProduct] = await Promise.all([
        productsPromise,
        Product.find(baseQuery),
    ]);
    const totalPage = Math.ceil(filterOnlyProduct.length / limit);
    return res.status(200).json({ productsFetched, totalPage });
});
