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
 * /api/notifications/me:
 *   get:
 *     summary: Get my notifications
 *     description: Get notifications belonging to the currently logged-in user.
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User notifications fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(

    "/me",

    authMiddleware,

    authorize(
        ROLES.ADMIN,
        ROLES.LIBRARIAN,
        ROLES.MEMBER
    ),

    notificationController.getMyNotifications

);


/**
 * @swagger
 * /api/notifications/{id}:
 *   get:
 *     summary: Get notification by ID
 *     description: Get a specific notification.
 *     tags:
 *       - Notifications
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
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
 * /api/notifications/read/{id}:
 *   put:
 *     summary: Mark notification as read
 *     description: Mark a notification as read.
 *     tags:
 *       - Notifications
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
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
 *     description: Mark all notifications belonging to the logged-in user as read.
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put(

    "/read-all",

    authMiddleware,

    authorize(
        ROLES.ADMIN,
        ROLES.LIBRARIAN,
        ROLES.MEMBER
    ),

    notificationController.markAllRead

);


export default router;