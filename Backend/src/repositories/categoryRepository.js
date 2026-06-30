import Category from "../models/Category.js";


export const createCategory = (data) => {

    return Category.create(data);

};


export const findByName = (name) => {

    return Category.findOne({

        name

    });

};


export const findById = (id) => {

    return Category.findById(id);

};


export const getAllCategories = () => {

    return Category.find();

};


export const updateCategory = (id, data) => {

    return Category.findByIdAndUpdate(

        id,

        data,

        {

            new: true,

            runValidators: true

        }

    );

};


export const deleteCategory = (id) => {

    return Category.findByIdAndDelete(id);

};