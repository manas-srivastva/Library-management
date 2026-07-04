import express from "express";

const router = express.Router();

import validate from "../middlewares/validate.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorize.js";

import ROLES from "../constants/roles.js";

import {

    createPublisherValidator,

    updatePublisherValidator

}

from "../validators/publisherValidator.js";

import {

    createPublisher,

    getPublishers,

    updatePublisher,

    deletePublisher

}

from "../controllers/publisherController.js";


/**
 * @swagger
 * tags:
 *   name: Publishers
 *   description: Publisher management APIs
 */


/**
 * @swagger
 * /api/publishers:
 *   post:
 *     summary: Create a publisher
 *     description: Creates a new publisher
 *     tags:
 *       - Publishers
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
 *                 example: Prentice Hall
 *
 *     responses:
 *       201:
 *         description: Publisher created successfully
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

    createPublisherValidator,

    validate,

    createPublisher

);


/**
 * @swagger
 * /api/publishers:
 *   get:
 *     summary: Get all publishers
 *     description: Fetch all publishers
 *     tags:
 *       - Publishers
 *
 *     responses:
 *       200:
 *         description: Publishers fetched successfully
 */
router.get(

    "/",

    getPublishers

);


/**
 * @swagger
 * /api/publishers/{id}:
 *   put:
 *     summary: Update publisher
 *     description: Update publisher details
 *     tags:
 *       - Publishers
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
 *                 example: O'Reilly Media
 *
 *     responses:
 *       200:
 *         description: Publisher updated successfully
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
 *         description: Publisher not found
 */
router.put(

    "/:id",

    authMiddleware,

    authorize(

        ROLES.ADMIN,

        ROLES.LIBRARIAN

    ),

    updatePublisherValidator,

    validate,

    updatePublisher

);


/**
 * @swagger
 * /api/publishers/{id}:
 *   delete:
 *     summary: Delete publisher
 *     description: Delete a publisher by ID
 *     tags:
 *       - Publishers
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
 *         description: Publisher deleted successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 *
 *       404:
 *         description: Publisher not found
 */
router.delete(

    "/:id",

    authMiddleware,

    authorize(

        ROLES.ADMIN

    ),

    deletePublisher

);


export default router;