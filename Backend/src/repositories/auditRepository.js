import AuditLog
from "../models/AuditLog.js";

export const create = (data) =>

    AuditLog.create(data);


export const findAll = () =>

    AuditLog.find()

        .populate("user")

        .sort({

            createdAt: -1

        });


export const findByUser = (id) =>

    AuditLog.find({

        user: id

    })

        .sort({

            createdAt: -1

        });


export const findById = (id) =>

    AuditLog.findById(id)

        .populate("user");