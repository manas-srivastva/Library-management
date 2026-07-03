import ApiError from "../utils/ApiError.js";

import * as publisherRepo
    from "../repositories/publisherRepository.js";

export const createPublisher = async (data) => {

    const existing =
        await publisherRepo.findByName(data.name);

    if (existing) {

        throw new ApiError(
            400,
            "Publisher already exists"
        );

    }

    return publisherRepo.create(data);

};

export const getPublishers = async () => {

    return publisherRepo.findAll();

};

export const updatePublisher = async (id, data) => {

    const publisher =
        await publisherRepo.findById(id);

    if (!publisher) {

        throw new ApiError(
            404,
            "Publisher not found"
        );

    }

    return publisherRepo.update(id, data);

};

export const deletePublisher = async (id) => {

    const publisher =
        await publisherRepo.findById(id);

    if (!publisher) {

        throw new ApiError(
            404,
            "Publisher not found"
        );

    }

    await publisherRepo.remove(id);

    return true;

};