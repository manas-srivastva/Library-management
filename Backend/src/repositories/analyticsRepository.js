import User from "../models/User.js";

import Book from "../models/Book.js";

import BorrowRecord from "../models/BorrowRecord.js";

import Reservation from "../models/Reservation.js";
import Fine from "../models/Fine.js";

export const overview=async()=>{
    const users=await User.countDocuments();

    const books=await Book.countDocuments();

    const borrows=await BorrowRecord.countDocuments();

    const reservations=await Reservation.countDocuments();

    const fines=await Fine.countDocuments();


    return {
        users,books,borrows,reservations,fines
    };
};


export const popularBooks=()=>
    BorrowRecord.aggregate([
        {
            $group:{
                _id:"$bookCopy",
                count:{
                    $sum:1
                }
            }
        },
        {
            $sort:{
                count:-1
            }
        },
        {
            $limit:10
        }
    ]);

export const activeMembers = () =>

    BorrowRecord.aggregate([

        {

            $group: {

                _id: "$user",

                totalBorrowed: {

                    $sum: 1

                }

            }

        },

        {

            $sort: {

                totalBorrowed: -1

            }

        },

        {

            $limit: 10

        }

    ]);

export const fineStats = () =>

    Fine.aggregate([

        {

            $group: {

                _id: "$status",

                total: {

                    $sum: "$amount"

                }

            }

        }

    ]);

export const monthlyBorrows = () =>

    BorrowRecord.aggregate([

        {

            $group: {

                _id: {

                    month: {

                        $month:

                            "$issueDate"

                    }

                },

                total: {

                    $sum: 1

                }

            }

        },

        {

            $sort: {

                "_id.month": 1

            }

        }

 ]);