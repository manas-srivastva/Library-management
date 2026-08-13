import express from "express";

import * as fineController
    from "../controllers/fineController.js";

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
 *   name: Fines
 *   description: Fine management APIs
 */


/**
 * @swagger
 * /api/fines:
 *   get:
 *     summary: Get all fines
 *     description: Fetch all fines in the system with user and borrow record details.
 *     tags:
 *       - Fines
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Fines fetched successfully
 *       401:
 *         description: Unauthorized
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
 * /api/fines/user/{id}:
 *   get:
 *     summary: Get fines of a user
 *     description: Retrieve all fines associated with a particular user.
 *     tags:
 *       - Fines
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *         example: 6a4c09f0772625d029ce9cd1
 *     responses:
 *       200:
 *         description: User fines fetched successfully
 *       401:
 *         description: Unauthorized
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
 *     summary: Pay a fine
 *     description: Mark a pending fine as paid and record the payment date.
 *     tags:
 *       - Fines
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Fine ID
 *         schema:
 *           type: string
 *         example: 6a4c15fd1a79b4580256f4fa
 *     responses:
 *       200:
 *         description: Fine paid successfully
 *       400:
 *         description: Fine is already paid
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Fine not found
 */
router.put(
    "/pay/:id",
    authMiddleware,
    authorize(
        ROLES.ADMIN,
        ROLES.LIBRARIAN
    ),
    fineController.pay
);


/**
 * @swagger
 * /api/fines/{id}:
 *   get:
 *     summary: Get fine by ID
 *     description: Fetch details of a specific fine.
 *     tags:
 *       - Fines
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Fine ID
 *         schema:
 *           type: string
 *         example: 6a4c15fd1a79b4580256f4fa
 *     responses:
 *       200:
 *         description: Fine fetched successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Fine not found
 */
router.get(
    "/:id",
    authMiddleware,
    fineController.getById
);


export default router;