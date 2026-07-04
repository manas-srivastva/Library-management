import express from "express";

const router = express.Router();

import validate from "../middlewares/validate.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorize.js";

import ROLES from "../constants/roles.js";

import {

    createBookCopyValidator,

    updateBookCopyValidator

}

from "../validators/bookCopyValidator.js";

import {

    createBookCopy,

    getBookCopies,

    updateBookCopy,

    deleteBookCopy

}

from "../controllers/bookCopyController.js";


/**
 * @swagger
 * tags:
 *   name: BookCopies
 *   description: Book copy management APIs
 */


/**
 * @swagger
 * /api/bookcopies:
 *   post:
 *     summary: Create a book copy
 *     description: Create a physical copy of a book that can be borrowed by members.
 *     tags:
 *       - BookCopies
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
 *               - book
 *               - barcode
 *               - shelfLocation
 *
 *             properties:
 *
 *               book:
 *                 type: string
 *                 example: 687b39f9a56b2d95f47a1234
 *
 *               barcode:
 *                 type: string
 *                 example: BC1001
 *
 *               shelfLocation:
 *                 type: string
 *                 example: A-12
 *
 *               status:
 *                 type: string
 *                 enum:
 *                   - AVAILABLE
 *                   - BORROWED
 *                   - RESERVED
 *                   - LOST
 *                   - MAINTENANCE
 *                 example: AVAILABLE
 *
 *     responses:
 *       201:
 *         description: Book copy created successfully
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
 *         description: Book not found
 */
router.post(

    "/",

    authMiddleware,

    authorize(

        ROLES.ADMIN,

        ROLES.LIBRARIAN

    ),

    createBookCopyValidator,

    validate,

    createBookCopy

);


/**
 * @swagger
 * /api/bookcopies:
 *   get:
 *     summary: Get all book copies
 *     description: Fetch all book copies with populated book details.
 *     tags:
 *       - BookCopies
 *
 *     responses:
 *       200:
 *         description: Book copies fetched successfully
 */
router.get(

    "/",

    getBookCopies

);


/**
 * @swagger
 * /api/bookcopies/{id}:
 *   put:
 *     summary: Update a book copy
 *     description: Update barcode, location or status of a book copy.
 *     tags:
 *       - BookCopies
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             properties:
 *
 *               barcode:
 *                 type: string
 *                 example: BC1001
 *
 *               shelfLocation:
 *                 type: string
 *                 example: A-15
 *
 *               status:
 *                 type: string
 *                 enum:
 *                   - AVAILABLE
 *                   - BORROWED
 *                   - RESERVED
 *                   - LOST
 *                   - MAINTENANCE
 *                 example: MAINTENANCE
 *
 *     responses:
 *       200:
 *         description: Book copy updated successfully
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
 *         description: Book copy not found
 */
router.put(

    "/:id",

    authMiddleware,

    authorize(

        ROLES.ADMIN,

        ROLES.LIBRARIAN

    ),

    updateBookCopyValidator,

    validate,

    updateBookCopy

);


/**
 * @swagger
 * /api/bookcopies/{id}:
 *   delete:
 *     summary: Delete a book copy
 *     description: Delete a physical copy of a book.
 *     tags:
 *       - BookCopies
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
 *         description: Book copy deleted successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 *
 *       404:
 *         description: Book copy not found
 */
router.delete(

    "/:id",

    authMiddleware,

    authorize(

        ROLES.ADMIN

    ),

    deleteBookCopy

);

export default router;