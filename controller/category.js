import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Categories, validateCategory } from "../models/categorySchema.js";
import dotenv from "dotenv";

dotenv.config();

class CategoryController {
  async get(req, res) {
    try {
      const category = await Categories.find()
        .populate([{ path: "adminId", select: ["fname", "username"] }])
        .sort({ createdAt: -1 });

      if (!category.length) {
        res.status(400).json({
          variant: "error",
          msg: "Category not found",
          innerData: [],
        });
      }

      const total = await Categories.countDocuments();

      res.status(200).json({
        variant: "success",
        msg: "Categories successfully fetched",
        innerData: category,
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
      const { error } = validateCategory(req.body);
      if (error) {
        return res.status(400).json({
          variant: "error",
          msg: error.details[0].message,
          innerData: null,
        });
      }

      const existCategory = await Categories.findOne({
        title: req.body.title,
      });

      if (existCategory) {
        return res.status(400).json({
          variant: "error",
          msg: "Category already exist",
          innerData: null,
        });
      }

      const category = await Categories.create({
        ...req.body,
        adminId: req.admin.id,
      });

      res.status(201).json({
        variant: "success",
        msg: "Category successfully created",
        innerData: category,
      });
    } catch {
      res.status(500).json({
        variant: "error",
        msg: "Server error",
        innerData: null,
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;

      const { error } = validateCategory(req.body);
      if (error) {
        return res.status(400).json({
          variant: "error",
          msg: error.details[0].message,
          innerData: null,
        });
      }

      const existCategory = await Categories.findOne({ title: req.body.title });

      if (existCategory) {
        return res.status(400).json({
          variant: "error",
          msg: "Category already exist",
          innerData: null,
        });
      }

      const category = await Categories.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      res.status(200).json({
        variant: "success",
        msg: "Category successfully updated",
        payload: category,
      });
    } catch {
      res.status(500).json({
        variant: "error",
        msg: "Server error",
        payload: null,
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const category = await Categories.findByIdAndDelete(id, { new: true });

      res.status(200).json({
        variant: "success",
        msg: "Category successfully deleted",
        innerData: category,
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

export default new CategoryController();
