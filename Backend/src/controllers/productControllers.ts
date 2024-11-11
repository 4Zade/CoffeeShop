import { Request, Response, NextFunction } from "express";
import Product, { ProductInterface } from "../models/productModel";
import User, { UserInterface } from "../models/userModel";
import { generateProductId } from "../utils/idgen";
import { verifyToken, TokenInterface } from "../utils/token";
const Decimal128 = require('mongodb').Decimal128;

const productControllers = {
  // ^ POST /api/v1/products - Create product (creates product)
  createProduct: async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, price, image, category, size }: ProductInterface = req.body;
    try {
      console.log(name, description, price, image, category, size);

      const id: number = await generateProductId();
      const newProduct: ProductInterface = new Product({
        id,
        name,
        description,
        price,
        image,
        category,
        size,
      });

      const savedProduct: ProductInterface = await newProduct.save();

      res.status(201).json({
        message: "Success",
        savedProduct,
      });
    } catch (err: unknown) {
      next(err);
    }
  },
  // ^ GET /api/v1/products - Get all products (gets all products)
  getAllProducts: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      let data: ProductInterface[] = await Product.find({});
      Object.keys(data).forEach((key) => {
       data[key].price = data[key].price.toString()
      })
      
      res.status(200).json({
        message: "Success",
        data,
      });
    } catch (err: unknown) {
      next(err);
    }
  },
  // ^ GET /api/v1/products/:category/:id - Get product by id (gets product by id)
  getProduct: async (req: Request, res: Response, next: NextFunction) => {
    const id: number = parseInt(req.params.id);
    const category: string = req.params.category;

    try {
      const categoryString = category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

      const data: ProductInterface = await Product.findOne({ id, category: categoryString });

      res.status(201).json({
        message: "Success",
        data,
      });
    } catch (err: unknown) {
      next(err);
    }
  },
  // ^ GET /api/v1/products/:category - Get products by id and category (gets product by id and category)
  getProductByCategory: async (req: Request, res: Response, next: NextFunction) => {
    const category: string = req.params.category;

    try {
      const categoryString = category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

      const data: ProductInterface[] = await Product.find({ category: categoryString });

      res.status(201).json({
        message: "Success",
        data,
      });
    } catch (err: unknown) {
      next(err);
    }
  },
  // ^ PATCH /api/v1/products - Update product by id (updates product by id)
  patchProduct: async (req: Request, res: Response, next: NextFunction) => {
    const id: number = parseInt(req.params.id);
    const fieldsToUpdate: object = {};

    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined && req.body[key] !== null) {
        fieldsToUpdate[key] = req.body[key];
      }
    });

    try {
      const result = await Product.updateOne(
        { id },
        { $set: fieldsToUpdate },
      );

      res.status(201).json({
        message: "Success",
        result,
      });
    } catch (err: unknown) {
      res.status(500).json({ error: err });
    }
  },
  // ^ DELETE /api/v1/products - Delete product by id (deletes product by id)
  deleteProduct: async (req: Request, res: Response, next: NextFunction) => {
    const id: number = parseInt(req.params.id);

    try {
      const deletedProduct = await Product.findOneAndDelete({ id });

      res.status(201).json({
        message: "Success",
        deletedProduct,
      });
    } catch (err: unknown) {
      res.status(500).json({ error: err });
    }
  },

  review: async (req: Request, res: Response, next: NextFunction) => {
    const token: string = req.cookies.jwt;
    const { productId }: { productId: number } = req.body;

    try {
      const decoded: TokenInterface = verifyToken(token);
      const user: UserInterface = await User.findOne({ id: decoded.id });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const product: ProductInterface = await Product.findOne({
        id: productId,
      });
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      if (user.favorite.includes(productId)) {
        user.favorite = user.favorite.filter((id) => id !== productId);
        product.liked--;

        await user.save();
        await product.save();

        return res.status(200).json({
          favorited: false,
          message: "Product unfavorited.",
          favoriteStatus: false
        });
      }

      user.favorite.push(productId);
      product.liked++;

      await user.save();
      await product.save();

      res.status(200).json({
        favorited: true,
        message: "Product favorited.",
        favoriteStatus: true
      });
    } catch (err: unknown) {
      next(err);
    }
  },
};

export default productControllers;
