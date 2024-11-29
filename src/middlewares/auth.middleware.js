import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const auth = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    jwt.verify(token, TOKEN_SECRET, (error, user) => {
      if (error) {
        const message =
          error.name === "TokenExpiredError"
            ? "Token has expired, please log in again"
            : "Token is not valid";
        return res.status(401).json({ message });
      }

      // Attach user data to request for role-based access if needed
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
