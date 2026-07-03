import Book from "../models/Book.js";


export const create = (data) =>

    Book.create(data);


export const findByISBN = (isbn) =>

    Book.findOne({ isbn });


export const findById = (id) =>

    Book.findById(id)


        .populate("authors")

        .populate("publisher")

        .populate("category");


export const findAll = () =>


    Book.find()

        .populate("authors")

        .populate("publisher")

        .populate("category")

        .sort({ createdAt: -1 });


export const update = (id, data) =>

    Book.findByIdAndUpdate(

        id,

        data,

        { new: true }

    )

        .populate("authors")

        .populate("publisher")

        .populate("category");


export const remove = (id) =>

    Book.findByIdAndDelete(id);
