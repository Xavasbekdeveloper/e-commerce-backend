import { Schema, model } from "mongoose";
import Joi from "joi";

const adminSchema = new Schema(
  {
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: false,
      default: "",
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "owner"],
      default: "admin",
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Admins = model("Admin", adminSchema);

export const validateAdmin = (body) => {
  const schema = Joi.object({
    fname: Joi.string().required(),
    lname: Joi.string(),
    phone: Joi.string().required(),
    role: Joi.string().valid("admin", "owner"),
    username: Joi.string().required(),
    password: Joi.string().required(),
    isActive: Joi.boolean().allow(true),
  });
  return schema.validate(body);
};
