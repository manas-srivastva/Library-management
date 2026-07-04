import express from "express";

const router = express.Router();

import validate from "../middlewares/validate.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorize.js";

import ROLES from "../constants/roles.js";

import {

    createBookValidator,

    updateBookValidator

}

from "../validators/bookValidator.js";

import {

    createBook,

    getBooks,

    updateBook,

    deleteBook

}

from "../controllers/bookController.js";


router.post(

    "/",

    authMiddleware,

    authorize(

        ROLES.ADMIN,

        ROLES.LIBRARIAN

    ),

    createBookValidator,

    validate,

    createBook

);


router.get(

    "/",

    getBooks

);


router.put(

    "/:id",

    authMiddleware,

    authorize(

        ROLES.ADMIN,

        ROLES.LIBRARIAN

    ),

    updateBookValidator,

    validate,

    updateBook

);


router.delete(

    "/:id",

    authMiddleware,

    authorize(

        ROLES.ADMIN

    ),

    deleteBook

);


export default router;