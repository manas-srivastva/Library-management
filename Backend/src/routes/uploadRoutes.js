import express

    from "express";

const router = express.Router();


import authMiddleware

    from "../middlewares/authMiddleware.js";

import authorize

    from "../middlewares/authorize.js";

import upload

    from "../middlewares/uploadMiddleware.js";


import *

    as uploadController

    from "../controllers/uploadController.js";
/**
 * @swagger
 * tags:
 *   name: Uploads
 *   description: File upload APIs
 */

/**
 * @swagger
 * /api/uploads/book-cover:
 *   post:
 *     summary: Upload a book cover image
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Book cover uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Book cover uploaded
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: https://res.cloudinary.com/demo/image/upload/libraai/book-cover.jpg
 *                     publicId:
 *                       type: string
 *                       example: libraai/1720192812-book-cover
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

router.post(

    "/book-cover",

    authMiddleware,

    authorize(

        "ADMIN",

        "LIBRARIAN"

    ),

    upload.single(

        "image"

    ),

    uploadController.uploadBookCover

);

/**
 * @swagger
 * /api/uploads/avatar:
 *   post:
 *     summary: Upload user avatar
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Avatar uploaded
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: https://res.cloudinary.com/demo/image/upload/libraai/avatar.jpg
 *                     publicId:
 *                       type: string
 *                       example: libraai/1720192812-avatar
 *       401:
 *         description: Unauthorized
 */
router.post(

    "/avatar",

    authMiddleware,

    upload.single(

        "image"

    ),

    uploadController.uploadAvatar

);


export default router;