import express from "express"
const router=express.Router();

import { registerUser,loginUser } from "../controllers/authController.js";
import { registerValidator,loginValidator } from "../validators/authValidator.js";

import validate from "../middlewares/validate.js";

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



export default router;