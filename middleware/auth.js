import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

function auth(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const [bearer, token] = authorizationHeader.split(" ");

  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      return res.status(401).json({ message: "Not authorized" });
    }
    try {
      const user = await User.findById(decode.id);

      if (!user || user.token !== token) {
        return res.status(401).json({ message: "Not authorized" });
      }

      req.user = {
        id: user._id,
        email: user.email,
      };

      next();
    } catch (error) {
      next(error);
    }
  });
}

export default auth;