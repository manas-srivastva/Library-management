import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorize.js";
import ROLES from "../constants/roles.js";
import { getUsers } from "../controllers/userController.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  authorize(ROLES.ADMIN),
  getUsers
);

export default router;