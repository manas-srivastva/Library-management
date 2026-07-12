import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import * as healthService from "../services/healthService.js";

export const getHealth=asyncHandler(async (req,res)=>{
    const health=healthService.getHealth();

    res.status(200).json(
        new ApiResponse(
            200,
            health,
            "Service is healthy"
        )
    )
});
