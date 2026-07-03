import Publisher from "../models/Publisher.js";

export const create = (data) => Publisher.create(data);

export const findAll = () =>
    Publisher.find().sort({ createdAt: -1 });

export const findById = (id) =>
    Publisher.findById(id);

export const findByName = (name) =>
    Publisher.findOne({ name });

export const update = (id, data) =>
    Publisher.findByIdAndUpdate(
        id,
        data,
        { new: true }
    );

export const remove = (id) =>
    Publisher.findByIdAndDelete(id);