import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admins, validateAdmin } from "../models/adminSchema.js";
import dotenv from "dotenv";

dotenv.config();

class AdminController {
  async getProfile(req, res) {
    try {
      const admin = await Admins.findById(req.admin.id);
      res.status(200).json({
        variant: "success",
        msg: "Profile successfully fetched",
        payload: admin,
      });
    } catch {
      res.status(500).json({
        variant: "error",
        msg: "Server error",
        payload: null,
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const { error } = validateAdmin(req.body);
      if (error) {
        return res.status(400).json({
          variant: "error",
          msg: error.details[0].message,
          payload: null,
        });
      }

      const existAdmin = await Admins.findOne({ username: req.body.username });
      if (existAdmin && req.admin.id !== existAdmin._id.toString()) {
        return res.status(400).json({
          variant: "error",
          msg: "User already exists.",
          payload: null,
        });
      }

      req.body.password = existAdmin?.password;

      const admin = await Admins.findByIdAndUpdate(
        req.admin.id,
        {
          ...req.body,
        },
        { new: true }
      );
      res.status(200).json({
        variant: "success",
        msg: "Profile successfully updated",
        payload: admin,
      });
    } catch {
      res.status(500).json({
        variant: "error",
        msg: "Server error",
        payload: null,
      });
    }
  }

  async get(req, res) {
    try {
      const admin = await Admins.find().sort({ createdAt: -1 });

      if (!admin.length) {
        res.status(400).json({
          variant: "error",
          msg: "Admin not found",
          payload: [],
        });
      }

      const total = await Admins.countDocuments();

      res.status(200).json({
        variant: "success",
        msg: "Admins successfully fetched",
        payload: admin,
        total,
      });
    } catch {
      res.status(500).json({
        variant: "error",
        msg: "Server error",
        payload: null,
      });
    }
  }

  async getAdmin(req, res) {
    try {
      const admin = await Admins.findById(req.params.id);

      res.status(200).json({
        variant: "success",
        msg: "Admin successfully fetched",
        payload: admin,
      });
    } catch {
      res.status(500).json({
        variant: "error",
        msg: "Server error",
        payload: null,
      });
    }
  }

  async signUp(req, res) {
    try {
      const { error } = validateAdmin(req.body);
      if (error) {
        return res.status(400).json({
          variant: "error",
          msg: error.details[0].message,
          payload: null,
        });
      }

      const { username, password } = req.body;

      const existAdmin = await Admins.findOne({ username });
      if (existAdmin) {
        return res.status(400).json({
          variant: "error",
          msg: "Admin already exist",
          payload: null,
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const admin = await Admins.create({
        ...req.body,
        password: hashedPassword,
      });

      res.status(201).json({
        variant: "success",
        msg: "Admin successfully created",
        payload: admin,
      });
    } catch {
      res.status(500).json({
        variant: "error",
        msg: "Server error",
        payload: null,
      });
    }
  }

  async signIn(req, res) {
    try {
      const { username, password } = req.body;

      const existAdmin = await Admins.findOne({ username });
      if (!existAdmin) {
        return res.status(400).json({
          variant: "error",
          msg: "Username or password is incorrect",
          payload: null,
        });
      }

      const validPassword = await bcrypt.compare(password, existAdmin.password);
      if (!validPassword) {
        return res.status(400).json({
          variant: "error",
          msg: "Username or password is incorrect",
          payload: null,
        });
      }

      const token = jwt.sign(
        { id: existAdmin._id, role: existAdmin.role },
        process.env.SECRET_KEY,
        {
          expiresIn: "1d",
        }
      );

      res.status(200).json({
        variant: "success",
        msg: "Admin successfully sign in",
        payload: {
          admin: existAdmin,
          token,
        },
      });
    } catch {
      res.status(500).json({
        variant: "error",
        msg: "Server error",
        payload: null,
      });
    }
  }

  async updateAdmin(req, res) {
    try {
      const { id } = req.params;

      const { error } = validateAdmin(req.body);
      if (error) {
        return res.status(400).json({
          msg: error.details[0].message,
          variant: "error",
          payload: null,
        });
      }

      const existAdmin = await Admins.findOne({ username: req.body.username });
      if (existAdmin && id !== existAdmin._id?.toString())
        return res.status(400).json({
          msg: "User already exists.",
          variant: "error",
          payload: null,
        });

      req.body.password = existAdmin?.password; //

      const admin = await Admins.findByIdAndUpdate(id, req.body, { new: true });

      console.log(admin);

      res.status(200).json({
        variant: "success",
        msg: "Admin successfully updated",
        payload: admin,
      });
    } catch {
      res.status(500).json({
        variant: "error",
        msg: "Server error",
        payload: null,
      });
    }
  }
}

export default new AdminController();
