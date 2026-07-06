import express from "express";

const router = express.Router();

import * as analyticsController

    from "../controllers/analyticsController.js";

import authMiddleware

    from "../middlewares/authMiddleware.js";

import authorize

    from "../middlewares/authorize.js";

import ROLES

    from "../constants/roles.js";
/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Library Analytics APIs
 */


/**
 * @swagger
 * /api/analytics/overview:
 *   get:
 *     summary: Get overall library statistics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overview fetched successfully
 */


router.get(

    "/overview",

    authMiddleware,

    authorize(

        ROLES.ADMIN,

        ROLES.LIBRARIAN

    ),

    analyticsController.overview

);
/**
 * @swagger
 * /api/analytics/popular-books:
 *   get:
 *     summary: Get most borrowed books
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Popular books fetched successfully
 */


router.get(

    "/popular-books",

    authMiddleware,

    authorize(

        ROLES.ADMIN,

        ROLES.LIBRARIAN

    ),

    analyticsController.popularBooks

);

/**
 * @swagger
 * /api/analytics/active-members:
 *   get:
 *     summary: Get most active members
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active members fetched successfully
 */
router.get(

    "/active-members",

    authMiddleware,

    authorize(

        ROLES.ADMIN,

        ROLES.LIBRARIAN

    ),

    analyticsController.activeMembers

);

/**
 * @swagger
 * /api/analytics/fines:
 *   get:
 *     summary: Get fine analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Fine statistics fetched successfully
 */
router.get(

    "/fines",

    authMiddleware,

    authorize(

        ROLES.ADMIN,

        ROLES.LIBRARIAN

    ),

    analyticsController.fineStats

);

/**
 * @swagger
 * /api/analytics/fines:
 *   get:
 *     summary: Get fine analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Fine statistics fetched successfully
 */
router.get(

    "/monthly-borrows",

    authMiddleware,

    authorize(

        ROLES.ADMIN,

        ROLES.LIBRARIAN

    ),

    analyticsController.monthlyBorrows

);


export default router;