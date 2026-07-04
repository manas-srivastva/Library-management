import Fine from "../models/Fine.js";


export const create = (data) =>

    Fine.create(data);

 export const findByBorrowRecord = (id) =>

    Fine.findOne({

        borrowRecord: id

    });

export const findAll = () =>

    Fine.find()

        .populate("user")

        .populate({

            path: "borrowRecord",

            populate: {

                path: "bookCopy"

            }

        });


export const findById = (id) =>

    Fine.findById(id)

        .populate("user")

        .populate({

            path: "borrowRecord",

            populate: {

                path: "bookCopy"

            }

        });


export const findByUser = (userId) =>

    Fine.find({

        user: userId

    })

        .populate({

            path: "borrowRecord",

            populate: {

                path: "bookCopy"

            }

        });


export const markPaid = (id) =>

    Fine.findByIdAndUpdate(

        id,

        {

            status: "PAID",

            paidAt: new Date()

        },

        {

            new: true

        }

    );