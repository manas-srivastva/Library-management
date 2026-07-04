import express from "express";

import * as borrowController
    from "../controllers/borrowController.js";

import {
    createBorrowValidator
}
    from "../validators/borrowValidator.js";

import validate
    from "../middlewares/validate.js";

import authMiddleware
    from "../middlewares/authMiddleware.js";

import authorize
    from "../middlewares/authorize.js";

import ROLES
    from "../constants/roles.js";


const router = express.Router();


router.post(

    "/",

    authMiddleware,

    authorize(

        ROLES.ADMIN,

        ROLES.LIBRARIAN

    ),

    createBorrowValidator,

    validate,

    borrowController.borrowBook

);


router.get(

    "/",

    authMiddleware,

    authorize(

        ROLES.ADMIN,

        ROLES.LIBRARIAN

    ),

    borrowController.getAll

);


router.get(

    "/:id",

    authMiddleware,

    borrowController.getById

);


router.put(

    "/return/:id",

    authMiddleware,

    authorize(

        ROLES.ADMIN,

        ROLES.LIBRARIAN

    ),

    borrowController.returnBook

);


router.get(

    "/user/:id",

    authMiddleware,

    borrowController.history

);


export default router;