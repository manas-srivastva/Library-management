import express from "express";

const router = express.Router();

import * as fineController

    from "../controllers/fineController.js";

import authMiddleware

    from "../middlewares/authMiddleware.js";

import authorize

    from "../middlewares/authorize.js";

import ROLES

    from "../constants/roles.js";


/**
 * @swagger
 * tags:
 *   name: Fines
 *   description: Fine management APIs
 */


/**
 * @swagger
 * /api/fines:
 *   get:
 *     summary: Get all fines
 *     description: Fetch all fines in the system.
 *     tags:
 *       - Fines
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Fines fetched successfully
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

    fineController.getAll

);


/**
 * @swagger
 * /api/fines/{id}:
 *   get:
 *     summary: Get fine by ID
 *     description: Fetch details of a specific fine.
 *     tags:
 *       - Fines
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
 *         description: Fine fetched successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Fine not found
 */
router.get(

    "/:id",

    authMiddleware,

    fineController.getById

);


/**
 * @swagger
 * /api/fines/user/{id}:
 *   get:
 *     summary: Get user fines
 *     description: Retrieve all fines associated with a particular user.
 *     tags:
 *       - Fines
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
 *         description: User fines fetched successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: User not found
 */
router.get(

    "/user/:id",

    authMiddleware,

    fineController.getUserFines

);


/**
 * @swagger
 * /api/fines/pay/{id}:
 *   put:
 *     summary: Pay fine
 *     description: Mark a pending fine as paid.
 *     tags:
 *       - Fines
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
 *         description: Fine paid successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Fine not found
 */
router.put(

    "/pay/:id",

    authMiddleware,

    fineController.pay

);


export default router;