import express from "express";

import * as borrowController
    from "../controllers/borrowController.js";

import {
    createBorrowValidator
}
    from "../validators/borrowValidator.js";

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
 *   name: Borrows
 *   description: Borrow management APIs
 */


/**
 * @swagger
 * /api/borrows:
 *   post:
 *     summary: Issue a book copy
 *     description: Creates a borrow record and marks the book copy as BORROWED.
 *     tags:
 *       - Borrows
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
 *               - bookCopy
 *               - dueDate
 *
 *             properties:
 *
 *               user:
 *                 type: string
 *                 example: 687b39f9a56b2d95f47a1234
 *
 *               bookCopy:
 *                 type: string
 *                 example: 687b39f9a56b2d95f47a5678
 *
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-07-20
 *
 *     responses:
 *       201:
 *         description: Book issued successfully
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 *
 *       404:
 *         description: User or BookCopy not found
 */
router.post(

    "/",

    authMiddleware,

    authorize(

        ROLES.ADMIN,

        ROLES.LIBRARIAN

    ),

    createBorrowValidator,

    validate,

    borrowController.borrowBook

);


/**
 * @swagger
 * /api/borrows:
 *   get:
 *     summary: Get all borrow records
 *     description: Fetch all borrow records with populated references.
 *     tags:
 *       - Borrows
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Borrow records fetched successfully
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

    borrowController.getAll

);


/**
 * @swagger
 * /api/borrows/{id}:
 *   get:
 *     summary: Get borrow record by ID
 *     description: Fetch a single borrow record.
 *     tags:
 *       - Borrows
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
 *         description: Borrow record fetched successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Borrow record not found
 */
router.get(

    "/:id",

    authMiddleware,

    borrowController.getById

);


/**
 * @swagger
 * /api/borrows/return/{id}:
 *   put:
 *     summary: Return a borrowed book
 *     description: Returns a borrowed book copy, marks it AVAILABLE and automatically creates a fine if overdue.
 *     tags:
 *       - Borrows
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
 *         description: Book returned successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 *
 *       404:
 *         description: Borrow record not found
 */
router.put(

    "/return/:id",

    authMiddleware,

    authorize(

        ROLES.ADMIN,

        ROLES.LIBRARIAN

    ),

    borrowController.returnBook

);


/**
 * @swagger
 * /api/borrows/user/{id}:
 *   get:
 *     summary: Get borrowing history of a user
 *     description: Returns all borrow records associated with a particular user.
 *     tags:
 *       - Borrows
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
 *         description: Borrow history fetched successfully
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

    borrowController.history

);

export default router;