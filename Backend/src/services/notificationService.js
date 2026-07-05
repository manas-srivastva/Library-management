import * as notificationRepository

from "../repositories/notificationRepository.js";


import ApiError

from "../utils/ApiError.js";


export const createNotification = async (

    data

) => {

    return await notificationRepository.create(

        data

    );

};


export const getAll = async () => {

    return await notificationRepository.findAll();

};


export const getById = async (id) => {

    const notification =

        await notificationRepository.findById(id);

    if (!notification)

        throw new ApiError(

            404,

            "Notification not found"

        );

    return notification;

};


export const getUserNotifications =

async (id) => {

    return await notificationRepository.findByUser(

        id

    );

};


export const markRead = async (id) => {

    const notification =

        await notificationRepository.markRead(

            id

        );

    if (!notification)

        throw new ApiError(

            404,

            "Notification not found"

        );

    return notification;

};


export const markAllRead = async (

    userId

) => {

    return await notificationRepository

        .markAllRead(

            userId

        );

};