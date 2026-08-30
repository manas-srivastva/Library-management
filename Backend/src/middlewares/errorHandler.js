import ApiResponse from "../utils/ApiResponse.js";

const errorHandler = (err, req, res, next) => {
    if (err.name === "CastError") {
        return res.status(400).json(new ApiResponse(400, "Invalid resource id"));
    }

    if (err.name === "ValidationError") {
        return res.status(400).json(new ApiResponse(400, err.message));
    }

    if (err.name === "MongoServerError" && err.code === 11000) {
        return res.status(409).json(new ApiResponse(409, "Duplicate value found"));
    }

    if (err.name === "JsonWebTokenError") {
        return res.status(401).json(new ApiResponse(401, "Invalid Token"));
    }

    if (err.name === "TokenExpiredError") {
        return res.status(401).json(new ApiResponse(401, "Token expired"));
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    const isProduction = process.env.NODE_ENV === "production";
    if (statusCode >= 500 && isProduction) {
        return res.status(statusCode).json(new ApiResponse(statusCode, "Internal Server Error"));
    }

    return res.status(statusCode).json(new ApiResponse(statusCode, message));
};

export default errorHandler;