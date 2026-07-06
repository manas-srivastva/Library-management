import express from "express";

const router = express.Router();

import * as auditController
from "../controllers/auditController.js";

import authMiddleware
from "../middlewares/authMiddleware.js";

import authorize
from "../middlewares/authorize.js";

import ROLES
from "../constants/roles.js";

/**
 * @swagger
 * tags:
 *   name: Audit Logs
 *   description: Audit Log APIs
 */


/**
 * @swagger
 * /api/audit:
 *   get:
 *     summary: Get all audit logs
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Audit logs fetched successfully
 */
router.get(

    "/",

    authMiddleware,

    authorize(

        ROLES.ADMIN,

        ROLES.LIBRARIAN

    ),

    auditController.getAll

);

/**
 * @swagger
 * /api/audit/{id}:
 *   get:
 *     summary: Get audit log by id
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Audit log fetched successfully
 */
router.get(

    "/:id",

    authMiddleware,

    authorize(

        ROLES.ADMIN,

        ROLES.LIBRARIAN

    ),

    auditController.getById

);
/**
 * @swagger
 * /api/audit/user/{id}:
 *   get:
 *     summary: Get audit logs of a user
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User audit logs fetched successfully
 */

router.get(

    "/user/:id",

    authMiddleware,

    authorize(

        ROLES.ADMIN,

        ROLES.LIBRARIAN

    ),

    auditController.getUserLogs

);


export default router;