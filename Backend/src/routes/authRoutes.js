import express from "express";

const router = express.Router();

import {
  registerUser,
  loginUser,
  me
} from "../controllers/authController.js";

import {
  registerValidator,
  loginValidator
} from "../validators/authValidator.js";

import validate from "../middlewares/validate.js";
import authMiddleware from "../middlewares/authMiddleware.js";

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication related APIs
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account
 *     tags:
 *       - Authentication
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *
 *             properties:
 *               name:
 *                 type: string
 *                 example: Manas Srivastava
 *
 *               email:
 *                 type: string
 *                 example: manas@example.com
 *
 *               password:
 *                 type: string
 *                 example: password123
 *
 *     responses:
 *       201:
 *         description: User registered successfully
 *
 *       400:
 *         description: Validation error
 *
 *       409:
 *         description: User already exists
 */
router.post(
  "/register",
  registerValidator,
  validate,
  registerUser
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates user and returns JWT token
 *     tags:
 *       - Authentication
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             required:
 *               - email
 *               - password
 *
 *             properties:
 *               email:
 *                 type: string
 *                 example: manas@example.com
 *
 *               password:
 *                 type: string
 *                 example: password123
 *
 *     responses:
 *       200:
 *         description: Login successful
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Invalid credentials
 */
router.post(
  "/login",
  loginValidator,
  validate,
  loginUser
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     description: Returns details of the logged-in user
 *     tags:
 *       - Authentication
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: User details fetched successfully
 *
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/me",
  authMiddleware,
  me
);

export default router;