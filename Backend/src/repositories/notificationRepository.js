import Notification from "../models/Notification.js";

export const create=(data)=>
    Notification.create(data);


export const findAll=()=>
    Notification.find()
    .populate("user")
    .sort({createdAt:-1});

export const findById=(id)=>{
    Notification.findById(id)
    .populate("user");
}

export const findByUser=(id)=>
    Notification.find({
        user:id
    })
    .sort({createdAt:-1});

export const markRead=(id)=>
    Notification.findByIdAndUpdate(
        id,
        {
            isRead:true
        },
        {
            new:true
        }
);

export const markAllRead=(userId)=>
    Notification.updateMany(
        {
            user:userId,
            isRead:false
        },
        {
            isRead:true
        }
);