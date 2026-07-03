import express from "express";

const router = express.Router();

import validate
    from "../middlewares/validate.js";

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
    updatePublisherValidator,
    validate,

    updatePublisher

);

router.delete(

    "/:id",

    deletePublisher

);

export default router;