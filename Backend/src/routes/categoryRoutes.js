import express from "express";

import {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
} from "../controllers/categoryController.js";

import {
    createCategoryValidator,
    updateCategoryValidator
} from "../validators/categoryValidator.js";

import validate from "../middlewares/validate.js";
import * as controller from "../controllers/categoryController.js"
import authMiddleware from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/authorize.js";

import ROLES from "../constants/roles.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management APIs
 */


/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a category
 *     description: Creates a new book category
 *     tags:
 *       - Categories
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
 *                 example: Programming
 *
 *     responses:
 *       201:
 *         description: Category created successfully
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

    createCategoryValidator,

    validate,

    createCategory

);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6870b8d9c4f4f2a12345678
 *     responses:
 *       200:
 *         description: Category fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Category not found
 */
router.get(
    "/:id",
    authMiddleware,
    authorize("ADMIN","LIBRARIAN","MEMBER"),
    controller.getById
);
/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     description: Fetch all categories
 *     tags:
 *       - Categories
 *
 *     responses:
 *       200:
 *         description: Categories fetched successfully
 */
router.get(

    "/",

    getCategories

);


/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update category
 *     description: Update an existing category
 *     tags:
 *       - Categories
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
 *                 example: Computer Science
 *
 *     responses:
 *       200:
 *         description: Category updated successfully
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
 *         description: Category not found
 */
router.put(

    "/:id",

    authMiddleware,

    authorize(
        ROLES.ADMIN,
        ROLES.LIBRARIAN
    ),

    updateCategoryValidator,

    validate,

    updateCategory

);


/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete category
 *     description: Delete a category by id
 *     tags:
 *       - Categories
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
 *         description: Category deleted successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 *
 *       404:
 *         description: Category not found
 */
router.delete(

    "/:id",

    authMiddleware,

    authorize(
        ROLES.ADMIN
    ),

    deleteCategory

);

export default router;