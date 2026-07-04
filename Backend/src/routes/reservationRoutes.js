import express from "express";

import * as reservationController
    from "../controllers/reservationController.js";

import {
    createReservationValidator
}
    from "../validators/reservationValidator.js";

import validate
    from "../middlewares/validate.js";

import authMiddleware
    from "../middlewares/authMiddleware.js";

import authorize
    from "../middlewares/authorize.js";

import ROLES
    from "../constants/roles.js";


const router = express.Router();


router.post(

    "/",

    authMiddleware,

    createReservationValidator,

    validate,

    reservationController.create

);


router.get(

    "/",

    authMiddleware,

    authorize(

        ROLES.ADMIN,

        ROLES.LIBRARIAN

    ),

    reservationController.getAll

);


router.put(

    "/cancel/:id",

    authMiddleware,

    reservationController.cancel

);


export default router;