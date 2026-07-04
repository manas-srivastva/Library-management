import * as borrowRepository
from "../repositories/borrowRepository.js";

import User
from "../models/User.js";

import BookCopy
from "../models/BookCopy.js";

import ApiError
from "../utils/ApiError.js";

import * as fineRepository
from "../repositories/fineRepository.js";

export const borrowBook = async (data) => {

    const user = await User.findOne({

        email: data.user

    });

    if (!user)

        throw new ApiError(

            404,

            "User not found"

        );


    const issuer = await User.findOne({

        email: data.issuedBy

    });

    if (!issuer)

        throw new ApiError(

            404,

            "Issuer not found"

        );


    const copy = await BookCopy.findOne({

        barcode: data.barcode

    });

    if (!copy)

        throw new ApiError(

            404,

            "Book copy not found"

        );


    if (copy.status !== "AVAILABLE")

        throw new ApiError(

            400,

            "Copy unavailable"

        );


    const borrow = await borrowRepository.create(

        {

            user: user._id,

            issuedBy: issuer._id,

            bookCopy: copy._id,

            dueDate: data.dueDate

        }

    );


    copy.status = "BORROWED";

    await copy.save();


    return borrow;

};



export const getAll = () =>

    borrowRepository.findAll();



export const getById = (id) =>

    borrowRepository.findById(id);



export const getUserHistory = async (id) =>

    borrowRepository.findByUser(id);



export const returnBook = async (id) => {

    const borrow =

        await borrowRepository.findById(id);

    if (!borrow)

        throw new ApiError(

            404,

            "Borrow record not found"

        );

    if (borrow.status === "RETURNED")

        throw new ApiError(

            400,

            "Book already returned"

        );


    const today = new Date();


 if (today > borrow.dueDate) {

    const existingFine =

        await fineRepository.findByBorrowRecord(

            borrow._id

        );

    if (!existingFine) {

        const diff =

            today - borrow.dueDate;

        const daysLate = Math.ceil(

            diff /

            (1000 * 60 * 60 * 24)

        );

        const dailyRate = 10;

        const amount =

            daysLate * dailyRate;

        await fineRepository.create({

            borrowRecord:

                borrow._id,

            user:

                borrow.user,

            daysLate,

            dailyRate,

            amount

        });

    }

}


    borrow.status = "RETURNED";

    borrow.returnDate = today;

    await borrow.save();


    const copy =

        await BookCopy.findById(

            borrow.bookCopy._id

        );


    copy.status = "AVAILABLE";

    await copy.save();


    return borrow;

};