import express from "express";

import * as reservationController

    from "../controllers/reservationController.js";

import {

    createReservationValidator

}

    from "../validators/reservationValidator.js";

import validate

    from "../middlewares/validate.js";


const router = express.Router();


router.post(

    "/",

    createReservationValidator,

    validate,

    reservationController.create

);


router.get(

    "/",

    reservationController.getAll

);


router.put(

    "/cancel/:id",

    reservationController.cancel

);


export default router;