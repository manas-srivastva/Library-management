import * as fineRepository

    from "../repositories/fineRepository.js";

import ApiError

    from "../utils/ApiError.js";
    import * as auditService
from "./auditService.js";

import { AUDIT_ACTIONS }
from "../constants/auditActions.js";


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

    const paidFine =

        await fineRepository.markPaid(id);


    await auditService.createLog({

        user:

            fine.user,

        action:

            AUDIT_ACTIONS.FINE_PAID,

        entity:

            "Fine",

        entityId:

            fine._id,

        metadata: {

            amount:

                fine.amount,

            borrowRecord:

                fine.borrowRecord

        }

    });


    return paidFine;

};