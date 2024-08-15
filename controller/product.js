import { Products, validateProduct } from "../models/productSchema.js";
import dotenv from "dotenv";

dotenv.config();

class ProductController {
  async get(req, res) {
    try {
      const { limit = 10, skip = 1 } = req.params;

      const products = await Products.find()
        .populate([
          { path: "adminId", select: ["fname", "username"] },
          { path: "categoryId", select: ["title"] },
        ])
        .limit(limit)
        .skip((skip - 1) * limit)
        .sort({ createdAt: -1 });

      if (!products.length) {
        return res.status(400).json({
          variant: "error",
          msg: "Products not found",
          innerData: [],
        });
      }

      const total = await Products.countDocuments();

      res.status(200).json({
        variant: "success",
        msg: "Products successfully fetched",
        innerData: products,
        totalCount: total,
      });
    } catch {
      res.status(500).json({
        variant: "error",
        msg: "Server error",
        innerData: null,
      });
    }
  }
  async getCategoryFilter(req, res) {
    try {
      const { limit = 10, count = 1, categoryId } = req.params;

      const products = await Products.find({ categoryId })
        .populate([
          { path: "adminId", select: ["fname", "username"] },
          { path: "categoryId", select: ["title"] },
        ])
        .limit(limit)
        .skip((count - 1) * limit)
        .sort({ createdAt: -1 });

      if (!products.length) {
        return res.status(400).json({
          variant: "error",
          msg: "Products not found",
          innerData: [],
        });
      }

      const total = await Products.countDocuments();

      res.status(200).json({
        variant: "success",
        msg: "Products successfully fetched",
        innerData: products,
        totalCount: total,
      });
    } catch {
      res.status(500).json({
        variant: "error",
        msg: "Server error",
        innerData: null,
      });
    }
  }

  async create(req, res) {
    try {
      const urls = req.files.map(
        (i) => `${req.protocol}://${req.get("host")}/images/${i.filename}`
      );

      const newProduct = {
        ...req.body,
        urls,
        adminId: req.admin.id,
      };

      const { error } = validateProduct(newProduct);

      if (error) {
        return res.status(400).json({
          variant: "error",
          msg: error.details[0].message,
          innerData: null,
        });
      }

      const product = await Products.create({
        ...newProduct,
        info: JSON.parse(req.body.info),
      });

      res.status(201).json({
        variant: "success",
        msg: "Product successfully created",
        innerData: product,
      });
    } catch {
      res.status(500).json({
        variant: "error",
        msg: "Server error",
        innerData: null,
      });
    }
  }
}

export default new ProductController();
