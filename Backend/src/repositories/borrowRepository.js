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


export const findAll = () =>

    BorrowRecord.find()

        .populate("user")

        .populate("issuedBy")

        .populate({

            path: "bookCopy",

            populate: {

                path: "book"

            }

        });


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