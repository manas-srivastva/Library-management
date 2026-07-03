import express from "express";

import * as borrowController

    from "../controllers/borrowController.js";

import {

    createBorrowValidator

}

    from "../validators/borrowValidator.js";

import validate

    from "../middlewares/validate.js";


const router = express.Router();


router.post(

    "/",

    createBorrowValidator,

    validate,

    borrowController.borrowBook

);


router.get(

    "/",

    borrowController.getAll

);


router.get(

    "/:id",

    borrowController.getById

);


router.put(

    "/return/:id",

    borrowController.returnBook

);


router.get(

    "/user/:id",

    borrowController.history

);


export default router;