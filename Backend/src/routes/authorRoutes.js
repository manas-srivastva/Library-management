import express from "express";

const router = express.Router();

import {

    createAuthor,

    getAuthors,

    updateAuthor,

    deleteAuthor

} from "../controllers/authorController.js";

import {

    createAuthorValidator,

    updateAuthorValidator

} from "../validators/authorValidator.js";

import validate from "../middlewares/validate.js";

import authMiddleware from "../middlewares/authMiddleware.js";

import authorize from "../middlewares/authorize.js";

import ROLES from "../constants/roles.js";


/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: Author management APIs
 */


/**
 * @swagger
 * /api/authors:
 *   post:
 *     summary: Create an author
 *     description: Creates a new author
 *     tags:
 *       - Authors
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
 *               - name
 *
 *             properties:
 *               name:
 *                 type: string
 *                 example: Robert C. Martin
 *
 *     responses:
 *       201:
 *         description: Author created successfully
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 */
router.post(

    "/",

    authMiddleware,

    authorize(

        ROLES.ADMIN,

        ROLES.LIBRARIAN

    ),

    createAuthorValidator,

    validate,

    createAuthor

);


/**
 * @swagger
 * /api/authors:
 *   get:
 *     summary: Get all authors
 *     description: Fetch all authors
 *     tags:
 *       - Authors
 *
 *     responses:
 *       200:
 *         description: Authors fetched successfully
 */
router.get(

    "/",

    getAuthors

);


/**
 * @swagger
 * /api/authors/{id}:
 *   put:
 *     summary: Update author
 *     description: Update author details
 *     tags:
 *       - Authors
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
 *               name:
 *                 type: string
 *                 example: Robert C. Martin
 *
 *     responses:
 *       200:
 *         description: Author updated successfully
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
 *         description: Author not found
 */
router.put(

    "/:id",

    authMiddleware,

    authorize(

        ROLES.ADMIN,

        ROLES.LIBRARIAN

    ),

    updateAuthorValidator,

    validate,

    updateAuthor

);


/**
 * @swagger
 * /api/authors/{id}:
 *   delete:
 *     summary: Delete author
 *     description: Delete an author by ID
 *     tags:
 *       - Authors
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
 *         description: Author deleted successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 *
 *       404:
 *         description: Author not found
 */
router.delete(

    "/:id",

    authMiddleware,

    authorize(

        ROLES.ADMIN

    ),

    deleteAuthor

);


export default router;