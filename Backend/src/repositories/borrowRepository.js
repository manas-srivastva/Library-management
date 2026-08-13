import BorrowRecord from "../models/BorrowRecord.js";

export const create = (data) =>

    BorrowRecord.create(data);


export const findById = (id) =>

    BorrowRecord.findById(id)

        .populate("user")

        .populate("issuedBy")

        .populate({

            path: "bookCopy",

            populate: {

                path: "book"

            }

        });


export const findAll = async () => {

    const borrows = await BorrowRecord.find()

        .populate("user")

        .populate("issuedBy")

        .populate({

            path: "bookCopy",

            populate: {

                path: "book"

            }

        });


    const Fine = (await import("../models/Fine.js")).default;


    const borrowsWithFine = await Promise.all(

        borrows.map(async (borrow) => {

            const fine = await Fine.findOne({

                borrowRecord: borrow._id

            });


            return {

                ...borrow.toObject(),

                fine: fine || null

            };

        })

    );


    return borrowsWithFine;

};


export const update = (id, data) =>

    BorrowRecord.findByIdAndUpdate(

        id,

        data,

        { new: true }

    );


export const findByUser = (userId) =>

    BorrowRecord.find({

        user: userId

    })

        .populate("bookCopy");


export const remove = (id) =>

    BorrowRecord.findByIdAndDelete(id);