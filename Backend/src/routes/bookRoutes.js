import express from "express";

import validate from "../middlewares/validate.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorize.js";

import * as bookController from "../controllers/bookController.js";

import ROLES from "../constants/roles.js";

import {
    createBookValidator,
    updateBookValidator
} from "../validators/bookValidator.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book Management APIs
 */

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create a new book
 *     description: Creates a new book. Authors, publisher and category must be valid MongoDB ObjectIds.
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - isbn
 *               - authors
 *               - publisher
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: Clean Code
 *               isbn:
 *                 type: string
 *                 example: "9780132350884"
 *               description:
 *                 type: string
 *                 example: A Handbook of Agile Software Craftsmanship
 *               language:
 *                 type: string
 *                 example: English
 *               publicationYear:
 *                 type: integer
 *                 example: 2008
 *               pages:
 *                 type: integer
 *                 example: 464
 *               authors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - "6892f2f2f2f2f2f2f2f2f2f2"
 *               publisher:
 *                 type: string
 *                 example: "6892f2f2f2f2f2f2f2f2f2f3"
 *               category:
 *                 type: string
 *                 example: "6892f2f2f2f2f2f2f2f2f2f4"
 *               coverImage:
 *                 type: string
 *                 example: https://example.com/clean-code.jpg
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Validation error or duplicate ISBN
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Author, Publisher or Category not found
 */
router.post(
    "/",
    authMiddleware,
    authorize(
        ROLES.ADMIN,
        ROLES.LIBRARIAN
    ),
    createBookValidator,
    validate,
    bookController.createBook
);

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     description: Returns all books with populated authors, publisher and category.
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Books fetched successfully
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
        ROLES.LIBRARIAN,
        ROLES.MEMBER
    ),
    bookController.getBooks
);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB Book ID
 *         example: 6892f2f2f2f2f2f2f2f2f2f5
 *     responses:
 *       200:
 *         description: Book fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Book not found
 */
router.get(
    "/:id",
    authMiddleware,
    authorize(
        ROLES.ADMIN,
        ROLES.LIBRARIAN,
        ROLES.MEMBER
    ),
    bookController.getById
);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update a book
 *     description: Updates any book fields. Authors, publisher and category must be valid MongoDB ObjectIds.
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Clean Code (2nd Edition)
 *               isbn:
 *                 type: string
 *                 example: "9780132350884"
 *               description:
 *                 type: string
 *               language:
 *                 type: string
 *               publicationYear:
 *                 type: integer
 *                 example: 2009
 *               pages:
 *                 type: integer
 *                 example: 500
 *               authors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - "6892f2f2f2f2f2f2f2f2f2f2"
 *               publisher:
 *                 type: string
 *                 example: "6892f2f2f2f2f2f2f2f2f2f3"
 *               category:
 *                 type: string
 *                 example: "6892f2f2f2f2f2f2f2f2f2f4"
 *               coverImage:
 *                 type: string
 *                 example: https://example.com/new-cover.jpg
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Book not found
 */
router.put(
    "/:id",
    authMiddleware,
    authorize(
        ROLES.ADMIN,
        ROLES.LIBRARIAN
    ),
    updateBookValidator,
    validate,
    bookController.updateBook
);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book
 *     tags:
 *       - Books
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB Book ID
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Book not found
 */
router.delete(
    "/:id",
    authMiddleware,
    authorize(ROLES.ADMIN),
    bookController.deleteBook
);

export default router;