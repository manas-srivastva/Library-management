import express from "express";

const router = express.Router();

import validate from "../middlewares/validate.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorize.js";

import ROLES from "../constants/roles.js";

import {

    createBookCopyValidator,

    updateBookCopyValidator

}

from "../validators/bookCopyValidator.js";

import {

    createBookCopy,

    getBookCopies,

    updateBookCopy,

    deleteBookCopy

}

from "../controllers/bookCopyController.js";


router.post(

    "/",

    authMiddleware,

    authorize(

        ROLES.ADMIN,

        ROLES.LIBRARIAN

    ),

    createBookCopyValidator,

    validate,

    createBookCopy

);


router.get(

    "/",

    getBookCopies

);


router.put(

    "/:id",

    authMiddleware,

    authorize(

        ROLES.ADMIN,

        ROLES.LIBRARIAN

    ),

    updateBookCopyValidator,

    validate,

    updateBookCopy

);


router.delete(

    "/:id",

    authMiddleware,

    authorize(

        ROLES.ADMIN

    ),

    deleteBookCopy

);

export default router;