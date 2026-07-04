import express from "express";

const router = express.Router();

import {

    createAuthor,

    getAuthors,

    updateAuthor,

    deleteAuthor

} from "../controllers/authorController.js";

import {

    createAuthorValidator,

    updateAuthorValidator

} from "../validators/authorValidator.js";

import validate from "../middlewares/validate.js";

import authMiddleware from "../middlewares/authMiddleware.js";

import authorize from "../middlewares/authorize.js";

import ROLES from "../constants/roles.js";


router.post(

    "/",

    authMiddleware,

    authorize(

        ROLES.ADMIN,

        ROLES.LIBRARIAN

    ),

    createAuthorValidator,

    validate,

    createAuthor

);


router.get(

    "/",

    getAuthors

);


router.put(

    "/:id",

    authMiddleware,

    authorize(

        ROLES.ADMIN,

        ROLES.LIBRARIAN

    ),

    updateAuthorValidator,

    validate,

    updateAuthor

);


router.delete(

    "/:id",

    authMiddleware,

    authorize(

        ROLES.ADMIN

    ),

    deleteAuthor

);


export default router;