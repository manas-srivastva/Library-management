import express from "express";

const router = express.Router();

import * as fineController

    from "../controllers/fineController.js";

import authMiddleware

    from "../middlewares/authMiddleware.js";

import authorize

    from "../middlewares/authorize.js";

import ROLES

    from "../constants/roles.js";


router.get(

    "/",

    authMiddleware,

    authorize(

        ROLES.ADMIN,

        ROLES.LIBRARIAN

    ),

    fineController.getAll

);


router.get(

    "/:id",

    authMiddleware,

    fineController.getById

);


router.get(

    "/user/:id",

    authMiddleware,

    fineController.getUserFines

);


router.put(

    "/pay/:id",

    authMiddleware,

    fineController.pay

);


export default router;