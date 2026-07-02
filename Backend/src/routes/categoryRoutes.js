import express from "express";

import {

    createCategory,

    getCategories,

    updateCategory,

    deleteCategory

}

    from "../controllers/categoryController.js";

import {

    createCategoryValidator,

    updateCategoryValidator

}

    from "../validators/categoryValidator.js";

import validate from "../middlewares/validate.js";

const router = express.Router();


router.post(

    "/",

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

    updateCategoryValidator,

    validate,

    updateCategory

);


router.delete(

    "/:id",

    deleteCategory

);


export default router;