import express from "express";

import validate from "../middlewares/validate.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorize.js";

import ROLES from "../constants/roles.js";

import {
    createBookCopyValidator,
    updateBookCopyValidator
} from "../validators/bookCopyValidator.js";

import {
    createBookCopy,
    getBookCopies,
    getById,
    updateBookCopy,
    deleteBookCopy
} from "../controllers/bookCopyController.js";

const router = express.Router();

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
 *     tags:
 *       - BookCopies
 *     security:
 *       - bearerAuth: []
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
 *     tags:
 *       - BookCopies
 *     security:
 *       - bearerAuth: []
 */
router.get(
    "/",
    authMiddleware,
    authorize(
        ROLES.ADMIN,
        ROLES.LIBRARIAN
    ),
    getBookCopies
);

/**
 * @swagger
 * /api/bookcopies/{id}:
 *   get:
 *     summary: Get book copy by ID
 *     tags:
 *       - BookCopies
 *     security:
 *       - bearerAuth: []
 */
router.get(
    "/:id",
    authMiddleware,
    authorize(
        ROLES.ADMIN,
        ROLES.LIBRARIAN
    ),
    getById
);

/**
 * @swagger
 * /api/bookcopies/{id}:
 *   put:
 *     summary: Update a book copy
 *     tags:
 *       - BookCopies
 *     security:
 *       - bearerAuth: []
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
 *     tags:
 *       - BookCopies
 *     security:
 *       - bearerAuth: []
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