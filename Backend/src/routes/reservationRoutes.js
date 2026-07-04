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


/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Reservation management APIs
 */


/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Create a reservation
 *     description: Reserve a book. Reservations are created against a Book, not a BookCopy.
 *     tags:
 *       - Reservations
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             required:
 *               - user
 *               - book
 *
 *             properties:
 *
 *               user:
 *                 type: string
 *                 example: 687b39f9a56b2d95f47a1234
 *
 *               book:
 *                 type: string
 *                 example: 687b39f9a56b2d95f47a5678
 *
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Book not found
 */
router.post(

    "/",

    authMiddleware,

    createReservationValidator,

    validate,

    reservationController.create

);


/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Get all reservations
 *     description: Fetch all reservations in the system.
 *     tags:
 *       - Reservations
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Reservations fetched successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 */
router.get(

    "/",

    authMiddleware,

    authorize(

        ROLES.ADMIN,

        ROLES.LIBRARIAN

    ),

    reservationController.getAll

);


/**
 * @swagger
 * /api/reservations/cancel/{id}:
 *   put:
 *     summary: Cancel reservation
 *     description: Cancel an active reservation.
 *     tags:
 *       - Reservations
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Reservation cancelled successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Reservation not found
 */
router.put(

    "/cancel/:id",

    authMiddleware,

    reservationController.cancel

);


export default router;