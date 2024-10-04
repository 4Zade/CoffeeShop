import { Request, Response } from "express";
import Product, { ProductInterface } from "../models/productModel";
import { generateProductId } from "../utils/idgen";

const productControllers = {
  createProduct: async (req: Request, res: Response) => {
    const { name, description, price, image }: ProductInterface = req.body; // product json
    try {
      const id = await generateProductId();
      const newProduct = new Product({
        id,
        name,
        description,
        price,
        image,
      });

      const savedProduct = await newProduct.save();

      res.status(201).json({
        message: "Success",
        savedProduct,
      }); // SUBJECT TO CHANGE
    } catch (err: unknown) {
      res.status(500).json({ error: err });
    }
  },
  getAllProducts: async (req: Request, res: Response) => {
    try {
      const databaseRes = await Product.find({});

      res.status(201).json({
        message: "Success",
        data: databaseRes,
      });
    } catch (err: unknown) {
      res.status(500).json({ error: err });
    }
  },
  getProductById: async (req: Request, res: Response) => {
    try {
      const databaseRes = await Product.findOne({ id: req.body.id });

      res.send({
        message: "Success",
        data: databaseRes,
      }); // SUBJECT TO CHANGE
    } catch (err: unknown) {
      res.status(500).json({ error: err });
    }
  },
  patchProduct: async (req: Request, res: Response) => {
    const fieldsToUpdate = {};

    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined && req.body[key] !== null) {
        fieldsToUpdate[key] = req.body[key];
      }
    });

    try {
      const result = await Product.updateOne(
        { id: req.body.id },
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
  deleteProduct: async (req: Request, res: Response) => {
    const { id } = req.body;

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
};

export default productControllers;
