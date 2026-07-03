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


        return reservationRepository.create({

            user: user._id,

            book: book._id

        });

    };


export const getAll = () =>

    reservationRepository.findAll();


export const getById = (id) =>

    reservationRepository.findById(id);


export const cancelReservation =

    (id) => reservationRepository.update(

        id,

        {

            status: "CANCELLED"

        }

    );