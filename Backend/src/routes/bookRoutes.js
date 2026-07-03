import express from "express";

const router = express.Router();

import validate
    from "../middlewares/validate.js";

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

    updateBookValidator,

    validate,

    updateBook

);


router.delete(

    "/:id",

    deleteBook

);

export default router;