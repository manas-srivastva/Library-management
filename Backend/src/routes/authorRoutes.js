import express from "express";

const router = express.Router();

import {

    createAuthor,

    getAuthors,

    updateAuthor,

    deleteAuthor

}

    from "../controllers/authorController.js";


import {

    createAuthorValidator,

    updateAuthorValidator

}

    from "../validators/authorValidator.js";


import validate

    from "../middlewares/validate.js";


router.post(

    "/",

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

    updateAuthorValidator,

    validate,

    updateAuthor

);


router.delete(

    "/:id",

    deleteAuthor

);


export default router;