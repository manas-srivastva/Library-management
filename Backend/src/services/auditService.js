import * as auditRepository

from "../repositories/auditRepository.js";

export const createLog = (data) =>

    auditRepository.create(data);


export const getAll = () =>

    auditRepository.findAll();


export const getByUser = (id) =>

    auditRepository.findByUser(id);


export const getById = (id) =>

    auditRepository.findById(id);