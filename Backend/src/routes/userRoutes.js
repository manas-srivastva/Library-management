import express from "express";

import authMiddleware
from "../middlewares/authMiddleware.js";

import authorize
from "../middlewares/authorize.js";

import ROLES
from "../constants/roles.js";

import {
  getUsers,
  deactivateUser,
  activateUser,
  updateProfile,
  changePassword
} from "../controllers/userController.js";

const router = express.Router();


/*
=================================
UPDATE MY PROFILE
=================================
*/

router.put(
  "/profile",
  authMiddleware,
  updateProfile
);


/*
=================================
GET ALL MEMBERS
ADMIN ONLY
=================================
*/

router.get(
  "/",
  authMiddleware,
  authorize(ROLES.ADMIN),
  getUsers
);



router.put(
  "/profile",
  authMiddleware,
  updateProfile
);

router.put(
  "/change-password",
  authMiddleware,
  changePassword
);
/*
=================================
ACTIVATE USER
ADMIN ONLY
=================================
*/

router.put(
  "/:id/activate",
  authMiddleware,
  authorize(ROLES.ADMIN),
  activateUser
);


/*
=================================
DEACTIVATE USER
ADMIN ONLY
=================================
*/

router.put(
  "/:id/deactivate",
  authMiddleware,
  authorize(ROLES.ADMIN),
  deactivateUser
);


export default router;