import * as fineRepository

    from "../repositories/fineRepository.js";

import ApiError

    from "../utils/ApiError.js";


export const createFine = (data) =>

    fineRepository.create(data);


export const getAll = () =>

    fineRepository.findAll();


export const getById = async (id) => {

    const fine =

        await fineRepository.findById(id);

    if (!fine) {

        throw new ApiError(

            404,

            "Fine not found"

        );

    }

    return fine;

};


export const getUserFines = (userId) =>

    fineRepository.findByUser(userId);


export const payFine = async (id) => {

    const fine =

        await fineRepository.findById(id);

    if (!fine) {

        throw new ApiError(

            404,

            "Fine not found"

        );

    }

    if (fine.status === "PAID") {

        throw new ApiError(

            400,

            "Fine already paid"

        );

    }

    return fineRepository.markPaid(id);

};