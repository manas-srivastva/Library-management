import express from "express";

const router = express.Router();

import validate from "../middlewares/validate.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorize.js";
import * as bookController from "../controllers/bookController.js";
import ROLES from "../constants/roles.js";

import {

    createBookValidator,

    updateBookValidator

}

from "../validators/bookValidator.js";

import {

    createBook,

    getBooks,

    updateBook,

    deleteBook

}

from "../controllers/bookController.js";


/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management APIs
 */


/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create a book
 *     description: Creates a new book. Author, publisher and category are provided by name and internally converted to ObjectIds.
 *     tags:
 *       - Books
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
 *               - title
 *               - isbn
 *               - authors
 *               - publisher
 *               - category
 *
 *             properties:
 *
 *               title:
 *                 type: string
 *                 example: Clean Code
 *
 *               isbn:
 *                 type: string
 *                 example: "9780132350884"
 *
 *               authors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Robert C. Martin
 *
 *               publisher:
 *                 type: string
 *                 example: Prentice Hall
 *
 *               category:
 *                 type: string
 *                 example: Programming
 *
 *     responses:
 *       201:
 *         description: Book created successfully
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

    createBook

);


/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     description: Fetch all books with populated authors, publisher and category.
 *     tags:
 *       - Books
 *
 *     responses:
 *       200:
 *         description: Books fetched successfully
 */
router.get(

    "/",

    getBooks

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
 *         example: 6a4be9b3194ec542e254c5d6
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
    authorize("ADMIN", "LIBRARIAN", "MEMBER"),
    bookController.getById
);


/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update book
 *     description: Update an existing book.
 *     tags:
 *       - Books
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
 *               title:
 *                 type: string
 *                 example: Clean Code
 *
 *               isbn:
 *                 type: string
 *                 example: "9780132350884"
 *
 *               authors:
 *                 type: array
 *                 items:
 *                   type: string
 *
 *               publisher:
 *                 type: string
 *
 *               category:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: Book updated successfully
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
router.put(

    "/:id",

    authMiddleware,

    authorize(

        ROLES.ADMIN,

        ROLES.LIBRARIAN

    ),

    updateBookValidator,

    validate,

    updateBook

);


/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete book
 *     description: Delete a book by ID.
 *     tags:
 *       - Books
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
 *         description: Book deleted successfully
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
router.delete(

    "/:id",

    authMiddleware,

    authorize(

        ROLES.ADMIN

    ),

    deleteBook

);


export default router;