import express from "express";

const router = express.Router();

import * as notificationController

from "../controllers/notificationController.js";

import authMiddleware

from "../middlewares/authMiddleware.js";

import authorize

from "../middlewares/authorize.js";

import ROLES

from "../constants/roles.js";

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification management APIs
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications fetched successfully
 */

router.get(

    "/",

    authMiddleware,

    authorize(

        ROLES.ADMIN,

        ROLES.LIBRARIAN

    ),

    notificationController.getAll

);
/**
 * @swagger
 * /api/notifications/{id}:
 *   get:
 *     summary: Get notification by ID
 *     tags: [Notifications]
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
 *         description: Notification fetched successfully
 *       404:
 *         description: Notification not found
 */

router.get(

    "/:id",

    authMiddleware,

    notificationController.getById

);
/**
 * @swagger
 * /api/notifications/user/{id}:
 *   get:
 *     summary: Get notifications of a user
 *     tags: [Notifications]
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
 *         description: User notifications fetched successfully
 */

router.get(

    "/user/:id",

    authMiddleware,

    notificationController

        .getUserNotifications

);

/**
 * @swagger
 * /api/notifications/read/{id}:
 *   put:
 *     summary: Mark notification as read
 *     tags: [Notifications]
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
 *         description: Notification marked as read
 *       404:
 *         description: Notification not found
 */
router.put(

    "/read/:id",

    authMiddleware,

    notificationController.markRead

);

/**
 * @swagger
 * /api/notifications/read-all:
 *   put:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 */
router.put(

    "/read-all",

    authMiddleware,

    notificationController.markAllRead

);


export default router;