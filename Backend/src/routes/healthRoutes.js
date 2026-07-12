import express from "express";
import * as healthController from "../controllers/healthController.js";

const router=express.Router();
/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Health check APIs
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check API health status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get("/",healthController.getHealth);

export default router;
