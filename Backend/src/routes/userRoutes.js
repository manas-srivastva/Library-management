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
  updateMyProfile
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
  updateMyProfile
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