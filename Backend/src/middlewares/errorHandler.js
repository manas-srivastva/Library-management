import ApiResponse from "../utils/ApiResponse.js";

const errorHandler = (
    err,
    req,
    res,
    next
) => {

    // Handle invalid MongoDB ObjectId
    if (err.name === "CastError") {
        return res.status(400).json(
            new ApiResponse(
                400,
                "Invalid resource id"
            )
        );
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    return res.status(statusCode).json(
        new ApiResponse(
            statusCode,
            message
        )
    );
};

export default errorHandler;