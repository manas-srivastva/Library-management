import express from "express"
const router=express.Router();

import { registerUser,loginUser,me } from "../controllers/authController.js";
import { registerValidator,loginValidator } from "../validators/authValidator.js";

import validate from "../middlewares/validate.js";
import authMiddleware from "../middlewares/authMiddleware.js";
router.post(

  "/register",

  registerValidator,

  validate,

  registerUser

);



router.post(

  "/login",

  loginValidator,

  validate,

  loginUser

);
router.get(

    "/me",

    authMiddleware,

    me

);


export default router;