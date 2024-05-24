import express from "express";
import AuthController from "../controllers/authControllers.js";
import authMiddleware from "../middleware/auth.js";
import UserController from "../controllers/usersControllers.js"
import uploadMiddleware from "../middleware/upload.js";

const router = express.Router();
const jsonParser = express.json();

router.post("/register", jsonParser, AuthController.register);
router.post("/login", jsonParser, AuthController.login);
router.post("/logout", authMiddleware, AuthController.logout);
router.get("/current", authMiddleware, AuthController.current); 

router.get("/avatar", authMiddleware, UserController.getAvatar);  
router.patch(
  "/avatar",
  authMiddleware, 
  uploadMiddleware.single("avatar"),
  UserController.uploadAvatar
);

export default router;












