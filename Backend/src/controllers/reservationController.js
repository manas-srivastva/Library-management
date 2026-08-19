import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ROLES from "../constants/roles.js";
import * as reservationService from "../services/reservationService.js";

export const create = asyncHandler(async (req, res) => {

    const data = {
        ...req.body
    };

    // MEMBER can only create a reservation for themselves
    if (req.user.role === ROLES.MEMBER) {
        data.user = req.user._id;
    }

    const reservation =
        await reservationService.createReservation(data);

    res.status(201).json(
        new ApiResponse(
            201,
            "Reservation created",
            reservation
        )
    );

});

export const getById = asyncHandler(async (req, res) => {

    const reservation =
        await reservationService.getById(req.params.id);

    if (
        req.user.role === ROLES.MEMBER &&
        reservation.user._id.toString() !== req.user._id.toString()
    ) {
        return res.status(403).json({
            statusCode: 403,
            success: false,
            message: "Forbidden",
            data: null
        });
    }

    res.status(200).json(
        new ApiResponse(
            200,
            "Reservation fetched successfully",
            reservation
        )
    );

});

export const getAll = asyncHandler(async (req, res) => {

    const reservations =
        await reservationService.getAll();

    res.status(200).json(
        new ApiResponse(
            200,
            "Reservations fetched successfully",
            reservations
        )
    );

});



export const cancel = asyncHandler(async (req, res) => {

    const reservation =
        await reservationService.getById(req.params.id);

    if (
        req.user.role === ROLES.MEMBER &&
        reservation.user._id.toString() !== req.user._id.toString()
    ) {
        return res.status(403).json({
            statusCode: 403,
            success: false,
            message: "Forbidden",
            data: null
        });
    }

    const updatedReservation =
        await reservationService.cancelReservation(
            req.params.id
        );

    res.status(200).json(
        new ApiResponse(
            200,
            "Reservation cancelled",
            updatedReservation
        )
    );

});