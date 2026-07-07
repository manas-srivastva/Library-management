import asyncHandler

    from "../utils/asyncHandler.js";

import ApiResponse

    from "../utils/ApiResponse.js";

import * as reservationService

    from "../services/reservationService.js";


export const create =

    asyncHandler(

        async (req, res) => {

            const reservation =

                await reservationService

                    .createReservation(

                        req.body

                    );

            res.status(201)

                .json(

                    new ApiResponse(

                        201,

                        reservation,

                        "Reserved"

                    )

                );

        }

    );

export const getById = asyncHandler(
async(req,res)=>{

    const reservation =

        await reservationService.getById(

            req.params.id

        );

    res.status(200).json(

        new ApiResponse(

            200,

            reservation,

            "Reservation fetched successfully"

        )

    );

});
export const getAll =

    asyncHandler(

        async (req, res) => {

            const reservations =

                await reservationService

                    .getAll();

            res.json(

                new ApiResponse(

                    200,

                    reservations

                )

            );

        }

    );


export const cancel =

    asyncHandler(

        async (req, res) => {

            const reservation =

                await reservationService

                    .cancelReservation(

                        req.params.id

                    );

            res.json(

                new ApiResponse(

                    200,

                    reservation,

                    "Cancelled"

                )

            );

        }

    );