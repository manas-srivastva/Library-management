import express from "express";

const router = express.Router();

import validate from "../middlewares/validate.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorize.js";

import ROLES from "../constants/roles.js";

import {

    createPublisherValidator,

    updatePublisherValidator

}

from "../validators/publisherValidator.js";

import {

    createPublisher,

    getPublishers,

    updatePublisher,

    deletePublisher

}

from "../controllers/publisherController.js";


router.post(

    "/",

    authMiddleware,

    authorize(

        ROLES.ADMIN,

        ROLES.LIBRARIAN

    ),

    createPublisherValidator,

    validate,

    createPublisher

);


router.get(

    "/",

    getPublishers

);


router.put(

    "/:id",

    authMiddleware,

    authorize(

        ROLES.ADMIN,

        ROLES.LIBRARIAN

    ),

    updatePublisherValidator,

    validate,

    updatePublisher

);


router.delete(

    "/:id",

    authMiddleware,

    authorize(

        ROLES.ADMIN

    ),

    deletePublisher

);


export default router;