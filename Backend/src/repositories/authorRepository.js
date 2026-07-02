import Author from "../models/Author.js";

export const createAuthor = (data) => {

    return Author.create(data);

};

export const findByName = (name) => {

    return Author.findOne({

        name

    });

};

export const findById = (id) => {

    return Author.findById(id);

};

export const getAllAuthors = () => {

    return Author.find();

};

export const updateAuthor = (id, data) => {

    return Author.findByIdAndUpdate(

        id,

        data,

        {

            new: true,

            runValidators: true

        }

    );

};

export const deleteAuthor = (id) => {

    return Author.findByIdAndDelete(id);

};