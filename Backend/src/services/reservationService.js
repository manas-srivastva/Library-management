import Reservation
from "../models/Reservation.js";

import User
from "../models/User.js";

import Book
from "../models/Book.js";

import ApiError
from "../utils/ApiError.js";

import * as reservationRepository
from "../repositories/reservationRepository.js";

import * as notificationService
from "./notificationService.js";

import { NOTIFICATION_TYPES }
from "../constants/notificationTypes.js";


export const createReservation =

    async (data) => {

        const user =

            await User.findOne({

                email: data.user

            });

        if (!user)

            throw new ApiError(

                404,

                "User not found"

            );


        const book =

            await Book.findOne({

                title: {

                    $regex:

                        `^${data.book}$`,

                    $options: "i"

                }

            });

        if (!book)

            throw new ApiError(

                404,

                "Book not found"

            );


        const reservation =

            await reservationRepository.create({

                user: user._id,

                book: book._id

            });


        await notificationService.createNotification({

            user: user._id,

            type:

                NOTIFICATION_TYPES.RESERVATION_CREATED,

            title:

                "Reservation Created",

            message:

                `Reservation created successfully for "${book.title}".`,

            metadata: {

                reservationId:

                    reservation._id,

                bookId:

                    book._id

            }

        });


        return reservation;

    };


export const getAll = () =>

    reservationRepository.findAll();


export const getById = (id) =>

    reservationRepository.findById(id);


export const cancelReservation =

    async (id) => {

        const reservation =

            await reservationRepository.update(

                id,

                {

                    status:

                        "CANCELLED"

                }

            );

        if (!reservation)

            throw new ApiError(

                404,

                "Reservation not found"

            );


        await notificationService.createNotification({

            user:

                reservation.user,

            type:

                NOTIFICATION_TYPES.RESERVATION_EXPIRED,

            title:

                "Reservation Cancelled",

            message:

                "Your reservation has been cancelled.",

            metadata: {

                reservationId:

                    reservation._id

            }

        });


        return reservation;

    };