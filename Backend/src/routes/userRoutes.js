import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorize.js";
import ROLES from "../constants/roles.js";
import { getUsers,deactivateUser,activateUser } from "../controllers/userController.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  authorize(ROLES.ADMIN),
  getUsers
);
router.put(
  "/:id/activate",
  authMiddleware,
  authorize(ROLES.ADMIN),
  activateUser
);

router.put(
  "/:id/deactivate",
  authMiddleware,
  authorize(ROLES.ADMIN),
  deactivateUser
);
export default router;

