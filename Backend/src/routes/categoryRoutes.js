import express from "express";

import {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
} from "../controllers/categoryController.js";

import {
    createCategoryValidator,
    updateCategoryValidator
} from "../validators/categoryValidator.js";

import validate from "../middlewares/validate.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorize.js";

import ROLES from "../constants/roles.js";

const router = express.Router();

router.post(

    "/",

    authMiddleware,

    authorize(
        ROLES.ADMIN,
        ROLES.LIBRARIAN
    ),

    createCategoryValidator,

    validate,

    createCategory

);

router.get(

    "/",

    getCategories

);

router.put(

    "/:id",

    authMiddleware,

    authorize(
        ROLES.ADMIN,
        ROLES.LIBRARIAN
    ),

    updateCategoryValidator,

    validate,

    updateCategory

);

router.delete(

    "/:id",

    authMiddleware,

    authorize(
        ROLES.ADMIN
    ),

    deleteCategory

);

export default router;