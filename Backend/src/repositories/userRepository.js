import User from "../models/User.js";

const createUser=(data)=>{
    return User.create(data);
}

const findByEmail=(email)=>{
    return User.findOne({
        email
    });
};


const findById=(id)=>{
    return User.findById(id);
}

export {
    createUser,
    findByEmail,
    findById
}