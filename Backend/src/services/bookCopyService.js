import ApiError
    from "../utils/ApiError.js";

import * as repo
    from "../repositories/bookCopyRepository.js";


export const createBookCopy =
    async (data) => {

        const existing =

            await repo.findByBarcode(

                data.barcode

            );

        if (existing) {

            throw new ApiError(

                400,

                "Barcode already exists"

            );

        }

        return repo.create(data);

    };
export const getById = async (id) => {

    const copy =
        await repo.findById(id);

    if (!copy)

        throw new ApiError(

            404,

            "Book copy not found"

        );

    return copy;

};

export const getBookCopies =
    async () => {

        return repo.findAll();

    };


export const updateBookCopy =
    async (id, data) => {

        const copy =

            await repo.findById(id);

        if (!copy) {

            throw new ApiError(

                404,

                "Book copy not found"

            );

        }

        return repo.update(

            id,

            data

        );

    };


export const deleteBookCopy =
    async (id) => {

        const copy =

            await repo.findById(id);

        if (!copy) {

            throw new ApiError(

                404,

                "Book copy not found"

            );

        }

        await repo.remove(id);

    };