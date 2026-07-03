import express from "express";

const router = express.Router();

import validate
    from "../middlewares/validate.js";

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

    updateBookCopyValidator,

    validate,

    updateBookCopy

);

router.delete(

    "/:id",

    deleteBookCopy

);

export default router;