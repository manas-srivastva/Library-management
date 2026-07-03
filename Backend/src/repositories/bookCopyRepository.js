import BookCopy
    from "../models/BookCopy.js";

export const create = (data) =>

    BookCopy.create(data);


export const findAll = () =>

    BookCopy.find()

        .populate("book");


export const findById = (id) =>

    BookCopy.findById(id)

        .populate("book");


export const findByBarcode = (barcode) =>

    BookCopy.findOne({

        barcode

    });


export const update = (id, data) =>

    BookCopy.findByIdAndUpdate(

        id,

        data,

        { new: true }

    )

        .populate("book");


export const remove = (id) =>

    BookCopy.findByIdAndDelete(id);
