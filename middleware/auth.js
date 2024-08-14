import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const auth = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      msg: "Access denied.",
      variant: "error",
      payload: null,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({
      msg: "Invalid token.",
      variant: "error",
      payload: null,
    });
  }
};
