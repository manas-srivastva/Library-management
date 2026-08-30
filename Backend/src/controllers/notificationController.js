import * as notificationService

from "../services/notificationService.js";


import asyncHandler

from "../utils/asyncHandler.js";


import ApiResponse

from "../utils/ApiResponse.js";

import ApiError from "../utils/ApiError.js";
import ROLES from "../constants/roles.js";


export const getAll = asyncHandler(

async (req, res) => {

    // Only ADMIN/LIBRARIAN can view all notifications
    if (req.user.role !== ROLES.ADMIN && req.user.role !== ROLES.LIBRARIAN) {
        return next(new ApiError(403, "Forbidden"));
    }

    const notifications =

        await notificationService.getAll();

    res.status(200).json(

        new ApiResponse(

            200,

            notifications

        )

    );

});



export const getById = asyncHandler(

async (req, res) => {

    const notification =

        await notificationService.getById(

            req.params.id

        );

    res.status(200).json(

        new ApiResponse(

            200,

            notification

        )

    );

});



export const getMyNotifications = asyncHandler(
    async (req, res) => {

        const notifications =
            await notificationService.getUserNotifications(
                req.user._id
            );

        res.status(200).json(
            new ApiResponse(
                200,
                "Notifications fetched successfully",
                notifications
            )
        );

    }
);


export const markRead = asyncHandler(
async (req, res) => {

    const notification =
        await notificationService.markRead(
            req.params.id,
            req.user._id
        );

    res.status(200).json(

        new ApiResponse(
            200,
            notification,
            "Notification updated"
        )

    );

});


export const markAllRead = asyncHandler(

async (req, res) => {

    await notificationService

        .markAllRead(

            req.user._id

        );

    res.status(200).json(

        new ApiResponse(

            200,

            {},

            "Notifications updated"

        )

    );

});


