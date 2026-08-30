import jwt from "jsonwebtoken";

import User from "../models/User.js";

import ApiError from "../utils/ApiError.js";

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new ApiError(401, "Unauthorized"));
    }

    const token = authHeader.split(" ")[1];

    if (!token || token.trim() === "") {
        return next(new ApiError(401, "Unauthorized"));
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        return next(new ApiError(500, "JWT secret is not configured"));
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);

        if (!decoded || !decoded.id) {
            throw new ApiError(401, "Invalid Token");
        }

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        req.user = user;
        next();
    } catch (error) {
        const message = error instanceof ApiError ? error.message : "Invalid Token";
        next(new ApiError(401, message));
    }
};

export default authMiddleware;