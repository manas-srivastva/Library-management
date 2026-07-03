import Reservation

    from "../models/Reservation.js";


export const create = (data) =>

    Reservation.create(data);


export const findAll = () =>

    Reservation.find()

        .populate("user")

        .populate("book");


export const findById = (id) =>

    Reservation.findById(id)

        .populate("user")

        .populate("book");


export const update = (id, data) =>

    Reservation.findByIdAndUpdate(

        id,

        data,

        { new: true }

    );


export const remove = (id) =>

    Reservation.findByIdAndDelete(id);