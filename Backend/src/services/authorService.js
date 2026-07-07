import ApiError from "../utils/ApiError.js";

import * as authorRepository
from "../repositories/authorRepository.js";


export const createAuthor = async (data) => {

    const existing =

    await authorRepository.findByName(

        data.name

    );

    if(existing){

        throw new ApiError(

            400,

            "Author already exists"

        );

    }

    return await authorRepository.createAuthor(

        data

    );

};
export const getById = async (id) => {

    const author = await authorRepository.findById(id);

    if (!author)
        throw new ApiError(
            404,
            "Author not found"
        );

    return author;

};

export const getAuthors = async () => {

    return await authorRepository.getAllAuthors();

};


export const updateAuthor = async (

    id,

    data) => {

    const author =

    await authorRepository.findById(

        id

    );

    if(!author){

        throw new ApiError(

            404,

            "Author not found"

        );

    }

    return await authorRepository.updateAuthor(

        id,

        data

    );

};


export const deleteAuthor = async(id)=>{

    const author=

    await authorRepository.findById(

        id

    );

    if(!author){

        throw new ApiError(

            404,

            "Author not found"

        );

    }

    await authorRepository.deleteAuthor(

        id

    );

};