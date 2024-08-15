import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const auth = (req, res, next) => {
  const bearer = req.header("Authorization")?.split(" ")[0];
  const token = req.header("Authorization")?.split(" ")[1];
  if (bearer !== "Bearer") {
    return res.status(401).json({
      msg: "Invalid token.",
      variant: "error",
      payload: null,
    });
  }
  if (!token) {
    return res.status(401).json({
      msg: "Access denied.",
      variant: "error",
      payload: null,
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY,
      function (err, decoded) {
        if (err) {
          return res.status(401).json({
            msg: "Invalid token.",
            variant: "error",
            payload: null,
          });
        }
        if (decoded.isActive) {
          req.admin = decoded;
          next();
        } else {
          return res.status(401).json({
            msg: "Invalid token.",
            variant: "error",
            payload: null,
          });
        }
      }
    );
  } catch {
    res.status(401).json({
      msg: "Invalid token.",
      variant: "error",
      payload: null,
    });
  }
};
