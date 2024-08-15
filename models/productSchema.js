import { Schema, model } from "mongoose";
import Joi from "joi";

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    oldPrice: {
      type: Number,
      required: false,
      default: 0,
    },
    stock: {
      type: Number,
      required: false,
      default: 0,
    },
    rating: {
      type: Number,
      required: false,
      default: 0,
    },
    view: {
      type: Number,
      required: false,
      default: 0,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    units: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    urls: {
      type: Array,
      required: true,
    },
    info: {
      type: Array,
      required: false,
      default: [],
    },
    available: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

export const Products = model("Product", productSchema);

export const validateProduct = (body) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required(),
    oldPrice: Joi.number(),
    stock: Joi.number(),
    rating: Joi.number(),
    view: Joi.number().allow(0),
    categoryId: Joi.string(),
    adminId: Joi.string(),
    units: Joi.string().required(),
    description: Joi.string().required(),
    urls: Joi.array().required(),
    info: Joi.string(),
    available: Joi.boolean(),
  });

  return schema.validate(body);
};
