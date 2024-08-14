import express from "express";
import AdminController from "../controller/admin.js";
import CategoryController from "../controller/category.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();
// profile
router.get("/get/profile", [auth], AdminController.getProfile);
router.patch("/update/profile", [auth], AdminController.updateProfile);

// admin
router.get("/get/admins", [auth], AdminController.get);
router.get("/get/admins/:id", AdminController.getAdmin);
router.post("/sign-up", AdminController.signUp);
router.post("/sign-in", AdminController.signIn);
router.patch("/update/admins/:id", AdminController.updateAdmin);

// category
router.get("/get/categories", CategoryController.get);
router.post("/create/categories", [auth], CategoryController.create);
router.patch("/update/categories/:id", CategoryController.update);
router.delete("/delete/categories/:id", CategoryController.delete);

export default router;
